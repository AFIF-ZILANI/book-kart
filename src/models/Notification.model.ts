// models/Notification.ts
import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["order_update", "new_message", "promotion"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = model("Notification", NotificationSchema);
