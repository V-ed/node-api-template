import type AbstractRouter from './AbstractRouter';
import MessageRouter from './routers/MessageRouter';

export const defaultRouters: { new (): AbstractRouter }[] = [MessageRouter];

export default defaultRouters;
