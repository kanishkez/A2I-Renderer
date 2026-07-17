

import type { A2UIPayload } from "../types/a2ui";
import { getActionResponse } from "./agentSimulator";

export function handleAction(
  action: string,
  data?: Record<string, unknown>
): A2UIPayload {
  const mappedResponse = getActionResponse(action);
  if (mappedResponse) {
    return mappedResponse;
  }

  if (action.startsWith("submit_") || action.startsWith("save_")) {
    return createSuccessPayload(action, data);
  }

  if (action.startsWith("select_plan_")) {
    const plan = action.replace("select_plan_", "").replace("_", " ");
    return {
      type: "a2ui",
      version: "0.9",
      components: [
        {
          type: "card",
          title: "Plan Selected",
          children: [
            {
              type: "text",
              text: `You've selected the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`,
              variant: "heading",
            },
            {
              type: "text",
              text: "We'll set up your account right away. You'll receive a confirmation email shortly.",
              variant: "body",
            },
            {
              type: "button",
              label: "Back to Plans",
              action: "show_pricing",
              variant: "secondary",
            },
          ],
        },
      ],
    };
  }

  return {
    type: "a2ui",
    version: "0.9",
    components: [
      {
        type: "card",
        children: [
          {
            type: "text",
            text: `Action "${action}" received!`,
            variant: "subheading",
          },
          {
            type: "text",
            text: "I've processed your request. Is there anything else I can help with?",
            variant: "body",
          },
          {
            type: "container",
            direction: "row",
            gap: 10,
            children: [
              {
                type: "button",
                label: "Back to Home",
                action: "show_home",
                variant: "secondary",
              },
            ],
          },
        ],
      },
    ],
  };
}

function createSuccessPayload(
  action: string,
  data?: Record<string, unknown>
): A2UIPayload {
  const actionName = action
    .replace("submit_", "")
    .replace("save_", "")
    .replace(/_/g, " ");

  const formSummary = data
    ? Object.entries(data)
        .filter(([, value]) => value !== "" && value !== false)
        .map(([key, value]) => `${formatKey(key)}: ${value}`)
        .join("\n")
    : "";

  return {
    type: "a2ui",
    version: "0.9",
    components: [
      {
        type: "card",
        title: "Submission Successful",
        children: [
          {
            type: "text",
            text: `Your ${actionName} has been submitted successfully!`,
            variant: "subheading",
          },
          ...(formSummary
            ? [
                {
                  type: "text" as const,
                  text: "Here's a summary of what you submitted:",
                  variant: "body" as const,
                },
                {
                  type: "text" as const,
                  text: formSummary,
                  variant: "caption" as const,
                },
              ]
            : []),
          {
            type: "text",
            text: "You'll receive a confirmation email shortly.",
            variant: "body",
          },
          {
            type: "container",
            direction: "row",
            gap: 10,
            children: [
              {
                type: "button",
                label: "Back to Home",
                action: "show_home",
                variant: "secondary",
              },
            ],
          },
        ],
      },
    ],
  };
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
