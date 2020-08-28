import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createComment(parent, args, { db }, info) {
    const userExist = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExist) {
      throw new Error('User not found');
    }
    const postExist = db.posts.some((post) => {
      return post.id === args.data.post;
    });
    if (!postExist) {
      throw new Error('Post not found');
    }

    const comment = { id: uuidv4(), ...args.data };

    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    // find the commentIndex
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    // throw an error if it is not found
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    // remove it
    const deletedComment = db.comments.splice(commentIndex, 1);
    // return it
    return deletedComment[0];
  },
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });

    if (emailTaken) {
      throw new Error('Email taken.');
    }
    const user = { id: uuidv4(), ...args.data };
    db.users.push(user); // save to database
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    // find the user to be deleted
    const userIndex = db.users.findIndex((user) => {
      return args.id === user.id;
    });
    // if not exist, throw an error
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    // remove the user from the db.users array
    const deletedUser = db.users.splice(userIndex, 1);
    // delete all db.posts that the user produced and thier db.comments
    db.posts = db.posts.filter((post) => {
      // if the post hae not been created by this user, return true
      if (post.author !== args.id) {
        return true;
      }
      // delete all db.comments of the post
      db.comments = db.comments.filter((comment) => {
        if (comment.post !== post.id) {
          return true;
        } else {
          return false;
        }
      });
      // return false (It means do not keep this post in thedb.posts array)
      return false;
    });
    // delete all db.comments that the user produced
    db.comments = db.comments.filter((comment) => {
      return comment.author !== args.id;
    });
    // return the deleted User
    return deletedUser[0];
  },
  createPost(parent, args, { db }, info) {
    const userExist = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userExist) {
      throw new Error('User not found');
    }
    const post = { id: uuidv4(), ...args.data };
    db.posts.push(post);
    return post;
  },
  deletePost(parent, args, { db }, info) {
    // find the post
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    // delete post
    const deletedPost = db.posts.splice(postIndex, 1);
    // delete all its db.comments
    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    });
    // return deleted post
    return deletedPost[0];
  },
};

export { Mutation as default };
