import MessageRouter from '$/routers/MessageRouter';
import server from '$/server';
import dotenv from 'dotenv';

dotenv.config();

const test = new MessageRouter();

server.manager.registerRouter(test);

server.start();
