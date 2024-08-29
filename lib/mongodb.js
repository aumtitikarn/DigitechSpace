import mongoose from 'mongoose';

let client = null;
let bucket = null;
export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, // Deprecated, can be removed if not needed
        useUnifiedTopology: true // Deprecated, can be removed if not needed
    });
    client = mongoose.connection;
    const db = mongoose.connection;
    bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });
    
    console.log("Connected to MongoDB");
    return { client, bucket };
} catch (error) {
    console.error("Error connecting to MongoDB", error);
}

    }