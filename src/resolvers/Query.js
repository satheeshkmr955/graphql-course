const Query = {
  me() {
    return {
      id: "123456",
      name: "satheesh",
      email: "satheeshkmr@gmail.com",
      age: 25,
    };
  },
  post() {
    return {
      id: "1234",
      title: "welcome to graphql",
      body: "learn 1 using custom type",
      published: true,
    };
  },
  users(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.users;
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.posts;
    const isTitle = db.posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    return isTitle;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query;
