import type { A2UIProgressComponent } from '../types/a2ui';

interface ProgressProps {
  component: A2UIProgressComponent;
}

export function Progress({ component }: ProgressProps) {
  const value = Math.min(100, Math.max(0, component.value));
  return (
    <div className="a2ui-progress" id={component.id}>
      <div className="a2ui-progress__header">
        <span className="a2ui-progress__label">{component.label}</span>
        <span className="a2ui-progress__value">{value.toFixed(1)}%</span>
      </div>
      <div className="a2ui-progress__track">
        <div
          className="a2ui-progress__fill"
          style={{
            width: `${value}%`,
            ...(component.color ? { background: component.color } : {}),
          }}
        />
      </div>
    </div>
  );
}
