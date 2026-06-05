import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ticketo";
const options = {
  serverSelectionTimeoutMS: 2000, // Fail fast in 2s if local MongoDB is down
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB offline. Falling back to Mock Database mode.");
      return null;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.warn("MongoDB offline. Falling back to Mock Database mode.");
    return null;
  });
}

// Mock database proxy interface to prevent page crashes
class MockCollection {
  constructor(name) {
    this.name = name;
  }
  async countDocuments() {
    return 4;
  }
  async insertMany(docs) {
    return { acknowledged: true, insertedCount: docs.length };
  }
  find(query = {}) {
    const defaultData = getMockData();
    let filtered = defaultData;
    if (query.title && query.title.$regex) {
      const regex = new RegExp(query.title.$regex, "i");
      filtered = filtered.filter(item => regex.test(item.title));
    }
    if (query.category && query.category.$regex) {
      const regex = query.category.$regex;
      filtered = filtered.filter(item => regex.test(item.category));
    }
    if (query.location && query.location.$regex) {
      const regex = query.location.$regex;
      filtered = filtered.filter(item => regex.test(item.location));
    }
    return {
      toArray: async () => filtered
    };
  }
  async findOne(query = {}) {
    const defaultData = getMockData();
    const idStr = query._id ? query._id.toString() : "";
    return defaultData.find(item => item._id === idStr) || null;
  }
}

class MockDb {
  collection(name) {
    return new MockCollection(name);
  }
}

function getMockData() {
  return [
    {
      _id: "666012345678901234567891",
      title: "Global Tech Summit 2026",
      category: "Tech",
      banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      date: "November 12, 2026",
      location: "San Francisco",
      ticketPrice: 149.00,
      description: "Join us for the premier tech event of the year, bringing together industry leaders, innovators, and developers from around the globe to discuss the future of AI, cloud, and open source development.",
      status: "approved"
    },
    {
      _id: "666012345678901234567892",
      title: "Symphony Under the Stars",
      category: "Music",
      banner: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
      date: "December 05, 2026",
      location: "New York",
      ticketPrice: 45.00,
      description: "Experience a magical evening of classical masterpieces performed by the city's finest orchestra under the open sky.",
      status: "approved"
    },
    {
      _id: "666012345678901234567893",
      title: "Culinary Arts & Wine Expo",
      category: "Food",
      banner: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
      date: "January 18, 2027",
      location: "San Francisco",
      ticketPrice: 85.00,
      description: "Indulge in a weekend of premium wine tastings and gourmet culinary showcases curated by Michelin-star chefs.",
      status: "approved"
    },
    {
      _id: "666012345678901234567894",
      title: "Art & Motion Showcase",
      category: "Arts",
      banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      date: "February 22, 2027",
      location: "Online",
      ticketPrice: 0,
      description: "A digital display of futuristic virtual reality paintings, immersive physical light setups, and digital motion graphic films.",
      status: "approved"
    }
  ];
}

export async function getDb(dbName = process.env.DB_NAME || "ticketo") {
  try {
    const conn = await clientPromise;
    if (!conn) {
      return new MockDb();
    }
    return conn.db(dbName);
  } catch (err) {
    return new MockDb();
  }
}
