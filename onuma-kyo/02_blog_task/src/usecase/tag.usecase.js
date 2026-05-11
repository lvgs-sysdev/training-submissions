import * as repository from '../repositories/tag.repository.js';

export const getTags = async () => {
  return repository.findAll();
};
