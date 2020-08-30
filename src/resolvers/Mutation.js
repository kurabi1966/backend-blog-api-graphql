import { v4 as uuidv4 } from 'uuid';
// Helper methods
const _emailTaken = (users, email) => {
  return users.some((user) => user.email === email);
};
const _Index = (collection, id) => {
  return collection.findIndex((item) => item.id === id);
};

const Mutation = {
  // ============ User ====================
  createUser(parent, { data }, { db, pubsub }, info) {
    if (_emailTaken(db.users, data.email)) {
      throw new Error('Email taken.');
    }
    const user = { id: uuidv4(), ...data };
    db.users.push(user); // save to database
    return user;
  },
  deleteUser(parent, { id }, { db, pubsub }, info) {
    // find the user to be deleted
    const userIndex = _Index(db.users, id);
    // if not exist, throw an error
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    // remove the user from the db.users array
    const deletedUser = db.users.splice(userIndex, 1)[0];
    // delete all db.posts that the user produced and thier db.comments
    db.posts = db.posts.filter((post) => {
      // if the post hae not been created by this user, return true
      if (post.author !== id) {
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
      return comment.author !== id;
    });

    // return the deleted User
    return deletedUser;
  },
  updateUser(parent, { id, data }, { db, pubsub }, info) {
    // check if the user exist
    const userIndex = _Index(db.users, id);
    // if not, throw an error
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    // check if the new email is taken
    if (typeof data.email === 'string') {
      if (_emailTaken(db.users, user.email)) {
        throw new Error('Email is used by other user');
      }
    }
    // else update the user fields using the args.data and return the updated version
    const updateUser = Object.assign(db.users[userIndex], data);
    return updateUser;
  },
  // ============ Post =====================
  createPost(parent, { data }, { db, pubsub }, info) {
    const userIndex = _Index(db.users, data.author);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const post = { id: uuidv4(), ...data };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }
    return post;
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    // find the post
    const postIndex = _Index(db.posts, id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    // delete post
    const [post] = db.posts.splice(postIndex, 1);
    // delete all its db.comments
    db.comments = db.comments.filter((comment) => comment.post !== id);
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }
    // return deleted post
    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    // check if the post exist
    const postIndex = _Index(db.posts, id);
    // if not throw an error
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const originalPost = { ...db.posts[postIndex] };
    // else update the post and return it
    const updatedPost = Object.assign(db.posts[postIndex], data);
    if (originalPost.published && !updatedPost.published) {
      // post has been unpublished
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: originalPost,
        },
      });
    } else if (!originalPost.published && updatedPost.published) {
      // post has been published
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: updatedPost,
        },
      });
    } else {
      // post already published, but updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: updatedPost,
        },
      });
    }
    return updatedPost;
  },
  // ======================== Comment ==========================
  createComment(parent, { data }, { db, pubsub }, info) {
    // check if the user exist
    const userIndex = _Index(db.users, data.author);
    // if not, throw an error
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const postIndex = _Index(db.posts, data.post);
    // if not throw an error
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    const comment = { id: uuidv4(), ...data };
    db.comments.push(comment);
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });
    return comment;
  },
  deleteComment(parent, { id }, { db, pubsub }, info) {
    // find the commentIndex
    const commentIndex = _Index(db.comments, id);
    // throw an error if it is not found
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    // remove it
    const [comment] = db.comments.splice(commentIndex, 1);
    // announce that the comment has been deleted
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment,
      },
    });
    // return it
    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    // check if the comment exist
    const commentIndex = _Index(db.comments, id);
    // if not throw an error
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    // else update the comment and return the updateed version
    const comment = Object.assign(db.comments[commentIndex], data);
    // announce that the comment has been deleted
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });
    // check the status of the comments's post
    return comment;
  },
};

export { Mutation as default };
