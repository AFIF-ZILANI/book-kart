import { Schema, model, Types } from "mongoose";

const WishlistItemSchema = new Schema(
    {
        book: { type: Types.ObjectId, ref: "Book", required: true },
        addedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const WishlistSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
        items: [WishlistItemSchema],
    },
    {
        timestamps: true,
    }
);

export default model("Wishlist", WishlistSchema);
