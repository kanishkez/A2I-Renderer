import json
import google.generativeai as genai
from prompts.research_prompt import RESEARCH_PROMPT
from tools.stock_tools import get_stock_comparison, calculate_allocation, get_stock_info

class ResearchAgent:
    def __init__(self, api_key: str, model_name: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=RESEARCH_PROMPT,
            generation_config={"temperature": 0.2, "response_mime_type": "application/json"}
        )
        self.last_token_usage = {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}

    async def run(self, intent: str, entities: dict, history: list) -> dict:
        self.last_token_usage = {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}
        
        # Route locally without LLM tool-calling overhead to make it fast
        data = {}
        
        try:
            if intent == 'compare_stocks':
                stocks = entities.get('stocks', [])
                if not stocks and len(history) >= 2:
                    # Very naive fallback
                    stocks = ['RELIANCE', 'TCS']
                if stocks:
                    data = get_stock_comparison(stocks)
            
            elif intent == 'portfolio_allocation':
                amount = float(entities.get('amount', 50000))
                risk = entities.get('risk_profile', 'moderate')
                data = calculate_allocation(amount, risk)
                
            elif intent == 'stock_info':
                stocks = entities.get('stocks', [])
                if stocks:
                    data = get_stock_info(stocks[0])
            
            # Use LLM to summarize the findings
            prompt = f"Intent: {intent}\\nEntities: {json.dumps(entities)}\\nRaw Data: {json.dumps(data)}"
            response = self.model.generate_content(prompt)
            
            if hasattr(response, 'usage_metadata'):
                self.last_token_usage = {
                    'prompt_tokens': response.usage_metadata.prompt_token_count,
                    'completion_tokens': response.usage_metadata.candidates_token_count,
                    'total_tokens': response.usage_metadata.total_token_count
                }
            
            return json.loads(response.text)
            
        except Exception as e:
            return {"summary": "Error fetching data.", "error": str(e), "data": data}
