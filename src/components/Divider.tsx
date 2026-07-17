import type { A2UIDividerComponent } from '../types/a2ui';

interface DividerProps {
  component: A2UIDividerComponent;
}

export function Divider({ component }: DividerProps) {
  return <hr className="a2ui-divider" id={component.id} />;
}
