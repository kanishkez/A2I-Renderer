import { GoogleGenerativeAI } from "@google/generative-ai";
import type { A2UIPayload } from "../types/a2ui";

const SYSTEM_PROMPT = `You are a sophisticated A2UI agent. Your job is to return ONLY a valid JSON payload that strictly conforms to the A2UI component specification based on the user's prompt. 
You must NEVER return markdown, conversational text, or anything outside of the JSON. 

BEHAVIORAL RULE: Do NOT act like a chatbot answering questions. Do NOT provide conversational responses or informational essays inside text components. Your ONLY purpose is to design and build user interfaces (dashboards, forms, layouts, wireframes, app structures). If a user asks a question or requests information, build a realistic UI related to that topic (with mock data or placeholder text) rather than just answering the question directly.

The A2UIPayload schema has the following structure:
{
  "type": "a2ui",
  "version": "1.0",
  "components": [ ... ]
}

Available Component Types (they must be exactly one of these):
1. text: { "type": "text", "id"?: "...", "text": string, "variant"?: "heading" | "subheading" | "body" | "caption" }
2. button: { "type": "button", "id"?: "...", "label": string, "action": string, "variant"?: "primary" | "secondary" | "danger", "disabled"?: boolean }
3. text-field: { "type": "text-field", "name": string, "label": string, "placeholder"?: string, "inputType"?: "text"|"email"|"password"|"number"|"tel", "required"?: boolean }
4. card: { "type": "card", "title"?: string, "children": A2UIComponent[] }
5. container: { "type": "container", "direction"?: "row"|"column", "gap"?: number, "children": A2UIComponent[] }
6. form: { "type": "form", "action": string, "children": A2UIComponent[] }
7. select: { "type": "select", "name": string, "label": string, "options": [{ "value": string, "label": string }] }
8. checkbox: { "type": "checkbox", "name": string, "label": string, "defaultChecked"?: boolean }
9. date-picker: { "type": "date-picker", "name": string, "label": string }
10. graph: { "type": "graph", "graphType": "bar"|"line"|"pie", "title"?: string, "data": [{ "name": string, "value": number, ... }], "dataKeys"?: string[], "xAxisKey"?: string }
11. table: { "type": "table", "columns": [{ "header": string, "key": string, "align"?: "left"|"center"|"right" }], "rows": [ Record<string, string | number> ] }

Guidelines:
- Return ONLY the JSON object.
- If the user asks for a form, ALWAYS wrap inputs (text-field, select, checkbox, date-picker) in a "form" component with a submit button.
- A "form" must have an "action" string identifier that will be sent back when submitted.
- Try to use "container" to group elements logically (e.g. direction: "row" for side-by-side).
- Give elements unique "id" fields where possible.
- If the user asks a conversational question, return a "card" or "container" with "text" components to answer them.`;

export async function generateA2UIPayload(
  prompt: string,
  apiKey: string,
  history: any[] = []
): Promise<A2UIPayload> {
  if (!apiKey) throw new Error("Missing Gemini API Key");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  try {
    const validHistory: any[] = [];
    let expectedRole = "model"; 
    
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const role = msg.role === "agent" ? "model" : "user";
      if (role === expectedRole) {
        validHistory.unshift({
          role,
          parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.payload) }],
        });
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    }

    if (validHistory.length > 0 && validHistory[0].role === "model") {
      validHistory.shift();
    }

    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    const payload = JSON.parse(responseText) as A2UIPayload;
    
    if (!payload.type || payload.type !== "a2ui" || !Array.isArray(payload.components)) {
      throw new Error("Invalid A2UI payload structure returned from LLM");
    }

    return payload;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    
    return {
      type: "a2ui",
      version: "1.0",
      components: [
        {
          type: "card",
          id: "error-card",
          title: "Generation Failed",
          children: [
            {
              type: "text",
              text: `Failed to generate UI payload. Error: ${error instanceof Error ? error.message : String(error)}`,
              variant: "body",
            },
          ],
        },
      ],
    };
  }
}
