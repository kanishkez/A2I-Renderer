import type { A2UIContainerComponent, A2UIComponent } from '../types/a2ui';

interface ContainerProps {
  component: A2UIContainerComponent;
  renderChildren: (children: A2UIComponent[]) => React.ReactNode;
}

export function Container({ component, renderChildren }: ContainerProps) {
  const { direction = 'column', gap } = component;

  return (
    <div
      className={`a2ui-container a2ui-container--${direction}`}
      style={{ gap: gap ? `${gap}px` : undefined }}
    >
      {renderChildren(component.children)}
    </div>
  );
}
