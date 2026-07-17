import { useCallback } from 'react';
import type { A2UIButtonComponent, A2UIActionHandler } from '../types/a2ui';

interface ButtonProps {
  component: A2UIButtonComponent;
  onAction: A2UIActionHandler;
}

export function Button({ component, onAction }: ButtonProps) {
  const { label, action, variant = 'primary', disabled = false } = component;

  const handleClick = useCallback(() => {
    if (!disabled) {
      onAction(action);
    }
  }, [action, disabled, onAction]);

  return (
    <button
      className={`a2ui-button a2ui-button--${variant}`}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      <span className="a2ui-button__label">{label}</span>
      <span className="a2ui-button__ripple" />
    </button>
  );
}
