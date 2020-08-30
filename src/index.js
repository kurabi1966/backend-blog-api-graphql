import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
// Resolvers:
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
// Resolvers Types
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import User from './resolvers/User';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: { Query, Mutation, Subscription, Post, Comment, User },
  context: {
    db,
    pubsub,
  },
});

server.start({ port: 80 }, () => {
  console.log('Graphql server has been started.');
});
