import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, required: true, default: false },
    contactType: { type: String, required: true, enum: ['home', 'personal'] },
  },
  { timestamps: true, versionKey: false },
);

export const ContactCollection = model('contacts', contactsSchema);
