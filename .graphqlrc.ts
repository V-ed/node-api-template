import type { IGraphQLConfig } from 'graphql-config';
import { PORT } from './src/utils';

const config: IGraphQLConfig = {
	schema: `http://localhost:${PORT}/graphql`,
};

export default config;
