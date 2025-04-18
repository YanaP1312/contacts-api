import Joi from 'joi';
import { CONTACT_TYPE } from '../constants/contactType.js';

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(
      /^(\+?[1-9]\d{0,2})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    )
    .required(),
  email: Joi.string().email(),
  isFavorite: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string()
      .valid('true', 'false')
      .custom((value) => value === 'true'),
  ),
  contactType: Joi.string().valid(...Object.values(CONTACT_TYPE)),
});
