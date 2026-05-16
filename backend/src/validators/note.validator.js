import Joi from 'joi';

export const assignmentCreateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  content: Joi.string().max(50000).allow('').default(''),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  isArchived: Joi.boolean(),
});

export const assignmentUpdateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  content: Joi.string().max(50000).allow(''),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  isArchived: Joi.boolean(),
}).min(1);

export const createNoteSchema = assignmentCreateNoteSchema.keys({
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20).default([]),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  content: Joi.string().max(50000).allow(''),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  isArchived: Joi.boolean(),
}).min(1);

export const shareNoteSchema = Joi.object({
  share_with_email: Joi.string().email().required(),
});

export const noteQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  archived: Joi.boolean().truthy('true').falsy('false'),
  tag: Joi.string().trim(),
  sort: Joi.string().valid('createdAt', 'updatedAt', 'title').default('updatedAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

export const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).max(200).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
