import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/path.js';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );
  return `${getEnvVar(ENV_VARS.APP_DOMAIN)}/uploads/${file.filename}`;
};
