import mongoose from "mongoose";

declare global {
    var mongoose: { conn: any; promise: any } | undefined;
}

const dbConnect = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    let cached = global.mongoose;
    if (!cached) {
        cached = global.mongoose = { conn: null, promise: null };
    }
    const mongooseCache = cached;

    if (mongooseCache.conn) {
        return mongooseCache.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    mongooseCache.conn = await mongooseCache.promise;
    return mongooseCache.conn;
};

export default dbConnect;
