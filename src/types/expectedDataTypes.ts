export interface AddNewBookData {
    title: string;
    author: string;
    publisher: string;
    edition: string;
    isbn: string;
    category: string;
    language: string;
    condition: "new" | "like-new" | "excellent" | "good" | "fair";
    pages: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
        unit: "cm" | "inches";
    };
    weight: {
        value: number;
        unit: "kg" | "lbs";
    };
    images: Array<{public_id: string; secure_url: string}>;
    description: string;
    price: number;
    inCurrency: string;
    discount: number; // percentage discount
    finalPrice: number; // after discounts/offers

    stock: number;
    status: "available" | "pending" | "sold" | "removed";
    tags: string[];
    payment_details: {
        method: "bkash" | "paypal" | "nagad" | "rocket" | "google-pay";
        account_identifier: string; // e.g., phone number for bkash, email for paypal
    };
}
