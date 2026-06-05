import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ticketo";
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  console.warn("Please add MONGODB_URI to your environment variables. Using default fallback.");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(dbName = process.env.DB_NAME || "ticketo") {
  const conn = await clientPromise;
  return conn.db(dbName);
}
