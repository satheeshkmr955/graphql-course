import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/Users";
import Post from "./resolvers/Posts";
import Comment from "./resolvers/Comments";

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    db,
    pubSub,
  },
});

server.start((data) => {
  console.log("Server is running", data.port);
});
