const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      // check if the post exist
      const postIndex = db.posts.some((post) => post.id === postId);
      if (postIndex === -1) {
        throw new Error('Post not exist!!');
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    },
  },
};

export { Subscription as default };
