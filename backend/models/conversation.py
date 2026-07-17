from datetime import datetime
from typing import Any

class ConversationStore:
    def __init__(self):
        self._store: dict[str, list[dict[str, Any]]] = {}
    
    def add_message(self, session_id: str, role: str, content: str | None = None, payload: dict | None = None):
        if session_id not in self._store:
            self._store[session_id] = []
        
        self._store[session_id].append({
            'role': role,
            'content': content,
            'payload': payload,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_history(self, session_id: str) -> list[dict[str, Any]]:
        return self._store.get(session_id, [])
    
    def clear(self, session_id: str):
        self._store.pop(session_id, None)

conversation_store = ConversationStore()
