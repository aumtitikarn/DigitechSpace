import mongoose from 'mongoose';

let client = null;
let imgbucket = null;
let filebucket = null;
export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, // Deprecated, can be removed if not needed
        useUnifiedTopology: true // Deprecated, can be removed if not needed
    });
    client = mongoose.connection;
    const db = mongoose.connection;
    imgbucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });
    filebucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "files",
    });
    
    console.log("Connected to MongoDB");
    return { client, imgbucket, filebucket };
} catch (error) {
    console.error("Error connecting to MongoDB", error);
}

    }