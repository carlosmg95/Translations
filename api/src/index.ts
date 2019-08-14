import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import log from './utils/log';

const prisma = new Prisma({
  typeDefs: './src/schema.graphql',
  endpoint: 'http://localhost:4466',
});

const server: GraphQLServer = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    prisma,
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

server.start(() => {
  const clear = require('clear');
  clear();
  log.greet('The server is up!');
});
