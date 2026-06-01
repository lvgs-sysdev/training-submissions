import type { FromSchema } from "json-schema-to-ts";

export const loginSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
} as const;

export type LoginBody = FromSchema<typeof loginSchema>;
