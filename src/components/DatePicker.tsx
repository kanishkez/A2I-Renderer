import { useState, useCallback } from 'react';
import type { A2UIDatePickerComponent } from '../types/a2ui';

interface DatePickerProps {
  component: A2UIDatePickerComponent;
  value?: string;
  onChange?: (name: string, value: string) => void;
}

export function DatePicker({ component, value, onChange }: DatePickerProps) {
  const { name, label, defaultValue = '' } = component;
  const [localValue, setLocalValue] = useState(defaultValue);

  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : localValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="a2ui-date-picker">
      <label className="a2ui-date-picker__label" htmlFor={`date-${name}`}>
        {label}
      </label>
      <input
        id={`date-${name}`}
        type="date"
        className="a2ui-date-picker__input"
        name={name}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
}
