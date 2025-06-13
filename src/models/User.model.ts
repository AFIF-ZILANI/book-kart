import { type IAddress, type IPaymentMethod, type IUser } from "./../types/modelTypes";
import { Schema, model, Types, models, Model } from "mongoose";

const AddressSchema = new Schema<IAddress>(
    {
        address_label: {
            type: String,
            required: true,
            trim: true,
        },
        division: {
            type: String,
            required: true,
            enum: [
                "dhaka",
                "chattogram",
                "rajshahi",
                "khulna",
                "barishal",
                "sylhet",
                "rangpur",
                "mymensingh",
            ],
        },
        district: {
            type: String,
            required: true,
        },
        upazila: {
            type: String,
            required: true,
        },
        union: {
            type: String,
            required: function (this: IAddress) {
                // Required for rural areas
                return !this.isUrban;
            },
        },
        village_or_ward: {
            type: String,
            required: true,
        },
        post_office: {
            type: String,
            required: true,
        },
        postal_code: {
            type: String,
            required: true,
            match: /^[0-9]{4}$/,
        },
        road_or_street: {
            type: String,
        },
        house_number: {
            type: String,
        },
        landmark: {
            type: String,
        },
        full_address: {
            type: String,
        },
        isUrban: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const PaymentMethodSchema = new Schema<IPaymentMethod>(
    {
        method: {
            type: String,
            enum: ["bkash", "rocket", "paypal", "nagad", "google-pay"],
            required: true,
        },
        account_identifier: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            enum: ["Bangladesh"],
        },
        is_default: {
            type: Boolean,
            default: false,
        },
        payment_method_label: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, index: true },
        image: { type: String, required: true }, // profile avatar URL
        phone: { type: String },
        is_seller: { type: Boolean, default: false }, // Optional, defaults to false
        oauth_provider: { type: String, required: true, enum: ["google"] },
        oauth_id: { type: String, required: true, unique: true }, // Unique ID from OAuth provider
        addresses: [AddressSchema],
        payment_methods: [PaymentMethodSchema],
        cart: [{ type: Schema.Types.ObjectId, ref: "Book" }],
        wishlist: [{ type: Schema.Types.ObjectId, ref: "Book" }],
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    {
        timestamps: true,
    }
);
const UserModel = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default UserModel;
