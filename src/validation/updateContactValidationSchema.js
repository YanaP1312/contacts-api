import Joi from 'joi';
import { CONTACT_TYPE } from '../constants/contactType.js';

export const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(
    /^(\+?[1-9]\d{0,2})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  ),
  email: Joi.string().email(),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid(...Object.values(CONTACT_TYPE)),
});
