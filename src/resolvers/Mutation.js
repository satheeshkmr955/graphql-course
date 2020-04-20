import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { email } = args.data;
    const emailExist = db.users.some((user) => user.email === email);
    if (emailExist) {
      throw new Error("Email Exists!!!");
    }
    const user = { id: uuidv4(), ...args.data };
    db.users.push(user);
    return user;
  },
  createPost(parent, args, { db }, info) {
    const { author } = args.data;
    const userExist = db.users.some((user) => user.id === author);
    if (!userExist) {
      throw new Error("User Not Found!!!");
    }
    const post = { id: uuidv4(), ...args.data };
    db.posts.push(post);
    return post;
  },
  createComment(parent, args, { db }, info) {
    const { author, post: postId } = args.data;
    const userExist = db.users.some((user) => user.id === author);
    if (!userExist) {
      throw new Error("User Not Found!!!");
    }
    const postExist = db.posts.some(
      (post) => post.author === postId && post.published === true
    );
    if (!postExist) {
      throw new Error("Post Not Found!!!");
    }
    const comment = { id: uuidv4(), ...args.data };
    db.comments.push(comment);
    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    const deletedPosts = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== args.id);
    return deletedPosts[0];
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  },
};

export default Mutation;
