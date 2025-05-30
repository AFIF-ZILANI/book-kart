import { Schema, model, Types } from "mongoose";

const AddressSchema = new Schema(
    {
        label: { type: String }, // e.g., Home, Work
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
    { _id: false }
);

const PaymentMethodSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Credit Card", "Debit Card", "PayPal", "UPI", "Bank Transfer"],
            required: true,
        },
        details: { type: Schema.Types.Mixed },
        default: { type: Boolean, default: false },
    },
    { _id: false }
);

const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, index: true },
        image: { type: String }, // profile avatar URL
        bio: { type: String, maxlength: 500 },
        phone: { type: String },
        roles: [{ type: String, enum: ["user", "seller"], default: "user" }],
        oauthProvider: { type: String, enum: ["google"], required: true },
        oauthId: { type: String, required: true, unique: true },
        isVerified: { type: Boolean, default: true }, // OAuth verified
        addresses: [AddressSchema],
        paymentMethods: [PaymentMethodSchema],
        cart: [{ type: Types.ObjectId, ref: "Book" }],
        wishlist: [{ type: Types.ObjectId, ref: "Book" }],
        orders: [{ type: Types.ObjectId, ref: "Order" }],
    },
    {
        timestamps: true,
    }
);

// Instance method to check role
UserSchema.methods.hasRole = function (role: string) {
    return this.roles.includes(role);
};

export default model("User", UserSchema);
