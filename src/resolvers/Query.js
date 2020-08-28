const Query = {
  users(parent, args, { db }, info) {
    if (args.maxAge !== undefined) {
      return db.users.filter((user) => {
        return user.age !== undefined && user.age <= args.maxAge;
      });
    }
    return db.users;
  },
  posts(parent, args, { db }, info) {
    let result = db.posts;

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
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export { Query as default };
