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
        minLength: 10,
        maxLength: 30,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$",
      },
      user_name: {
        type: "string",
        minLength: 5,
        maxLength: 20,
        pattern: "^[A-Za-z].{5,20}$",
      },
      password: {
        type: "string",
        minLength: 10,
        maxLength: 30,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$",
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
        minLength: 10,
        maxLength: 30,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$",
      },

      password: {
        type: "string",
        minLength: 10,
        maxLength: 30,
        pattern: "^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$",
      },
    },
  },
};
