import json
import google.generativeai as genai
from prompts.system_prompt import SYSTEM_PROMPT

class UIGenerator:
    def __init__(self, api_key: str, model_name: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_PROMPT,
            generation_config={"temperature": 0.3, "response_mime_type": "application/json"}
        )
        self.last_token_usage = {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}

    async def run(self, research_data: dict, history: list, intent: str, error_feedback: str | None = None) -> dict:
        prompt = f"Intent: {intent}\\n\\nResearch Data:\\n{json.dumps(research_data, indent=2)}\\n"
        
        # Add conversation history
        history_msgs = []
        for msg in history[-5:]:  # Last 5 messages for context
            role = 'User' if msg['role'] == 'user' else 'Assistant'
            content = msg.get('content')
            if content:
                history_msgs.append(f"{role}: {content}")
            
        if history_msgs:
            prompt += "\\nRecent History:\\n" + "\\n".join(history_msgs) + "\\n"
            
        if error_feedback:
            prompt += f"\\nCRITICAL INSTRUCTION: {error_feedback}\\n"
            
        response = self.model.generate_content(prompt)
        
        if hasattr(response, 'usage_metadata'):
            self.last_token_usage = {
                'prompt_tokens': response.usage_metadata.prompt_token_count,
                'completion_tokens': response.usage_metadata.candidates_token_count,
                'total_tokens': response.usage_metadata.total_token_count
            }
            
        try:
            return json.loads(response.text)
        except Exception:
            return {
                "type": "a2ui",
                "version": "1.0",
                "components": [{"type": "text", "text": "Failed to generate valid UI JSON.", "variant": "body"}]
            }
