import type { A2UICardComponent, A2UIComponent } from '../types/a2ui';

interface CardProps {
  component: A2UICardComponent;
  renderChildren: (children: A2UIComponent[]) => React.ReactNode;
}

export function Card({ component, renderChildren }: CardProps) {
  return (
    <div className="a2ui-card">
      {component.title && (
        <h3 className="a2ui-card__header">{component.title}</h3>
      )}
      <div className="a2ui-card__content">
        {renderChildren(component.children)}
      </div>
    </div>
  );
}
