import { ApolloServer } from "apollo-server";
import { typeDefs } from "./apollo/type-defs.js";
import { resolvers } from "./apollo/resolvers.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MongoClient } = mongodb;

let db;

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: async (ctx) => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        if (!dbClient.isConnected()) await dbClient.connect();
        db = dbClient.db("mimenu-dev"); // database name
      } catch (e) {
        console.log(e);
      }
    }

    ctx.db = db;
    return ctx;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
