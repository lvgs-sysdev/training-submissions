import { getTagsSchema } from '../schemas/tag.js';
import * as controller from '../controllers/tags.controller.js';

const getTagsOpts = {
  schema: getTagsSchema,
  handler: controller.getTagsHandler,
};

export function tagRoutes(fastify, options, done) {
  fastify.get('/tags', getTagsOpts);

  done();
}
