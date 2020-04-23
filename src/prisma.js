import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

prisma.query
  .users(null, "{ id name email posts {id title body published}}")
  .then((data) => {
    console.dir(data, { depth: null });
  });
