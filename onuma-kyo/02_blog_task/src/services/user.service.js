import * as repository from '../repositories/user.repository.js';

export const exist = async (userId) => {
  const user = await repository.findByID(userId);
  return user.length !== 0;
};
