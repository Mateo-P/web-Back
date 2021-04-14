import express from 'express';
import cors from 'cors';
import { ApolloServer } from'apollo-server-express';
import { typeDefs } from "./apollo/type-defs.js";
import { resolvers } from "./apollo/resolvers.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const { MongoClient } = mongodb;

let db;

const server = new ApolloServer({
 
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

await server.start();

  const app = express();
  app.use(cors())
  server.applyMiddleware({ app, path: '/' });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
  });
