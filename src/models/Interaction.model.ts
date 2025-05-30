// models/Interaction.ts
import { Schema, model, Types } from "mongoose";

const InteractionSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    book: { type: Types.ObjectId, ref: "Book", required: true },
    type: { type: String, enum: ["view", "like", "purchase", "rating"], required: true },
    value: { type: Number }, // e.g., rating score
    createdAt: { type: Date, default: Date.now },
});

export default model("Interaction", InteractionSchema);
