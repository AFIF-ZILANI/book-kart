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
    images: Array<{public_id: string; secure_url: string}>;
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
    payment_details?: {
        method: "bkash" | "nagad" | "rocket" | "paypal" | "google-pay";
        account_identifier: string;
    };
    seller: {
        name: string;
        contact: string;
        email?: string;
        rating: number;
        total_sales: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
