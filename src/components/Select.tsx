import { useState, useCallback } from 'react';
import type { A2UISelectComponent } from '../types/a2ui';

interface SelectProps {
  component: A2UISelectComponent;
  value?: string;
  onChange?: (name: string, value: string) => void;
}

export function Select({ component, value, onChange }: SelectProps) {
  const { name, label, options, defaultValue = '' } = component;
  const [localValue, setLocalValue] = useState(defaultValue);

  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : localValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      if (isControlled) {
        onChange!(name, newValue);
      } else {
        setLocalValue(newValue);
      }
    },
    [isControlled, onChange, name]
  );

  return (
    <div className="a2ui-select">
      <label className="a2ui-select__label" htmlFor={`select-${name}`}>
        {label}
      </label>
      <select
        id={`select-${name}`}
        className="a2ui-select__input"
        value={currentValue}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
