import * as controller from '../controllers/user.controller.js';
import {
  getUsersSchema,
  getUserSchema,
  addUserSchema,
  updateUserSchema,
  getUserBySurrogateKeySchema,
} from '../schemas/users.js';

const getUsersOpts = {
  schema: getUsersSchema,
  handler: controller.getUsersHandler,
};

const getUserOpts = {
  schema: getUserSchema,
  handler: controller.getUserHandler,
};

const getUserBySurrogateKeyOpts = {
  schema: getUserBySurrogateKeySchema,
  handler: controller.getUserBySurrogateKeyHandler,
};

const addUserOpts = {
  schema: addUserSchema,
  handler: controller.addUserHandler,
};

const updateUserOpts = {
  schema: updateUserSchema,
  handler: controller.updateUserHandler,
};

export function userRoutes(fastify, options, done) {
  fastify.get('/users', getUsersOpts);
  fastify.get('/users/:userId', getUserOpts);
  fastify.get('/users/by_id/:id', getUserBySurrogateKeyOpts);
  fastify.post('/users/new', addUserOpts);
  fastify.put('/users/edit/:orgUserId', updateUserOpts);

  done();
}
