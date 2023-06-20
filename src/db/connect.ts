import { MongoClient } from "mongodb";

declare global {
  var mongo: {
    client: MongoClient;
  };
}

global.mongo = global.mongo || {};

export const connectToDB = async () => {
  if (!global.mongo.client) {
    console.log("no mongo client");
    if (!process.env.DATABASE_URI) {
      throw new Error("Please add your Mongo URI to .env");
    }
    global.mongo.client = new MongoClient(process.env.DATABASE_URI);

    console.log("connecting to DB");
    await global.mongo.client.connect();
    console.log("connected to DB");
  }

  const db = global.mongo.client.db("lingpal");

  return { db, dbClient: global.mongo.client };
};
