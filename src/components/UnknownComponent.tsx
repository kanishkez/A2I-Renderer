import { useState } from 'react';

interface UnknownComponentProps {
  type: string;
  data: unknown;
}

export function UnknownComponent({ type, data }: UnknownComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="a2ui-unknown">
      <span className="a2ui-unknown__icon">?</span>
      <span className="a2ui-unknown__text">
        Unknown component type: "{type}"
      </span>
      <details
        className="a2ui-unknown__details"
        open={isOpen}
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary>Raw data</summary>
        <pre className="a2ui-unknown__pre">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
