const Comment = {
  post(parent, args, { db }, info) {
    return db.posts.find((post) => {
      return parent.post === post.id;
    });
  },
  author(parent, args, { db }, info) {
    return db.users.find((user) => {
      return parent.author === user.id;
    });
  },
};

export { Comment as default };
