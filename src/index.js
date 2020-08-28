import { GraphQLServer } from 'graphql-yoga';
import db from './db';
// Resolvers:
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
// Resolvers Types
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import User from './resolvers/User';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: { Query, Mutation, Post, Comment, User },
  context: {
    db,
  },
});

server.start({ port: 80 }, () => {
  console.log('Graphql server has been started.');
});
