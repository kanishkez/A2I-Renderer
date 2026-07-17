

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { A2UIRenderer } from "../renderer/A2UIRenderer";
import type { A2UIPayload } from "../types/a2ui";

describe("A2UIRenderer", () => {
  const mockOnAction = vi.fn();

  afterEach(() => {
    mockOnAction.mockClear();
  });

  it("should render text component", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "text", text: "Hello World", variant: "heading" },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("should render text variants with correct elements", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "text", text: "Heading", variant: "heading" },
        { type: "text", text: "Subheading", variant: "subheading" },
        { type: "text", text: "Body text", variant: "body" },
        { type: "text", text: "Caption text", variant: "caption" },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    const heading = screen.getByText("Heading");
    expect(heading.tagName).toBe("H2");

    const subheading = screen.getByText("Subheading");
    expect(subheading.tagName).toBe("H3");

    const body = screen.getByText("Body text");
    expect(body.tagName).toBe("P");

    const caption = screen.getByText("Caption text");
    expect(caption.tagName).toBe("SPAN");
  });

  it("should render button and fire onAction on click", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "button", label: "Click Me", action: "test_action", variant: "primary" },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(mockOnAction).toHaveBeenCalledWith("test_action");
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it("should not fire onAction when button is disabled", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "button", label: "Disabled", action: "disabled_action", disabled: true },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    const button = screen.getByText("Disabled").closest("button");
    expect(button).toBeDisabled();

    fireEvent.click(button!);
    expect(mockOnAction).not.toHaveBeenCalled();
  });

  it("should render text-field with label", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "text-field",
          name: "email",
          label: "Email Address",
          placeholder: "you@example.com",
          inputType: "email",
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("should render card with title and children", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "card",
          title: "My Card",
          children: [
            { type: "text", text: "Card content" },
            { type: "button", label: "Card Button", action: "card_action" },
          ],
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("My Card")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
    expect(screen.getByText("Card Button")).toBeInTheDocument();
  });

  it("should render container with children", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "container",
          direction: "row",
          gap: 16,
          children: [
            { type: "text", text: "Column 1" },
            { type: "text", text: "Column 2" },
          ],
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  it("should render form and call onAction with form data on submit", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "form",
          action: "submit_form",
          children: [
            {
              type: "text-field",
              name: "username",
              label: "Username",
              defaultValue: "",
            },
          ],
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    // Type into the text field
    const input = screen.getByLabelText("Username");
    fireEvent.change(input, { target: { value: "testuser" } });

    // Submit the form
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(mockOnAction).toHaveBeenCalledWith("submit_form", { username: "testuser" });
  });

  it("should render select component with options", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "select",
          name: "country",
          label: "Country",
          options: [
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
          ],
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
  });

  it("should render checkbox component", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "checkbox",
          name: "agree",
          label: "I agree to terms",
          defaultChecked: false,
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);
    expect(screen.getByText("I agree to terms")).toBeInTheDocument();
  });

  it("should render unknown component type gracefully", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        // Force an unknown type
        { type: "magic-widget" as any, data: "test" } as any,
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);
    expect(screen.getByText(/Unknown component type/)).toBeInTheDocument();
  });

  it("should render deeply nested components", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "container",
          direction: "column",
          children: [
            {
              type: "card",
              title: "Outer Card",
              children: [
                {
                  type: "container",
                  direction: "row",
                  children: [
                    { type: "text", text: "Deep Text" },
                    { type: "button", label: "Deep Button", action: "deep_action" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("Outer Card")).toBeInTheDocument();
    expect(screen.getByText("Deep Text")).toBeInTheDocument();
    expect(screen.getByText("Deep Button")).toBeInTheDocument();

    // Click the deep button
    fireEvent.click(screen.getByText("Deep Button"));
    expect(mockOnAction).toHaveBeenCalledWith("deep_action");
  });

  it("should render multiple top-level components", () => {
    const payload: A2UIPayload = {
      type: "a2ui",
      version: "0.9",
      components: [
        { type: "text", text: "Title", variant: "heading" },
        { type: "text", text: "Description", variant: "body" },
        { type: "button", label: "Action", action: "test" },
      ],
    };

    render(<A2UIRenderer payload={payload} onAction={mockOnAction} />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
