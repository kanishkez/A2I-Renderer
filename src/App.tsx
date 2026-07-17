import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, A2UIActionHandler } from './types/a2ui';
import { ChatMessage } from './components/ChatMessage';
import { streamChat, streamAction } from './lib/apiClient';
import type { SSEEvent } from './lib/apiClient';

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionId(): string {
  let id = sessionStorage.getItem('a2ui_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('a2ui_session_id', id);
  }
  return id;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: createId(),
      role: 'agent',
      content:
        'Welcome to FinAdvisor AI. I can help you analyze stocks, compare investments, build portfolios, and provide market insights. What would you like to explore today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const sessionId = useRef(getSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processStream = useCallback(async (stream: AsyncGenerator<SSEEvent>) => {
    let totalTokens = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const pipeline: string[] = [];

    for await (const event of stream) {
      switch (event.type) {
        case 'agent_start':
          setCurrentAgent(event.agent);
          pipeline.push(event.agent);
          setActiveAgents([...pipeline]);
          break;
        case 'agent_complete':
          setCurrentAgent(null);
          break;
        case 'payload': {
          totalTokens = event.total_tokens;
          const agentMsg: ChatMessageType = {
            id: createId(),
            role: 'agent',
            payload: event.payload,
            timestamp: new Date(),
            tokenUsage: {
              promptTokens: totalTokens.prompt_tokens,
              completionTokens: totalTokens.completion_tokens,
              totalTokens: totalTokens.total_tokens,
            },
            agentPipeline: [...pipeline],
          };
          setMessages((prev) => [...prev, agentMsg]);
          break;
        }
        case 'error': {
          const errorMsg: ChatMessageType = {
            id: createId(),
            role: 'agent',
            content: `Error: ${event.message}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
          break;
        }
        case 'done':
          break;
      }
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;
      const userMsg: ChatMessageType = {
        id: createId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsStreaming(true);
      setActiveAgents([]);
      setCurrentAgent(null);

      try {
        const stream = streamChat(sessionId.current, text.trim());
        await processStream(stream);
      } catch (err) {
        console.error(err);
        const errorMsg: ChatMessageType = {
          id: createId(),
          role: 'agent',
          content: 'Connection error. Please ensure the backend server is running on port 8000.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsStreaming(false);
        setCurrentAgent(null);
        setActiveAgents([]);
      }
    },
    [isStreaming, processStream]
  );

  const handleComponentAction: A2UIActionHandler = useCallback(
    async (action, data) => {
      setIsStreaming(true);
      setActiveAgents([]);
      setCurrentAgent(null);

      try {
        const stream = streamAction(
          sessionId.current,
          action,
          (data as Record<string, unknown>) || {}
        );
        await processStream(stream);
      } catch (err) {
        console.error(err);
      } finally {
        setIsStreaming(false);
        setCurrentAgent(null);
        setActiveAgents([]);
      }
    },
    [processStream]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputValue);
      inputRef.current?.focus();
    },
    [inputValue, sendMessage]
  );

  const suggestions = [
    'Compare RELIANCE and TCS',
    'Analyze INFY stock performance',
    'I want to invest ₹50,000',
    'Help me rebalance my portfolio',
    'What are the top banking stocks?',
  ];

  const agentSteps = [
    { key: 'intent_classifier', label: 'Intent' },
    { key: 'research_agent', label: 'Research' },
    { key: 'ui_generator', label: 'Generate' },
  ];

  const agentLabels: Record<string, string> = {
    intent_classifier: 'Classifying Intent',
    research_agent: 'Researching Data',
    ui_generator: 'Generating UI',
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <div className="sidebar__title">FinAdvisor AI</div>
              <div className="sidebar__subtitle">Intelligent Advisory</div>
            </div>
          </div>
        </div>

        <div className="sidebar__description">
          <p>
            AI-powered financial advisory platform. Get real-time stock analysis,
            portfolio insights, and investment recommendations powered by
            multi-agent intelligence.
          </p>
        </div>

        <div className="sidebar__section">
          <h3 className="sidebar__section-label">Quick Actions</h3>
          <div className="sidebar__suggestions">
            {suggestions.map((s) => (
              <button
                key={s}
                className="sidebar__item"
                onClick={() => sendMessage(s)}
                type="button"
                disabled={isStreaming}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar__section">
          <h3 className="sidebar__section-label">Components</h3>
          <div className="sidebar__component-list">
            {[
              'Text',
              'Button',
              'TextField',
              'Card',
              'Container',
              'Form',
              'Select',
              'Checkbox',
              'Graph',
              'DatePicker',
              'Table',
              'Badge',
              'Progress',
              'Divider',
            ].map((c) => (
              <span key={c} className="sidebar__tag">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="sidebar__footer">
          <span>Powered by A2UI Protocol</span>
        </div>
      </aside>

      <main className="chat">
        <header className="chat__header">
          <div>
            <div className="chat__header-title">FinAdvisor AI</div>
            <div className="chat__header-subtitle">
              {isStreaming && currentAgent
                ? agentLabels[currentAgent] || currentAgent
                : 'Ready'}
            </div>
          </div>
          <div className="chat__header-status">
            <button
              type="button"
              className="chat__theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <div className="chat__status-indicator">
              <span
                className={`chat__status-dot ${isStreaming ? 'chat__status-dot--active' : ''}`}
              />
              <span className="chat__status-text">
                {isStreaming ? 'Processing' : 'Online'}
              </span>
            </div>
          </div>
        </header>

        <div className="chat__messages">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onAction={handleComponentAction} />
          ))}

          {isStreaming && (
            <div className="chat-message">
              <div className="chat-message__avatar">FA</div>
              <div className="chat-message__content">
                <span className="chat-message__name">FinAdvisor AI</span>

                {activeAgents.length > 0 && (
                  <div className="agent-pipeline">
                    {agentSteps.map((step, i) => {
                      const isComplete = activeAgents.includes(step.key) && currentAgent !== step.key;
                      const isActive = currentAgent === step.key;
                      return (
                        <div key={step.key} className="agent-pipeline__step-wrap">
                          {i > 0 && <div className="agent-pipeline__connector" />}
                          <div
                            className={`agent-pipeline__step ${
                              isActive
                                ? 'agent-pipeline__step--active'
                                : isComplete
                                  ? 'agent-pipeline__step--complete'
                                  : 'agent-pipeline__step--pending'
                            }`}
                          >
                            <span className="agent-pipeline__dot" />
                            <span className="agent-pipeline__label">{step.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="a2ui-streaming__indicator" style={{ marginTop: '4px' }}>
                  <div className="a2ui-streaming__dot" />
                  <div className="a2ui-streaming__dot" />
                  <div className="a2ui-streaming__dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat__input-area" onSubmit={handleSubmit}>
          <div className="chat__input-wrap">
            <input
              ref={inputRef}
              className="chat__input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about stocks, portfolios, or market analysis..."
              disabled={isStreaming}
              autoFocus
            />
            <button
              className="chat__send-button"
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
