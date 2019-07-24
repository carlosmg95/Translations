import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from '../prisma/generated/prisma-client/prisma-schema';

const server: GraphQLServer = new GraphQLServer({
  typeDefs, resolvers: {}
});

server.start(() => {
  console.log('The server is up!');
});
