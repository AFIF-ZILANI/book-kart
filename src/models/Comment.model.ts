// models/Comment.ts
import { Schema, model, Types } from "mongoose";

const CommentSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    book: { type: Types.ObjectId, ref: "Book", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const CommentModel = model("Comment", CommentSchema);
