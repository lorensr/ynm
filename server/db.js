// Import Dependencies
import url from 'url'
import { MongoClient } from 'mongodb'

// Create cached connection variable
export let db = null

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ynm'

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export async function connectToDatabase() {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (db) {
    return db
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(URI, { useNewUrlParser: true })

  // Select the database through the connection,
  // using the database path of the connection string
  const newDb = await client.db(url.parse(URI).pathname.substr(1))

  // Cache the database connection and return the connection
  db = newDb
  return db
}
