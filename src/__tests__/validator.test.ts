

import { describe, it, expect } from "vitest";
import { validateA2UIPayload, parseA2UIPayload } from "../lib/validator";

describe("validateA2UIPayload", () => {
  it("should validate a valid payload with text component", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "text", text: "Hello World", variant: "heading" },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.payload.components).toHaveLength(1);
      expect(result.payload.components[0].type).toBe("text");
    }
  });

  it("should validate a payload with button component", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "button", label: "Click me", action: "do_something", variant: "primary" },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });

  it("should validate nested card with children", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "card",
          title: "Test Card",
          children: [
            { type: "text", text: "Inside card" },
            { type: "button", label: "Action", action: "test" },
          ],
        },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });

  it("should validate form with input children", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "form",
          action: "submit_form",
          children: [
            {
              type: "text-field",
              name: "email",
              label: "Email",
              inputType: "email",
              required: true,
            },
            {
              type: "select",
              name: "country",
              label: "Country",
              options: [
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
              ],
            },
            {
              type: "checkbox",
              name: "agree",
              label: "I agree to terms",
            },
          ],
        },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });

  it("should validate graph component", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "graph",
          graphType: "bar",
          title: "Sales",
          data: [
            { name: "Jan", sales: 100 },
            { name: "Feb", sales: 200 },
          ],
        },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });

  it("should validate container with nested components", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "container",
          direction: "row",
          gap: 16,
          children: [
            {
              type: "card",
              title: "Card 1",
              children: [{ type: "text", text: "Content 1" }],
            },
            {
              type: "card",
              title: "Card 2",
              children: [{ type: "text", text: "Content 2" }],
            },
          ],
        },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });

  // ── Error Cases ─────────────────────────────────────────────

  it("should reject payload with wrong type", () => {
    const payload = {
      type: "not-a2ui",
      version: "0.9",
      components: [],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("should reject payload missing version", () => {
    const payload = {
      type: "a2ui",
      components: [],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(false);
  });

  it("should reject payload with invalid component type", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "invalid-type", foo: "bar" },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(false);
  });

  it("should reject button without action", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "button", label: "Click" },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(false);
  });

  it("should reject text-field without name", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "text-field", label: "Email" },
      ],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(false);
  });

  it("should reject null input", () => {
    const result = validateA2UIPayload(null);
    expect(result.success).toBe(false);
  });

  it("should reject non-object input", () => {
    const result = validateA2UIPayload("not an object");
    expect(result.success).toBe(false);
  });

  it("should validate empty components array", () => {
    const payload = {
      type: "a2ui",
      version: "0.9",
      components: [],
    };

    const result = validateA2UIPayload(payload);
    expect(result.success).toBe(true);
  });
});

describe("parseA2UIPayload", () => {
  it("should parse valid JSON string", () => {
    const json = JSON.stringify({
      type: "a2ui",
      version: "0.9",
      components: [{ type: "text", text: "Hello" }],
    });

    const result = parseA2UIPayload(json);
    expect(result.success).toBe(true);
  });

  it("should reject invalid JSON string", () => {
    const result = parseA2UIPayload("{ invalid json }");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toContain("Invalid JSON");
    }
  });

  it("should reject empty string", () => {
    const result = parseA2UIPayload("");
    expect(result.success).toBe(false);
  });
});
