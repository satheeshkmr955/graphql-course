import prisma from "../prisma";

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
  users(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        name_contains: args.query,
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        title_contains: args.query,
      };
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
};

export default Query;
