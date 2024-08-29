import mongoose from 'mongoose';

export const connectMongoDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, // Deprecated, can be removed if not needed
            useUnifiedTopology: true // Deprecated, can be removed if not needed
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}
