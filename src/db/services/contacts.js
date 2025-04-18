import { SORT_ORDER } from '../../constants/sortOrder.js';
import { calculatePaginationData } from '../../utils/calculatePaginationData.js';
import { ContactCollection } from '../models/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find(filter);

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavorite === 'boolean') {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.find(filter).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactCollection.findById({ _id: contactId, userId });

  return contact;
};

export const createContact = async (payload) => {
  return await ContactCollection.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  const contact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  return await ContactCollection.findOneAndDelete({ _id: contactId, userId });
};
