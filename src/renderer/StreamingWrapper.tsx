

import { useState, useEffect, useRef } from "react";
import type { A2UIPayload, A2UIActionHandler } from "../types/a2ui";
import { A2UIRenderer } from "./A2UIRenderer";

interface StreamingWrapperProps {
  
  payload: A2UIPayload;
  
  onAction: A2UIActionHandler;
  
  streamDelay?: number;
  
  animate?: boolean;
}

export function StreamingWrapper({
  payload,
  onAction,
  streamDelay = 150,
  animate = true,
}: StreamingWrapperProps) {
  const totalComponents = payload.components.length;
  const [visibleCount, setVisibleCount] = useState(
    animate ? 0 : totalComponents
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(totalComponents);
      return;
    }

    setVisibleCount(0);

    timerRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= totalComponents) {
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return next;
      });
    }, streamDelay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [payload, animate, streamDelay, totalComponents]);

  const visiblePayload: A2UIPayload = {
    ...payload,
    components: payload.components.slice(0, visibleCount),
  };

  return (
    <div className="a2ui-streaming">
      {visibleCount > 0 && (
        <A2UIRenderer payload={visiblePayload} onAction={onAction} />
      )}
      {visibleCount < totalComponents && (
        <div className="a2ui-streaming__indicator">
          <span className="a2ui-streaming__dot" />
          <span className="a2ui-streaming__dot" />
          <span className="a2ui-streaming__dot" />
        </div>
      )}
    </div>
  );
}
