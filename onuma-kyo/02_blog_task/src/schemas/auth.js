export const loginSchema = {
  body: {
    type: 'object',
    required: ['userId', 'password'],
    properties: {
      userId: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: { type: 'string' },
  },
};

export const meSchema = {
  response: {
    200: { type: 'string' },
  },
};
