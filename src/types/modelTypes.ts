import { Types } from "mongoose";

export interface IBook {
    title: string;
    slug?: string;
    author: string;
    publisher?: string;
    isbn: string | undefined;
    edition?: string;
    category?: string;
    language: string | undefined;
    condition: "new" | "like-new" | "excellent" | "good" | "fair";
    pages?: number | undefined;
    dimensions?: {
        width?: number;
        height?: number;
        depth?: number;
        unit: "cm" | "inches";
    };
    weight?: {
        value?: number;
        unit: "kg" | "lbs";
    };
    images: Array<{ public_id: string; secure_url: string }>;
    description?: string;
    price: number;
    inCurrency: string;
    discount: number;
    finalPrice?: number;
    shipping_charge?: number;
    stock: number;
    status: "available" | "pending" | "sold" | "removed";
    tags: string[];
    ratings?: Array<{
        user: Types.ObjectId;
        rating: number;
        comment?: string;
        createdAt: Date;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IPaymentMethod {
    payment_method_label: string;
    method: "bkash" | "rocket" | "paypal" | "nagad" | "google-pay";
    account_identifier: string;
    country: "Bangladesh";
    is_default: boolean;
}

export interface IUser {
    name: string;
    email: string;
    image?: string;
    is_seller?: boolean; // Optional, defaults to false
    phone?: string;
    oauth_provider: "google";
    oauth_id: string;
    addresses: IAddress[];
    payment_methods: IPaymentMethod[];
    cart: Types.ObjectId[];
    wishlist: Types.ObjectId[];
    orders: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
// interface IOrder {
//     _id: Types.ObjectId;
//     user: Types.ObjectId;or: Invalid schema configurat
//     books: {
//         book: Types.ObjectId;
//         quantity: number;
//         price: number;
//     }[];
//     totalAmount: number;
//     shippingAddress?: {
//         label?: string;
//         street?: string;
//         city?: string;
//         state?: string;
//         postalCode?: string;
//         country?: string;
//     };
//     paymentMethod: "bkash" | "rocket" | "paypal" | "nagad" | "google-pay";
//     paymentDetails?: any; // Specific details based on payment method
//     status: "pending" | "completed" | "cancelled";
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface IAddress {
    address_label?: string; // Optional label for the address
    division:
        | "dhaka"
        | "chattogram"
        | "rajshahi"
        | "khulna"
        | "barishal"
        | "sylhet"
        | "rangpur"
        | "mymensingh";

    district: string;
    upazila: string;
    union?: string; // Optional for urban areas
    village_or_ward: string;
    post_office: string;
    postal_code: string; // 4-digit string
    road_or_street?: string;
    house_number?: string;
    landmark?: string;
    full_address?: string;
    isUrban?: boolean; // Optional, defaults to false
}
