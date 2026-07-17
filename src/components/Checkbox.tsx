import { useState, useCallback } from 'react';
import type { A2UICheckboxComponent } from '../types/a2ui';

interface CheckboxProps {
  component: A2UICheckboxComponent;
  checked?: boolean;
  onChange?: (name: string, value: boolean) => void;
}

export function Checkbox({ component, checked, onChange }: CheckboxProps) {
  const { name, label, defaultChecked = false } = component;
  const [localChecked, setLocalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined && onChange !== undefined;
  const currentChecked = isControlled ? checked : localChecked;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (isControlled) {
        onChange!(name, newChecked);
      } else {
        setLocalChecked(newChecked);
      }
    },
    [isControlled, onChange, name]
  );

  return (
    <label className="a2ui-checkbox">
      <input
        type="checkbox"
        className="a2ui-checkbox__input"
        name={name}
        checked={currentChecked}
        onChange={handleChange}
      />
      <span className="a2ui-checkbox__checkmark" />
      <span className="a2ui-checkbox__label">{label}</span>
    </label>
  );
}
