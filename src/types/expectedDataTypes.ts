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
    images: string[];
    description: string;
    price: number;
    inCurrency: string;
    discount: number; // percentage discount
    finalPrice: number; // after discounts/offers
    shippingCharge: number;
    stock: number;
    status: "available" | "pending" | "sold" | "removed";
    tags: string[];
    paymentInfo: {
        method: "bkash" | "paypal" | "nagad" | "rocket" | "google-pay";
        accountIdentifier: string; // e.g., phone number for bkash, email for paypal
    };
}
