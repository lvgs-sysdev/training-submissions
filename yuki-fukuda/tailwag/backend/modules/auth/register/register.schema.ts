import type { FromSchema } from "json-schema-to-ts";

export const registerSchema = {
  type: "object",
  required: ["account_id", "account_name", "email", "password"],
  properties: {
    account_id: { type: "string", minLength: 4 },
    account_name: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
} as const;

export type RegisterBody = FromSchema<typeof registerSchema>;
