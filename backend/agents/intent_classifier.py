import json
import google.generativeai as genai
from prompts.intent_prompt import INTENT_PROMPT
from models.a2ui_schema import TokenUsage

class IntentClassifier:
    def __init__(self, api_key: str, model_name: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=INTENT_PROMPT,
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"}
        )
        self.last_token_usage = {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}

    async def run(self, message: str, history: list) -> dict:
        # We'll include a brief history summary if needed, but for now just pass the message
        # to save tokens and latency on this fast step
        
        # Use synchronous generate_content since the genai async wrapper can sometimes be finicky 
        # without proper asyncio setup, but we are inside an async router so it's fine.
        response = self.model.generate_content(message)
        
        if hasattr(response, 'usage_metadata'):
            self.last_token_usage = {
                'prompt_tokens': response.usage_metadata.prompt_token_count,
                'completion_tokens': response.usage_metadata.candidates_token_count,
                'total_tokens': response.usage_metadata.total_token_count
            }
            
        try:
            return json.loads(response.text)
        except Exception:
            return {"intent": "general_query", "entities": {}}
