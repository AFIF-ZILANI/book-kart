import { Schema, model, Types } from "mongoose";

const CartItemSchema = new Schema(
    {
        book: { type: Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, default: 1, min: 1 },
    },
    { _id: false }
);

const CartSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
        items: [CartItemSchema],
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: { updatedAt: "updatedAt" },
    }
);

export default model("Cart", CartSchema);
