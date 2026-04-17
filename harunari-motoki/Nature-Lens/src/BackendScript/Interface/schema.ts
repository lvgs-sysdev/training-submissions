//サーバサイドに届く位置データのバリデーションチェック
export const coordinateSchema = {
  body: {
    type: "object",
    required: ["latitude", "longitude"],
    properties: {
      latitude: {
        type: "number",
        minimum: -90,
        maximum: 90,
      },
      longitude: {
        type: "number",
        minimum: -180,
        maximum: 180,
      },
    },
  },
};

export const registerSchema = {
  body: {
    type: "object",
    required: ["user_ID", "user_name", "password"],
    properties: {
      user_ID: {
        type: "string",
      },
      user_name: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: "object",
    required: ["user_ID", "password"],
    properties: {
      user_ID: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
};
