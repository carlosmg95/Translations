import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from '../prisma/generated/prisma-client/prisma-schema';
import { Prisma } from 'prisma-binding';
import Query from './resolvers/Query';

const prisma = new Prisma({
  typeDefs,
  endpoint: 'http://localhost:4466'
});

const server: GraphQLServer = new GraphQLServer({
  typeDefs,
  resolvers: {
    Query
  },
  context: {
    prisma
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

server.start(() => {
  console.log('The server is up!');
});
