import server from '$/server';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV == 'production' ? '.env.prod' : '.env';

dotenv.config({ path: envFile });

server.manager.autoRegisterRouters();

server.start();
