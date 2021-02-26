import server from '$/server';
import dotenv from 'dotenv';
import defaultRouters from './routers';

const envFile = process.env.NODE_ENV == 'production' ? '.env.prod' : '.env';

dotenv.config({ path: envFile });

server.manager.registerRouters(...defaultRouters);

server.start();
