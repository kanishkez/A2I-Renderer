import type { A2UITextComponent } from '../types/a2ui';

interface TextProps {
  component: A2UITextComponent;
}

export function Text({ component }: TextProps) {
  const { text, variant = 'body' } = component;

  switch (variant) {
    case 'heading':
      return <h2 className="a2ui-text a2ui-text--heading">{text}</h2>;
    case 'subheading':
      return <h3 className="a2ui-text a2ui-text--subheading">{text}</h3>;
    case 'caption':
      return <span className="a2ui-text a2ui-text--caption">{text}</span>;
    case 'body':
    default:
      return <p className="a2ui-text a2ui-text--body">{text}</p>;
  }
}
