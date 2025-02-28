import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExist.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/path.js';

await createDirIfNotExists(TEMP_UPLOAD_DIR);
await createDirIfNotExists(UPLOAD_DIR);
await initMongoConnection();
setupServer();
