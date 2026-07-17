

import type { ChatMessage as ChatMessageType, A2UIActionHandler } from "../types/a2ui";
import { StreamingWrapper } from "../renderer/StreamingWrapper";

interface ChatMessageProps {
  message: ChatMessageType;
  onAction: A2UIActionHandler;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

const agentLabelMap: Record<string, string> = {
  intent_classifier: 'Intent',
  research_agent: 'Research',
  ui_generator: 'Generate',
};

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isAgent = message.role === "agent";

  return (
    <div className={`chat-message chat-message--${message.role}`}>
      
      <div className="chat-message__avatar">
        {isAgent ? "FA" : "U"}
      </div>

      <div className="chat-message__content">
        <span className="chat-message__name">
          {isAgent ? "FinAdvisor AI" : "You"}
        </span>

        {message.content && (
          <div className={`chat-message__text ${message.content.startsWith("Error:") ? "chat-message__text--error" : ""}`}>
            {message.content}
          </div>
        )}

        {message.payload && (
          <div className="chat-message__payload">
            <StreamingWrapper
              payload={message.payload}
              onAction={onAction}
              streamDelay={120}
            />
          </div>
        )}

        {isAgent && (message.tokenUsage || message.agentPipeline) && (
          <div className="chat-message__meta">
            {message.agentPipeline && message.agentPipeline.length > 0 && (
              <div className="chat-message__pipeline">
                {message.agentPipeline.map((agent, i) => (
                  <span key={agent} className="chat-message__pipeline-step">
                    {i > 0 && <span className="chat-message__pipeline-arrow">→</span>}
                    <span className="chat-message__pipeline-badge">
                      {agentLabelMap[agent] || agent}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {message.tokenUsage && (
              <span className="chat-message__tokens">
                Tokens: {formatNumber(message.tokenUsage.promptTokens)} prompt · {formatNumber(message.tokenUsage.completionTokens)} completion · {formatNumber(message.tokenUsage.totalTokens)} total
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
