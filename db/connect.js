import { MongoClient } from 'mongodb'

global.mongo = global.mongo || {}

export const connectToDB = async () => {
  if (!global.mongo.client) {
    console.log("no mongo client")
    global.mongo.client = new MongoClient(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    })

    console.log('connecting to DB')
    await global.mongo.client.connect()
    console.log('connected to DB')
  }

  const db = global.mongo.client.db('lingpal')

  return { db, dbClient: global.mongo.client }
}