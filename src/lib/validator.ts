

import { z } from "zod";
import type { A2UIPayload } from "../types/a2ui";

const TextComponentSchema = z.object({
  type: z.literal("text"),
  id: z.string().optional(),
  text: z.string(),
  variant: z.enum(["heading", "subheading", "body", "caption"]).optional(),
});

const ButtonComponentSchema = z.object({
  type: z.literal("button"),
  id: z.string().optional(),
  label: z.string(),
  action: z.string(),
  variant: z.enum(["primary", "secondary", "danger"]).optional(),
  disabled: z.boolean().optional(),
});

const TextFieldComponentSchema = z.object({
  type: z.literal("text-field"),
  id: z.string().optional(),
  name: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  inputType: z.enum(["text", "email", "password", "number", "tel"]).optional(),
  defaultValue: z.string().optional(),
});

const SelectComponentSchema = z.object({
  type: z.literal("select"),
  id: z.string().optional(),
  name: z.string(),
  label: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })),
  defaultValue: z.string().optional(),
});

const CheckboxComponentSchema = z.object({
  type: z.literal("checkbox"),
  id: z.string().optional(),
  name: z.string(),
  label: z.string(),
  defaultChecked: z.boolean().optional(),
});

const GraphComponentSchema = z.object({
  type: z.literal("graph"),
  id: z.string().optional(),
  graphType: z.enum(["bar", "line", "pie"]),
  title: z.string().optional(),
  data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  dataKeys: z.array(z.string()).optional(),
  xAxisKey: z.string().optional(),
});

const DatePickerComponentSchema = z.object({
  type: z.literal("date-picker"),
  id: z.string().optional(),
  name: z.string(),
  label: z.string(),
  defaultValue: z.string().optional(),
});

const TableComponentSchema = z.object({
  type: z.literal("table"),
  id: z.string().optional(),
  columns: z.array(
    z.object({
      header: z.string(),
      key: z.string(),
      align: z.enum(["left", "center", "right"]).optional(),
    })
  ),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
});

const BadgeComponentSchema = z.object({
  type: z.literal("badge"),
  id: z.string().optional(),
  text: z.string(),
  variant: z
    .enum(["success", "warning", "danger", "info", "neutral"])
    .optional(),
});

const ProgressComponentSchema = z.object({
  type: z.literal("progress"),
  id: z.string().optional(),
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
});

const DividerComponentSchema = z.object({
  type: z.literal("divider"),
  id: z.string().optional(),
});

const ComponentSchema: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion("type", [
    TextComponentSchema,
    ButtonComponentSchema,
    TextFieldComponentSchema,
    SelectComponentSchema,
    CheckboxComponentSchema,
    GraphComponentSchema,
    DatePickerComponentSchema,
    TableComponentSchema,
    BadgeComponentSchema,
    ProgressComponentSchema,
    DividerComponentSchema,
    z.object({
      type: z.literal("card"),
      id: z.string().optional(),
      title: z.string().optional(),
      children: z.array(ComponentSchema),
    }),
    z.object({
      type: z.literal("container"),
      id: z.string().optional(),
      direction: z.enum(["row", "column"]).optional(),
      gap: z.number().optional(),
      children: z.array(ComponentSchema),
    }),
    z.object({
      type: z.literal("form"),
      id: z.string().optional(),
      action: z.string(),
      children: z.array(ComponentSchema),
    }),
  ])
);

const A2UIPayloadSchema = z.object({
  type: z.literal("a2ui"),
  version: z.string(),
  components: z.array(ComponentSchema),
});

export interface ValidationSuccess {
  success: true;
  payload: A2UIPayload;
}

export interface ValidationError {
  success: false;
  errors: string[];
}

export type ValidationResult = ValidationSuccess | ValidationError;

export function validateA2UIPayload(input: unknown): ValidationResult {
  const result = A2UIPayloadSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      payload: result.data as A2UIPayload,
    };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path ? `[${path}] ` : ""}${issue.message}`;
  });

  return { success: false, errors };
}

export function parseA2UIPayload(json: string): ValidationResult {
  try {
    const parsed = JSON.parse(json);
    return validateA2UIPayload(parsed);
  } catch {
    return {
      success: false,
      errors: ["Invalid JSON: failed to parse input string"],
    };
  }
}
