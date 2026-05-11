import * as usecase from '../usecase/tag.usecase.js';

export const getTagsHandler = async (request, reply) => {
  const tags = await usecase.getTags();
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(tags);
};
