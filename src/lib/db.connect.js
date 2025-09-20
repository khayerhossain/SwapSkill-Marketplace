import { MongoClient, ServerApiVersion } from "mongodb";

export const collectionNamesObj = {
  usersCollection: "users",
  skillsDirectoryCollection: "skills-directory",
  newsLatterSubscribersCollection: "subscribers",
  testQNACollection: "test-qna" // All quiz data will be in this collection
};

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

export default async function dbConnect(collectionName) {
  const conn = await clientPromise;
  return conn.db("swap-skill").collection(collectionName);
}