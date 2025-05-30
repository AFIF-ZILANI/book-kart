// models/Order.ts
import { Schema, model, Types } from "mongoose";

const OrderItemSchema = new Schema(
    {
        book: { type: Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true }, // price per unit at purchase time
    },
    { _id: false }
);

const PaymentInfoSchema = new Schema(
    {
        method: {
            type: String,
            enum: ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "PayPal"],
            required: true,
        },
        transactionId: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
        paidAt: { type: Date },
    },
    { _id: false }
);

const ShippingAddressSchema = new Schema(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "User", required: true },
        items: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        shippingCharge: { type: Number, default: 0 },
        payment: { type: PaymentInfoSchema, required: true },
        shippingAddress: { type: ShippingAddressSchema, required: true },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
        placedAt: { type: Date, default: Date.now },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

export default model("Order", OrderSchema);
