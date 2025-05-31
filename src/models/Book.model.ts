import { Schema, model, Types, models, Model } from "mongoose";
import { IBook } from "../types/modelTypes";

const PaymentDetailsSchema = new Schema(
    {
        method: {
            type: String,
            enum: ["bkash", "nagad", "rocket", "paypal", "google-pay"],
            required: true,
        },
        account_identifier: { type: String, required: true }, // e.g., phone number for bkash, email for paypal
    },
    { _id: false }
);

const SellerInfoSchema = new Schema(
    {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        email: { type: String },
        rating: { type: Number, default: 0 },
        total_sales: { type: Number, default: 0 },
    },
    { _id: false }
);

const BookSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true },
        author: { type: String, required: true },
        publisher: { type: String },
        isbn: { type: String, unique: true, index: true },
        edition: { type: String },
        category: { type: String, index: true },
        language: { type: String, default: "English" },
        condition: {
            type: String,
            enum: ["new", "like-new", "excellent", "good", "fair"],
            default: "good",
        },
        pages: { type: Number },
        dimensions: {
            width: Number,
            height: Number,
            depth: Number,
            unit: { type: String, enum: ["cm", "inches"], default: "cm" },
        },
        weight: {
            value: Number,
            unit: { type: String, enum: ["kg", "lbs"], default: "kg" },
        },
        images: [{ type: String }],
        description: { type: String },
        price: { type: Number, required: true, min: 1 },
        inCurrency: { type: String, default: "BDT" },
        discount: { type: Number, default: 0 }, // percentage discount
        finalPrice: { type: Number }, // after discounts/offers
        shipping_charge: { type: Number, default: 0 },
        stock: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["available", "pending", "sold", "removed"],
            default: "available",
        },
        tags: [{ type: String }],
        ratings: [
            {
                user: { type: Types.ObjectId, ref: "User" },
                rating: { type: Number, min: 1, max: 5 },
                comment: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        payment_details: { type: PaymentDetailsSchema },
        seller: { type: SellerInfoSchema, required: true },
    },
    {
        timestamps: true,
    }
);

BookSchema.pre("save", async function (next) {
    if (this.isModified("title")) {
        let slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        
        // Check if slug exists
        let slugExists = await (this.constructor as Model<IBook>).findOne({ slug });
        if (slugExists) {
            // Append random 6-character string to slug
            const randomStr = Math.random().toString(36).substring(2, 8);
            slug = `${slug}-${randomStr}`;
        }
        this.slug = slug;
    }
    next();
});

const BookModel: Model<IBook> = (models.Book as Model<IBook>) || model<IBook>("Book", BookSchema);

export default BookModel;
// This code defines a Mongoose schema and model for a Book entity in a MongoDB database.
