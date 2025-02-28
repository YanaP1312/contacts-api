import { model, Schema } from 'mongoose';
import { CONTACT_TYPE } from '../../constants/contactType.js';

const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: Object.values(CONTACT_TYPE),
      default: CONTACT_TYPE.PERSONAL,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    photo: { type: String, default: null, required: false },
  },
  { timestamps: true, versionKey: false },
);

export const ContactCollection = model('contacts', contactsSchema);
