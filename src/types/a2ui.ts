

interface A2UIBaseComponent {
  
  id?: string;
}

export interface A2UITextComponent extends A2UIBaseComponent {
  type: "text";
  text: string;
  variant?: "heading" | "subheading" | "body" | "caption";
}

export interface A2UIButtonComponent extends A2UIBaseComponent {
  type: "button";
  label: string;
  
  action: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export interface A2UITextFieldComponent extends A2UIBaseComponent {
  type: "text-field";
  
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  inputType?: "text" | "email" | "password" | "number" | "tel";
  defaultValue?: string;
}

export interface A2UICardComponent extends A2UIBaseComponent {
  type: "card";
  title?: string;
  children: A2UIComponent[];
}

export interface A2UIContainerComponent extends A2UIBaseComponent {
  type: "container";
  direction?: "row" | "column";
  gap?: number;
  children: A2UIComponent[];
}

export interface A2UIFormComponent extends A2UIBaseComponent {
  type: "form";
  
  action: string;
  children: A2UIComponent[];
}

export interface A2UISelectComponent extends A2UIBaseComponent {
  type: "select";
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

export interface A2UICheckboxComponent extends A2UIBaseComponent {
  type: "checkbox";
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export interface A2UIGraphComponent extends A2UIBaseComponent {
  type: "graph";
  graphType: "bar" | "line" | "pie";
  title?: string;
  data: Array<Record<string, string | number>>;
  dataKeys?: string[];
  xAxisKey?: string;
}

export interface A2UIDatePickerComponent extends A2UIBaseComponent {
  type: "date-picker";
  name: string;
  label: string;
  defaultValue?: string;
}

export interface A2UITableComponent extends A2UIBaseComponent {
  type: "table";
  columns: Array<{ header: string; key: string; align?: "left" | "center" | "right" }>;
  rows: Array<Record<string, string | number>>;
}

export interface A2UIBadgeComponent extends A2UIBaseComponent {
  type: "badge";
  text: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

export interface A2UIProgressComponent extends A2UIBaseComponent {
  type: "progress";
  label: string;
  value: number;
  color?: string;
}

export interface A2UIDividerComponent extends A2UIBaseComponent {
  type: "divider";
}

export type A2UIComponent =
  | A2UITextComponent
  | A2UIButtonComponent
  | A2UITextFieldComponent
  | A2UICardComponent
  | A2UIContainerComponent
  | A2UIFormComponent
  | A2UISelectComponent
  | A2UICheckboxComponent
  | A2UIGraphComponent
  | A2UIDatePickerComponent
  | A2UITableComponent
  | A2UIBadgeComponent
  | A2UIProgressComponent
  | A2UIDividerComponent;

export interface A2UIPayload {
  type: "a2ui";
  version: string;
  components: A2UIComponent[];
}

export type A2UIActionHandler = (
  action: string,
  data?: Record<string, unknown>
) => void;

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content?: string;
  payload?: A2UIPayload;
  timestamp: Date;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  agentPipeline?: string[];
}
