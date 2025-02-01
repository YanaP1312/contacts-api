import { ContactCollection } from '../models/contacts.js';

export const getContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, option) => {
  const contact = await ContactCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContact = async (contactId) => {
  return await ContactCollection.findByIdAndDelete(contactId);
};
