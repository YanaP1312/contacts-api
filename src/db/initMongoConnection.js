import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar(ENV_VARS.MONGODB_USER);
    const password = getEnvVar(ENV_VARS.MONGODB_PASSWORD);
    const domain = getEnvVar(ENV_VARS.MONGODB_URL);
    const db = getEnvVar(ENV_VARS.MONGODB_DB);

    const connectionURI = `mongodb+srv://${user}:${password}@${domain}/${db}?retryWrites=true&w=majority&appName=Contacts`;
    await mongoose.connect(connectionURI);

    console.log('Connection successfully established');
  } catch (err) {
    console.error('Connection issues', err);
    process.exit(1);
  }
};
