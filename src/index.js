import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const users = [
  {
    id: '4f4b3e27-aa69-4500-a297-b80183195118',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 15,
  },
  {
    id: '4352beb2-38c9-4103-b084-a0519e595067',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: 'bc368dd1-2242-4835-b275-f071966b4f9e',
    name: 'Michael',
    email: 'michael@example.com',
    age: 29,
  },
];

const posts = [
  {
    id: '96025c65-dd3d-425c-a962-a02738c896ba',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '4f4b3e27-aa69-4500-a297-b80183195118',
  },
  {
    id: 'a2a3f8b3-c399-4531-be09-ea722c11e5f8',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '4f4b3e27-aa69-4500-a297-b80183195118',
  },
  {
    id: 'ad0f8c17-1473-470c-b17f-c7d44ab25cdb',
    title: 'Programming Music',
    body:
      'David Cutter Music is my favorite artist to listen to while programming.',
    published: false,
    author: 'bc368dd1-2242-4835-b275-f071966b4f9e',
  },
];

const comments = [
  {
    id: '123',
    title: 'first comment',
    body: 'first comment body',
    date: 1234,
    author: 'bc368dd1-2242-4835-b275-f071966b4f9e',
    post: '96025c65-dd3d-425c-a962-a02738c896ba',
  },
  {
    id: '456',
    title: 'second comment',
    body: 'second comment body',
    date: 5678,
    author: '4352beb2-38c9-4103-b084-a0519e595067',
    post: '96025c65-dd3d-425c-a962-a02738c896ba',
  },
  {
    id: '975',
    title: 'third comment',
    body: 'third comment body',
    date: 5678,
    author: '4352beb2-38c9-4103-b084-a0519e595067',
    post: 'a2a3f8b3-c399-4531-be09-ea722c11e5f8',
  },
];
// Type Definitions (Schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(maxAge: Int): [User!]!
    posts(query: String, published: Boolean): [Post!]!
    comments: [Comment!]!
  }

  type Mutation{
    createUser(data: createUserInput): User!
    createPost(data: createPostInput): Post!
    createComment(data: createCommentInput): Comment!
  }

  input createUserInput{
    name: String!
    email: String!
    age: Int
  }

  input createPostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input createCommentInput {
    title: String!
    body: String!
    date: Int!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    title: String!
    body: String!
    date: Int!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (args.maxAge !== undefined) {
        return users.filter((user) => {
          return user.age !== undefined && user.age <= args.maxAge;
        });
      }
      return users;
    },
    posts(parent, args, ctx, info) {
      let result = posts;

      if (args.published !== undefined) {
        result = result.filter((post) => {
          return post.published === args.published;
        });
      }

      if (args.query !== undefined) {
        result = result.filter((post) => {
          return (
            post.title.toLowerCase().includes(args.query.toLowerCase()) ||
            post.body.toLowerCase().includes(args.query.toLowerCase())
          );
        });
      }
      return result;
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me(parent, args, ctx, info) {
      return {
        id: '123098',
        name: 'Ammar Kurabi',
        email: 'ammar@kurabi.net',
        age: 28,
      };
    },
    post(parent, args, ctx, info) {
      return {
        id: 'abc123',
        title: 'Great course',
        body: 'This is the best greatest book book about graphql',
        published: true,
      };
    },
  },
  Mutation: {
    createComment(parent, args, ctx, info) {
      const userExist = users.some((user) => {
        return user.id === args.data.author;
      });
      if (!userExist) {
        throw new Error('User not found');
      }
      const postExist = posts.some((post) => {
        return post.id === args.data.post;
      });
      if (!postExist) {
        throw new Error('Post not found');
      }

      const comment = { id: uuidv4(), ...args.data };

      comments.push(comment);
      return comment;
    },
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error('Email taken.');
      }
      const user = { id: uuidv4(), ...args.data };
      users.push(user); // save to database
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some((user) => {
        return user.id === args.data.author;
      });
      if (!userExist) {
        throw new Error('User not found');
      }
      const post = { id: uuidv4(), ...args.data };
      posts.push(post);
      return post;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.author === user.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return parent.id === post.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return parent.post === post.id;
      });
    },
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.author === user.id;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Graphql server has been started.');
});