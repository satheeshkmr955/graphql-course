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
  createPost(parent, args, { db, pubSub }, info) {
    const { author, published } = args.data;
    const userExist = db.users.some((user) => user.id === author);
    if (!userExist) {
      throw new Error("User Not Found!!!");
    }
    const post = { id: uuidv4(), ...args.data };
    db.posts.push(post);
    if (published) {
      pubSub.publish("post", { post: { mutationType: "CREATED", data: post } });
    }
    return post;
  },
  createComment(parent, args, { db, pubSub }, info) {
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

    pubSub.publish(`comment ${postId}`, {
      comment: { mutationType: "CREATED", data: comment },
    });

    return comment;
  },
  updatePost(parent, args, { db, pubSub }, info) {
    const {
      id,
      data: { title, body, published },
    } = args;
    const post = db.posts.find((post) => post.id === id);
    const orgPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof title === "string") {
      post.title = title;
    }

    if (typeof body === "string") {
      post.body = body;
    }

    if (typeof published === "boolean") {
      post.published = published;

      if (orgPost.published && !post.published) {
        pubSub.publish("post", {
          post: { mutationType: "DELETED", data: orgPost },
        });
      } else if (!orgPost.published && post.published) {
        pubSub.publish("post", {
          post: { mutationType: "CREATED", data: post },
        });
      } else if (post.published) {
        pubSub.publish("post", {
          post: { mutationType: "UPDATED", data: post },
        });
      }
    }

    return post;
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
  deletePost(parent, args, { db, pubSub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubSub.publish("post", { post: { mutationType: "DELETED", data: post } });
    }

    return post;
  },
  updateComment(parent, args, { db, pubSub }, info) {
    const {
      id,
      data: { text },
    } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof text === "string") {
      comment.text = text;
    }

    pubSub.publish(`comment ${comment.post}`, {
      comment: { mutationType: "UPDATED", data: comment },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubSub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [comment] = db.comments.splice(commentIndex, 1);
    pubSub.publish(`comment ${comment.post}`, {
      comment: { mutationType: "DELETED", data: comment },
    });
    return comment;
  },
};

export default Mutation;
