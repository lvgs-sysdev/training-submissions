export const User = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    userId: { type: 'string' },
    userName: { type: 'string' },
    email: { type: 'string' },
    snsLink: { type: 'string' },
  },
};

export const getUsersSchema = {
  response: {
    200: {
      type: 'array',
      items: User,
    },
  },
};

export const getUserSchema = {
  params: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'string' },
    },
  },
  response: {
    200: User,
  },
};

export const getUserBySurrogateKeySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  response: {
    200: User,
  },
};

export const addUserSchema = {
  body: {
    type: 'object',
    required: ['userId', 'password', 'userName', 'email', 'snsLink'],
    properties: {
      userId: { type: 'string' },
      password: { type: 'string' },
      userName: { type: 'string' },
      email: { type: 'string' },
      snsLink: { type: 'string' },
    },
  },
  response: {
    200: { type: 'string' },
  },
};

export const updateUserSchema = {
  body: {
    type: 'object',
    required: ['userId', 'userName', 'email', 'snsLink'],
    properties: {
      userId: { type: 'string' },
      userName: { type: 'string' },
      email: { type: 'string' },
      snsLink: { type: 'string' },
    },
  },
  params: {
    type: 'object',
    required: ['orgUserId'],
    properties: {
      orgUserId: { type: 'string' },
    },
  },
  response: {
    200: { type: 'string' },
  },
};
