import { useState, useCallback } from 'react';
import type { A2UITextFieldComponent } from '../types/a2ui';

interface TextFieldProps {
  component: A2UITextFieldComponent;
  value?: string;
  onChange?: (name: string, value: string) => void;
}

export function TextField({ component, value, onChange }: TextFieldProps) {
  const { name, label, placeholder, required, inputType = 'text', defaultValue = '' } = component;
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
    <div className="a2ui-text-field">
      <label className="a2ui-text-field__label" htmlFor={`field-${name}`}>
        {label}
        {required && <span className="a2ui-text-field__required"> *</span>}
      </label>
      <input
        id={`field-${name}`}
        className="a2ui-text-field__input"
        type={inputType}
        name={name}
        placeholder={placeholder}
        required={required}
        value={currentValue}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
}
