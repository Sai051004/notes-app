import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';

export const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    throw new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
  }

  req[property] = value;
  next();
};
