require('dotenv').config();

import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import { typeDefs as PrismaTypeDefs } from '../prisma/generated/prisma-client/prisma-schema';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

import log from './utils/log';

const prisma = new Prisma({
  typeDefs: PrismaTypeDefs,
  endpoint: process.env.PRISMA_ENDPOINT,
});

const server: GraphQLServer = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
  },
  context(req) {
    return {
      prisma,
      headers: req.request.headers,
    };
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

server.start({ port: process.env.PORT || 4000 }, () => {
  const clear = require('clear');
  clear();
  log.greet('The server is up!');
});
