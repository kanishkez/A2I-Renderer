

import type { A2UIPayload } from "../types/a2ui";

const bookingPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Restaurant Reservation",
      variant: "heading",
    },
    {
      type: "text",
      text: "Fill out the details below to book your table.",
      variant: "body",
    },
    {
      type: "form",
      action: "submit_booking",
      children: [
        {
          type: "text-field",
          name: "guest_name",
          label: "Guest Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          type: "text-field",
          name: "email",
          label: "Email Address",
          placeholder: "you@example.com",
          inputType: "email",
          required: true,
        },
        {
          type: "text-field",
          name: "phone",
          label: "Phone Number",
          placeholder: "+1 (555) 000-0000",
          inputType: "tel",
        },
        {
          type: "container",
          direction: "row",
          gap: 16,
          children: [
            {
              type: "date-picker",
              name: "date",
              label: "Reservation Date",
            },
            {
              type: "select",
              name: "party_size",
              label: "Party Size",
              options: [
                { value: "1", label: "1 Guest" },
                { value: "2", label: "2 Guests" },
                { value: "3", label: "3 Guests" },
                { value: "4", label: "4 Guests" },
                { value: "5", label: "5 Guests" },
                { value: "6", label: "6+ Guests" },
              ],
            },
          ],
        },
        {
          type: "select",
          name: "time_slot",
          label: "Preferred Time",
          options: [
            { value: "17:00", label: "5:00 PM" },
            { value: "17:30", label: "5:30 PM" },
            { value: "18:00", label: "6:00 PM" },
            { value: "18:30", label: "6:30 PM" },
            { value: "19:00", label: "7:00 PM" },
            { value: "19:30", label: "7:30 PM" },
            { value: "20:00", label: "8:00 PM" },
          ],
        },
        {
          type: "checkbox",
          name: "special_occasion",
          label: "This is a special occasion",
        },
        {
          type: "text-field",
          name: "special_requests",
          label: "Special Requests",
          placeholder: "Allergies, seating preferences, etc.",
        },
      ],
    },
  ],
};

const dashboardPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Analytics Dashboard",
      variant: "heading",
    },
    {
      type: "text",
      text: "Here's your weekly performance overview.",
      variant: "body",
    },
    {
      type: "container",
      direction: "row",
      gap: 16,
      children: [
        {
          type: "card",
          title: "Total Revenue",
          children: [
            { type: "text", text: "$48,250", variant: "heading" },
            { type: "text", text: "+12.5% from last week", variant: "caption" },
          ],
        },
        {
          type: "card",
          title: "Active Users",
          children: [
            { type: "text", text: "2,847", variant: "heading" },
            { type: "text", text: "+8.3% from last week", variant: "caption" },
          ],
        },
        {
          type: "card",
          title: "Conversion Rate",
          children: [
            { type: "text", text: "3.24%", variant: "heading" },
            { type: "text", text: "+0.4% from last week", variant: "caption" },
          ],
        },
      ],
    },
    {
      type: "card",
      title: "Revenue Trend",
      children: [
        {
          type: "graph",
          graphType: "line",
          data: [
            { name: "Mon", revenue: 4200, expenses: 2400 },
            { name: "Tue", revenue: 5800, expenses: 2800 },
            { name: "Wed", revenue: 6100, expenses: 3200 },
            { name: "Thu", revenue: 7400, expenses: 2900 },
            { name: "Fri", revenue: 8200, expenses: 3500 },
            { name: "Sat", revenue: 9100, expenses: 3100 },
            { name: "Sun", revenue: 7450, expenses: 2700 },
          ],
        },
      ],
    },
    {
      type: "container",
      direction: "row",
      gap: 16,
      children: [
        {
          type: "card",
          title: "Traffic Sources",
          children: [
            {
              type: "graph",
              graphType: "pie",
              data: [
                { name: "Organic", value: 4200 },
                { name: "Direct", value: 2800 },
                { name: "Social", value: 1800 },
                { name: "Referral", value: 1200 },
                { name: "Email", value: 900 },
              ],
            },
          ],
        },
        {
          type: "card",
          title: "Weekly Sales",
          children: [
            {
              type: "graph",
              graphType: "bar",
              data: [
                { name: "Mon", sales: 120 },
                { name: "Tue", sales: 185 },
                { name: "Wed", sales: 210 },
                { name: "Thu", sales: 165 },
                { name: "Fri", sales: 240 },
                { name: "Sat", sales: 290 },
                { name: "Sun", sales: 195 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const helpPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Help & Support",
      variant: "heading",
    },
    {
      type: "text",
      text: "How can I help you today? Here are some common topics:",
      variant: "body",
    },
    {
      type: "container",
      direction: "column",
      gap: 12,
      children: [
        {
          type: "card",
          title: "Getting Started",
          children: [
            {
              type: "text",
              text: "New to A2UI? Learn the basics of setting up your first agent-generated interface.",
              variant: "body",
            },
            {
              type: "button",
              label: "View Tutorial",
              action: "view_tutorial",
              variant: "primary",
            },
          ],
        },
        {
          type: "card",
          title: "Troubleshooting",
          children: [
            {
              type: "text",
              text: "Having issues? Let me help diagnose and fix common problems.",
              variant: "body",
            },
            {
              type: "button",
              label: "Start Diagnostics",
              action: "start_diagnostics",
              variant: "secondary",
            },
          ],
        },
        {
          type: "card",
          title: "API Reference",
          children: [
            {
              type: "text",
              text: "Explore the complete A2UI component specification and JSON payload format.",
              variant: "body",
            },
            {
              type: "button",
              label: "Open Docs",
              action: "open_docs",
              variant: "secondary",
            },
          ],
        },
      ],
    },
    {
      type: "container",
      direction: "row",
      gap: 12,
      children: [
        {
          type: "button",
          label: "Contact Support",
          action: "contact_support",
          variant: "primary",
        },
        {
          type: "button",
          label: "Report a Bug",
          action: "report_bug",
          variant: "danger",
        },
      ],
    },
  ],
};

const settingsPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Profile Settings",
      variant: "heading",
    },
    {
      type: "text",
      text: "Update your profile information and preferences.",
      variant: "body",
    },
    {
      type: "form",
      action: "save_settings",
      children: [
        {
          type: "card",
          title: "Personal Information",
          children: [
            {
              type: "container",
              direction: "row",
              gap: 16,
              children: [
                {
                  type: "text-field",
                  name: "first_name",
                  label: "First Name",
                  placeholder: "Jane",
                  defaultValue: "Jane",
                },
                {
                  type: "text-field",
                  name: "last_name",
                  label: "Last Name",
                  placeholder: "Doe",
                  defaultValue: "Doe",
                },
              ],
            },
            {
              type: "text-field",
              name: "email",
              label: "Email",
              inputType: "email",
              placeholder: "jane@example.com",
              defaultValue: "jane@example.com",
              required: true,
            },
          ],
        },
        {
          type: "card",
          title: "Preferences",
          children: [
            {
              type: "select",
              name: "language",
              label: "Language",
              defaultValue: "en",
              options: [
                { value: "en", label: "English" },
                { value: "es", label: "Español" },
                { value: "fr", label: "Français" },
                { value: "de", label: "Deutsch" },
                { value: "ja", label: "日本語" },
              ],
            },
            {
              type: "select",
              name: "timezone",
              label: "Timezone",
              defaultValue: "utc-5",
              options: [
                { value: "utc-8", label: "Pacific (UTC-8)" },
                { value: "utc-7", label: "Mountain (UTC-7)" },
                { value: "utc-6", label: "Central (UTC-6)" },
                { value: "utc-5", label: "Eastern (UTC-5)" },
                { value: "utc+0", label: "UTC" },
                { value: "utc+1", label: "CET (UTC+1)" },
                { value: "utc+5.5", label: "IST (UTC+5:30)" },
                { value: "utc+9", label: "JST (UTC+9)" },
              ],
            },
            {
              type: "checkbox",
              name: "email_notifications",
              label: "Receive email notifications",
              defaultChecked: true,
            },
            {
              type: "checkbox",
              name: "dark_mode",
              label: "Enable dark mode",
              defaultChecked: true,
            },
            {
              type: "checkbox",
              name: "beta_features",
              label: "Opt into beta features",
            },
          ],
        },
      ],
    },
  ],
};

const pricingPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Choose Your Plan",
      variant: "heading",
    },
    {
      type: "text",
      text: "Select the plan that best fits your needs. Upgrade or downgrade anytime.",
      variant: "body",
    },
    {
      type: "container",
      direction: "row",
      gap: 16,
      children: [
        {
          type: "card",
          title: "Starter",
          children: [
            { type: "text", text: "$9/mo", variant: "heading" },
            { type: "text", text: "Perfect for individuals", variant: "caption" },
            { type: "text", text: "✓ 5 projects", variant: "body" },
            { type: "text", text: "✓ Basic analytics", variant: "body" },
            { type: "text", text: "✓ Email support", variant: "body" },
            { type: "text", text: "✗ Custom domains", variant: "caption" },
            { type: "text", text: "✗ Priority support", variant: "caption" },
            {
              type: "button",
              label: "Choose Starter",
              action: "select_plan_starter",
              variant: "secondary",
            },
          ],
        },
        {
          type: "card",
          title: "Professional",
          children: [
            { type: "text", text: "$29/mo", variant: "heading" },
            { type: "text", text: "Most popular choice", variant: "caption" },
            { type: "text", text: "✓ Unlimited projects", variant: "body" },
            { type: "text", text: "✓ Advanced analytics", variant: "body" },
            { type: "text", text: "✓ Custom domains", variant: "body" },
            { type: "text", text: "✓ Priority support", variant: "body" },
            { type: "text", text: "✗ White-label", variant: "caption" },
            {
              type: "button",
              label: "Choose Professional",
              action: "select_plan_pro",
              variant: "primary",
            },
          ],
        },
        {
          type: "card",
          title: "Enterprise",
          children: [
            { type: "text", text: "$99/mo", variant: "heading" },
            { type: "text", text: "For large teams", variant: "caption" },
            { type: "text", text: "✓ Everything in Pro", variant: "body" },
            { type: "text", text: "✓ White-label branding", variant: "body" },
            { type: "text", text: "✓ SSO / SAML", variant: "body" },
            { type: "text", text: "✓ Dedicated account manager", variant: "body" },
            { type: "text", text: "✓ 99.99% SLA", variant: "body" },
            {
              type: "button",
              label: "Contact Sales",
              action: "contact_sales",
              variant: "primary",
            },
          ],
        },
      ],
    },
  ],
};

const greetingPayload: A2UIPayload = {
  type: "a2ui",
  version: "0.9",
  components: [
    {
      type: "text",
      text: "Hello! I'm your A2UI assistant.",
      variant: "heading",
    },
    {
      type: "text",
      text: "I can generate dynamic user interfaces on the fly. Try one of these actions or type a message:",
      variant: "body",
    },
    {
      type: "container",
      direction: "row",
      gap: 10,
      children: [
        {
          type: "button",
          label: "Dashboard",
          action: "show_dashboard",
          variant: "primary",
        },
        {
          type: "button",
          label: "Book a Table",
          action: "show_booking",
          variant: "secondary",
        },
        {
          type: "button",
          label: "Pricing",
          action: "show_pricing",
          variant: "secondary",
        },
      ],
    },
    {
      type: "container",
      direction: "row",
      gap: 10,
      children: [
        {
          type: "button",
          label: "Settings",
          action: "show_settings",
          variant: "secondary",
        },
        {
          type: "button",
          label: "Help",
          action: "show_help",
          variant: "secondary",
        },
      ],
    },
  ],
};

const dataTablePayload: A2UIPayload = {
  type: "a2ui",
  version: "1.0",
  components: [
    {
      type: "container",
      id: "table-container",
      direction: "column",
      gap: 20,
      children: [
        {
          type: "text",
          id: "table-title",
          text: "Countries and Capitals",
          variant: "heading",
        },
        {
          type: "text",
          id: "table-desc",
          text: "Here is a simple data table showing a few countries and their capitals, rendered natively via A2UI.",
          variant: "body",
        },
        {
          type: "table",
          id: "countries-table",
          columns: [
            { header: "Country", key: "country" },
            { header: "Capital", key: "capital" },
            { header: "Population", key: "population", align: "right" },
          ],
          rows: [
            { country: "Japan", capital: "Tokyo", population: "125M" },
            { country: "France", capital: "Paris", population: "68M" },
            { country: "Brazil", capital: "Brasília", population: "214M" },
            { country: "Canada", capital: "Ottawa", population: "38M" },
          ],
        },
      ],
    }
  ],
};

const keywordMap: Array<{ keywords: string[]; payload: A2UIPayload }> = [
  {
    keywords: ["book", "reservation", "reserve", "restaurant", "dining"],
    payload: bookingPayload,
  },
  {
    keywords: ["dashboard", "stats", "analytics", "metrics", "chart", "graph", "data"],
    payload: dashboardPayload,
  },
  {
    keywords: ["help", "support", "faq", "question", "issue", "problem"],
    payload: helpPayload,
  },
  {
    keywords: ["profile", "settings", "preferences", "account", "config"],
    payload: settingsPayload,
  },
  {
    keywords: ["pricing", "plans", "price", "cost", "subscription", "upgrade"],
    payload: pricingPayload,
  },
  {
    keywords: ["table", "countries", "capitals"],
    payload: dataTablePayload,
  },
];

export function getAgentResponse(message: string): A2UIPayload {
  const lower = message.toLowerCase().trim();

  for (const entry of keywordMap) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.payload;
    }
  }

  return greetingPayload;
}

export function getActionResponse(action: string): A2UIPayload | null {
  switch (action) {
    case "show_dashboard":
      return dashboardPayload;
    case "show_booking":
      return bookingPayload;
    case "show_pricing":
      return pricingPayload;
    case "show_settings":
      return settingsPayload;
    case "show_help":
      return helpPayload;
    default:
      return null;
  }
}
