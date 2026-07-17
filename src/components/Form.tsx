import { useState, useCallback } from 'react';
import type {
  A2UIFormComponent,
  A2UIComponent,
  A2UIActionHandler,
} from '../types/a2ui';

export interface FormContext {
  values: Record<string, string | boolean>;
  onChange: (name: string, value: string | boolean) => void;
}

interface FormProps {
  component: A2UIFormComponent;
  onAction: A2UIActionHandler;
  renderChildren: (
    children: A2UIComponent[],
    formContext?: FormContext
  ) => React.ReactNode;
}

function extractDefaults(
  children: A2UIComponent[]
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {};

  for (const child of children) {
    switch (child.type) {
      case 'text-field':
        defaults[child.name] = child.defaultValue || '';
        break;
      case 'select':
        defaults[child.name] = child.defaultValue || '';
        break;
      case 'checkbox':
        defaults[child.name] = child.defaultChecked || false;
        break;
      case 'date-picker':
        defaults[child.name] = child.defaultValue || '';
        break;
      case 'card':
      case 'container':
        Object.assign(defaults, extractDefaults(child.children));
        break;
    }
  }

  return defaults;
}

export function Form({ component, onAction, renderChildren }: FormProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    extractDefaults(component.children)
  );

  const handleChange = useCallback(
    (name: string, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onAction(component.action, values);
    },
    [component.action, onAction, values]
  );

  const formContext: FormContext = { values, onChange: handleChange };

  return (
    <form className="a2ui-form" onSubmit={handleSubmit}>
      {renderChildren(component.children, formContext)}
      <button type="submit" className="a2ui-button a2ui-button--primary a2ui-form__submit">
        Submit
      </button>
    </form>
  );
}
