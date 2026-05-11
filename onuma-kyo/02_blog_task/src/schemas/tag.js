export const Tag = {
  type: 'object',
  properties: {
    tagId: { type: 'integer' },
    name: { type: 'string' },
  },
};

export const getTagsSchema = {
  response: {
    200: {
      type: 'array',
      name: Tag,
    },
  },
};
