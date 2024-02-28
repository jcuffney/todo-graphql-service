import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import resolvers from './resolvers/index.js';
import context from './context/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schema = readFileSync(join(__dirname, 'schema.gql'), 'utf8');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context,
});

console.log(`🚀  Server ready at: ${url}`);