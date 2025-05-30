import { ThrowError } from "@/lib/CustomError";
import { ErrorResponse } from "@/lib/responseHelperFuncs";
import { AddNewBookData } from "@/types/expectedDataTypes";
import { NextRequest } from "next/server";
import { bookCategories } from "@/constants";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title, // required
            auther, // required
            publisher, // required
            edition, // required
            isbn,
            category, // required
            subject,
            language,
            condition, // required
            pages,
            dimensions,
            weight,
            images, // required
            description, // required
            price, // required
            inCurrency,
            discount, // required
            finalPrice, // required
            shippingCharge, // required
            stock, // required
            status, // required
            tags, // required
            paymentInfo, // required
        }: AddNewBookData = body;

        // validate required fields

        if (
            !title ||
            !auther ||
            !publisher ||
            !category ||
            !price ||
            !stock ||
            !status ||
            !edition ||
            !condition ||
            !images.length ||
            !description ||
            !discount ||
            !finalPrice ||
            !shippingCharge ||
            !tags.length ||
            !paymentInfo
        ) {
            ThrowError("All required fields must be provided", 400, "Required fields missing");
        }

        // validate category feild
        if (!bookCategories.includes(category.trim())) {
            ThrowError("Invalid category provided", 401, "Invalid category");
        }

        // validate price

        if (isNaN(price) || price <= 0) {
            ThrowError("Price must be a positive number", 401, "Invalid price");
        }

        // validate finalPrice
        if (isNaN(finalPrice) || finalPrice <= 0) {
            ThrowError("Final price must be a positive number", 401, "Invalid final price");
        }

        // validate discount
        if (isNaN(discount) || discount < 0 || discount > 100) {
            ThrowError("Discount must be a number between 0 and 100", 401, "Invalid discount");
        }
        // validate stock
        if (isNaN(stock) || stock < 0) {
            ThrowError("Stock must be a non-negative number", 401, "Invalid stock");
        }
        // validate shipping charge
        if (isNaN(shippingCharge) || shippingCharge < 0) {
            ThrowError(
                "Shipping charge must be a non-negative number",
                401,
                "Invalid shipping charge"
            );
        }

        // validate images
        images.forEach((image: string) => {
            if (typeof image !== "string" || !image.trim()) {
                ThrowError("All images must be valid URLs", 401, "Invalid image URL");
            }
        });
        // validate tags
        tags.forEach((tag: string) => {
            if (typeof tag !== "string" || !tag.trim()) {
                ThrowError("All tags must be valid strings", 401, "Invalid tag");
            }
        });
        // validate paymentInfo
        if (
            typeof paymentInfo !== "object" ||
            !paymentInfo.method ||
            !paymentInfo.accountIdentifier
        ) {
            ThrowError("Payment information is incomplete", 401, "Invalid payment info");
        }

        if (
            paymentInfo.method !== "paypal" &&
            paymentInfo.method !== "bkash" &&
            paymentInfo.method !== "nagad" &&
            paymentInfo.method !== "rocket" &&
            paymentInfo.method !== "google-pay"
        ) {
            ThrowError("Invalid payment method", 401, "Invalid payment method");
        }
        if (
            typeof paymentInfo.accountIdentifier !== "string" ||
            !paymentInfo.accountIdentifier.trim()
        ) {
            ThrowError(
                "Account identifier must be a valid string",
                401,
                "Invalid account identifier"
            );
        }
    } catch (error: unknown) {
        return ErrorResponse(error);
    }
}
