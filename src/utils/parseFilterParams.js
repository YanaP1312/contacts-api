import { CONTACT_TYPE } from '../constants/contactType.js';

const parseType = (string) => {
  if (Object.values(CONTACT_TYPE).includes(string)) return string;
};

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

export const parseFilterParams = (filter) => {
  return {
    contactType: parseType(filter.type),
    isFavorite: parseBoolean(filter.isFavorite),
  };
};
