import { CONTACT_TYPE } from '../constants/contactType.js';

const parseType = (string) => {
  if (Object.values(CONTACT_TYPE).includes(string)) return string;
};

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

export const parseFilterParams = (filter) => {
  const parsedFilter = {};

  const isFavourite = parseBoolean(filter.isFavourite);
  if (typeof isFavourite === 'boolean') {
    parsedFilter.isFavourite = isFavourite;
  }

  const contactType = parseType(filter.contactType);
  if (contactType) {
    parsedFilter.contactType = contactType;
  }

  return parsedFilter;
};
