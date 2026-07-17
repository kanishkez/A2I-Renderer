import type { A2UIBadgeComponent } from '../types/a2ui';

interface BadgeProps {
  component: A2UIBadgeComponent;
}

export function Badge({ component }: BadgeProps) {
  const variant = component.variant || 'neutral';
  return (
    <span className={`a2ui-badge a2ui-badge--${variant}`} id={component.id}>
      {component.text}
    </span>
  );
}
