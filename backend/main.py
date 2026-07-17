import json
import os
import asyncio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

from models.conversation import conversation_store
from agents.intent_classifier import IntentClassifier
from agents.research_agent import ResearchAgent
from agents.ui_generator import UIGenerator
from validator import validate_and_retry

load_dotenv()

app = FastAPI(title="FinAdvisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY", "")
PRIMARY_MODEL = os.getenv("PRIMARY_MODEL", "gemini-2.5-flash")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "gemini-2.5-flash")

def create_agents(model: str):
    return (
        IntentClassifier(API_KEY, model),
        ResearchAgent(API_KEY, model),
        UIGenerator(API_KEY, model)
    )

def sse_event(event_type: str, data: dict) -> str:
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

async def process_chat(session_id: str, message: str):
    model = PRIMARY_MODEL
    total_tokens = {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}
    
    try:
        conversation_store.add_message(session_id, 'user', content=message)
        history = conversation_store.get_history(session_id)
        
        # 1. Intent Classification
        yield sse_event('agent_start', {'agent': 'intent_classifier'})
        intent_agent, research_agent, ui_agent = create_agents(model)
        
        try:
            intent_result = await intent_agent.run(message, history)
        except Exception as e:
            print(f"Primary model intent_agent failed: {e}")
            # Fallback
            model = FALLBACK_MODEL
            intent_agent, research_agent, ui_agent = create_agents(model)
            intent_result = await intent_agent.run(message, history)
            
        yield sse_event('agent_complete', {
            'agent': 'intent_classifier',
            'result': intent_result,
            'token_usage': intent_agent.last_token_usage
        })
        
        # 2. Research
        yield sse_event('agent_start', {'agent': 'research_agent'})
        research_data = await research_agent.run(
            intent_result.get('intent', 'general_query'),
            intent_result.get('entities', {}),
            history
        )
        yield sse_event('agent_complete', {
            'agent': 'research_agent',
            'token_usage': research_agent.last_token_usage
        })
        
        # 3. UI Generation (with validator & retry loop)
        yield sse_event('agent_start', {'agent': 'ui_generator'})
        payload = await validate_and_retry(
            ui_agent,
            {'research_data': research_data, 'history': history, 'intent': intent_result.get('intent')}
        )
        yield sse_event('agent_complete', {
            'agent': 'ui_generator',
            'token_usage': ui_agent.last_token_usage
        })
        
        # Accumulate tokens
        for agent in [intent_agent, research_agent, ui_agent]:
            for k in total_tokens:
                total_tokens[k] += agent.last_token_usage.get(k, 0)
        
        conversation_store.add_message(session_id, 'agent', payload=payload)
        
        yield sse_event('payload', {
            'payload': payload,
            'total_tokens': total_tokens
        })
        
    except Exception as e:
        yield sse_event('error', {'message': str(e)})
        
    yield sse_event('done', {})

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    session_id = data.get('session_id', 'default')
    message = data.get('message', '')
    if not message:
        raise HTTPException(400, "Message required")
        
    return StreamingResponse(
        process_chat(session_id, message),
        media_type='text/event-stream'
    )

@app.post("/api/chat/action")
async def chat_action(request: Request):
    data = await request.json()
    session_id = data.get('session_id', 'default')
    action = data.get('action', '')
    payload_data = data.get('data', {})
    
    # Convert form submission into a natural language query for the LLM
    message = f"User submitted form action '{action}' with data: {json.dumps(payload_data)}"
    
    return StreamingResponse(
        process_chat(session_id, message),
        media_type='text/event-stream'
    )

@app.get("/api/health")
async def health():
    return {"status": "ok", "model": PRIMARY_MODEL}
