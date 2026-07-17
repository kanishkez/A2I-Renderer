# FinAdvisor AI

FinAdvisor AI is an intelligent, multi-agent financial advisory platform powered by the Agent-to-UI (A2UI) protocol. It dynamically generates tailored, interactive financial dashboards, portfolios, and stock comparisons in real-time.

## Features

- **Multi-Agent Pipeline**: 
  - **Intent Classifier**: Accurately parses user requests (e.g. stock comparisons, portfolio generation, general market queries).
  - **Research Agent**: Fetches real-time financial metrics, historical prices, and portfolio algorithms using Yahoo Finance (`yfinance`).
  - **UI Generator**: Uses the research context to dynamically construct strict, responsive A2UI JSON payloads.
- **Agent-to-UI (A2UI) Protocol**: The backend streams declarative JSON that the frontend React engine safely parses and renders as native components (Cards, Tables, Forms, Interactive Badges).
- **Server-Sent Events (SSE)**: Fully streaming architecture for real-time responsiveness.
- **Premium Design**: Sleek, professional "SaaS" aesthetic with a built-in persistent Light/Dark mode toggle, utilizing a customized Tailwind-like Zinc color palette.
- **Full Type Safety**: End-to-end type validation using Python Pydantic models on the backend and TypeScript on the frontend.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)

### Backend Setup

1. Navigate to the backend directory and set up a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

2. Install the Python dependencies:
```bash
pip install -r requirements.txt
```

3. Add your Gemini API Key:
Add your key to `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
PRIMARY_MODEL=gemini-2.5-pro
FALLBACK_MODEL=gemini-2.5-flash
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. In a new terminal window, navigate to the project root and install the dependencies:
```bash
npm install
```

2. Start the Vite development server:
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser.

## Architecture & Assignment Details

### Prompt Design Rationale
The application utilizes three specialized prompts to drive the agent pipeline:
1. **Intent Classifier Prompt**: Designed for maximum speed and strict entity extraction. It strictly outputs a small JSON object (`{"intent": "compare_stocks", "entities": ...}`) with zero reasoning tokens, keeping latency minimal.
2. **Research Agent Prompt**: Acts as the data bridge. It analyzes the intent and dynamically decides which Python tool (e.g., Yahoo Finance `yfinance`) to call. It consolidates the raw market data into a structured context window.
3. **UI Generator System Prompt**: The core of the A2UI protocol. The system prompt contains the strict JSON schema for all 14 supported A2UI components and 3 highly detailed few-shot examples (Stock Comparison, Portfolio Builder, Recommendation Summary). By providing exact structural examples, the LLM correctly infers how to nest components (e.g., placing text inside cards inside a row-direction container) without requiring explicit structural code generation.

### What Broke & How I Fixed It
1. **Model Context Fallback & Quota Exceeded (429s)**: During initial testing, the free tier Gemini API frequently hit `RESOURCE_EXHAUSTED` (429) rate limits due to the heavy token usage of the UI generation step. I fixed this by implementing a robust `FALLBACK_MODEL` strategy in `main.py`. If the primary model fails or hits limits, the pipeline instantly degrades gracefully to a smaller, faster model (e.g., `gemini-2.5-flash`).
2. **Strict JSON Parsing Errors**: The LLM occasionally output markdown code blocks (````json ... ````) instead of raw JSON. I fixed this by setting `response_mime_type="application/json"` in the Gemini API configuration, forcing the model to return valid, raw JSON directly, entirely bypassing the need for regex stripping.
3. **Typescript Strictness on Recursive Payloads**: TypeScript struggled with recursive component typing (e.g., a Card component containing a child array of any A2UI Component). I resolved this by explicitly defining a discriminated union (`A2UIComponent`) based on the string literal `type`, allowing TypeScript to properly narrow types recursively.

### What I Would Do Differently at Production Scale
- **WebSockets over SSE**: While Server-Sent Events (SSE) worked beautifully for unidirectional streaming (Backend → Frontend), a true production app would benefit from bidirectional WebSockets. This allows the frontend to instantly push user events (button clicks, form submits) back through the same persistent connection, avoiding the overhead of establishing new HTTP POST requests for every action.
- **Agent Caching Layer (Redis)**: Currently, the Research Agent fetches live `yfinance` data on every query. At scale, this would severely rate-limit our IPs. I would introduce a Redis caching layer for market data (TTL of 5-10 minutes) and cache structural UI outputs for identical queries using Semantic Caching.
- **Isolated Validation Server**: The Pydantic validation and retry loop currently runs synchronously within the main agent pipeline. At scale, validation of massive dynamic UIs should be handled by a dedicated, hyper-fast microservice (potentially in Rust or Go) to keep the primary Python orchestrator unblocked.

## License

MIT License
