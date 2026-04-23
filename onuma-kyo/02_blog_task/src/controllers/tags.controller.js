import * as usecase from '../usecase/tag.usecase.js';

const handleError = (reply, error) => {
  console.error('Error: ', error);
  reply.code(500);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(error);
};

export const getTagsHandler = async (request, reply) => {
  try {
    const tags = await usecase.getTags();
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(tags);
  } catch (error) {
    handleError(reply, error);
  }
};
