import dotenv from 'dotenv';
import server from 'src/server';
import { User } from './entities/User';

dotenv.config();

const user = new User();

console.log(user);

server.start();
