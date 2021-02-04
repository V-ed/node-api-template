import server from '$/server';
import dotenv from 'dotenv';
import defaultRouters from './routers';

dotenv.config();

server.manager.registerRouter(defaultRouters);

server.start();
