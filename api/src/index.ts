import { GraphQLServer } from 'graphql-yoga';
//import { typeDefs } from './schema.graphql';
import { Prisma } from 'prisma-binding';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

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
  console.log('The server is up!');
});
