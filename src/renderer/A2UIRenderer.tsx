

import React, { useCallback } from "react";
import type {
  A2UIPayload,
  A2UIComponent,
  A2UIActionHandler,
} from "../types/a2ui";
import type { FormContext } from "../components/Form";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { Form } from "../components/Form";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { Graph } from "../components/Graph";
import { DatePicker } from "../components/DatePicker";
import { Table } from "../components/Table";
import { Badge } from "../components/Badge";
import { Progress } from "../components/Progress";
import { Divider } from "../components/Divider";
import { UnknownComponent } from "../components/UnknownComponent";
import { ErrorBoundary } from "../components/ErrorBoundary";

interface A2UIRendererProps {
  
  payload: A2UIPayload;
  
  onAction: A2UIActionHandler;
}

export function A2UIRenderer({ payload, onAction }: A2UIRendererProps) {
  
  const renderChildren = useCallback(
    (
      children: A2UIComponent[],
      formContext?: FormContext
    ): React.ReactNode => {
      return children.map((child, index) =>
        renderComponent(child, index, formContext)
      );
    },
    [onAction]
  );

  const renderComponent = useCallback(
    (
      component: A2UIComponent,
      index: number,
      formContext?: FormContext
    ): React.ReactNode => {
      const key = component.id || `a2ui-${component.type}-${index}`;

      switch (component.type) {
        case "text":
          return <Text key={key} component={component} />;

        case "graph":
          return <Graph key={key} component={component} />;

        case "table":
          return <Table key={key} component={component} />;

        case "badge":
          return <Badge key={key} component={component} />;

        case "progress":
          return <Progress key={key} component={component} />;

        case "divider":
          return <Divider key={key} component={component} />;

        case "button":
          return (
            <Button key={key} component={component} onAction={onAction} />
          );

        case "text-field":
          return (
            <TextField
              key={key}
              component={component}
              value={
                formContext?.values[component.name] as string | undefined
              }
              onChange={
                formContext?.onChange as
                  | ((name: string, value: string) => void)
                  | undefined
              }
            />
          );

        case "select":
          return (
            <Select
              key={key}
              component={component}
              value={
                formContext?.values[component.name] as string | undefined
              }
              onChange={
                formContext?.onChange as
                  | ((name: string, value: string) => void)
                  | undefined
              }
            />
          );

        case "checkbox":
          return (
            <Checkbox
              key={key}
              component={component}
              checked={
                formContext?.values[component.name] as boolean | undefined
              }
              onChange={
                formContext?.onChange as
                  | ((name: string, value: boolean) => void)
                  | undefined
              }
            />
          );

        case "date-picker":
          return (
            <DatePicker
              key={key}
              component={component}
              value={
                formContext?.values[component.name] as string | undefined
              }
              onChange={
                formContext?.onChange as
                  | ((name: string, value: string) => void)
                  | undefined
              }
            />
          );

        case "card":
          return (
            <Card
              key={key}
              component={component}
              renderChildren={(children) =>
                renderChildren(children, formContext)
              }
            />
          );

        case "container":
          return (
            <Container
              key={key}
              component={component}
              renderChildren={(children) =>
                renderChildren(children, formContext)
              }
            />
          );

        case "form":
          return (
            <Form
              key={key}
              component={component}
              onAction={onAction}
              renderChildren={(children, ctx) =>
                renderChildren(children, ctx)
              }
            />
          );

        default: {
          const unknownComponent = component as { type: string };
          return (
            <UnknownComponent
              key={key}
              type={unknownComponent.type}
              data={component}
            />
          );
        }
      }
    },
    [onAction, renderChildren]
  );

  return (
    <ErrorBoundary>
      <div className="a2ui-renderer">
        {payload.components.map((component, index) =>
          renderComponent(component, index)
        )}
      </div>
    </ErrorBoundary>
  );
}
