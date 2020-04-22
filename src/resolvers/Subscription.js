const Subscription = {
  comment: {
    subscribe: (parent, { postId }, { db, pubSub }, info) => {
      const post = db.posts.find(
        (post) => post.id === postId && post.published === true
      );

      if (!post) throw new Error("Post Not Found!!!");

      return pubSub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe: (parent, args, { pubSub }, info) => {
      return pubSub.asyncIterator("post");
    },
  },
};

export default Subscription;
