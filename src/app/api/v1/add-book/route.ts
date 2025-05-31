import { ThrowError } from "@/lib/CustomError";
import { ErrorResponse, SuccessResponse } from "@/lib/responseHelperFuncs";
import { AddNewBookData } from "@/types/expectedDataTypes";
import { NextRequest } from "next/server";
import { bookCategories } from "@/constants";
import dbConnect from "@/lib/db";
import { IBook } from "@/types/modelTypes";
import BookModel from "@/models/Book.model";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title, // required
            author, // required
            publisher, // required
            edition, // required
            isbn,
            category, // required
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

        // ---- validation start ----

        // ---- validate required fields ----

        if (
            !title ||
            !author ||
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

        // condition validation
        if (!["new", "like-new", "excellent", "good", "fair"].includes(condition)) {
            ThrowError("Invalid condition provided", 401, "Invalid condition");
        }

        // status vailidation
        if (!["available", "pending", "sold", "removed"].includes(status)) {
            ThrowError("Invalid status provided", 401, "Invalid status");
        }

        // ----- validate optional fields -----

        // dimentions validation
        if (
            dimensions &&
            (typeof dimensions.width !== "number" ||
                typeof dimensions.height !== "number" ||
                typeof dimensions.depth !== "number" ||
                !["cm", "inches"].includes(dimensions.unit))
        ) {
            ThrowError("Invalid dimensions provided", 401, "Invalid dimensions");
        }

        if (!(dimensions.width > 0) || !(dimensions.height > 0) || !(dimensions.depth > 0)) {
            ThrowError("Dimensions must be positive numbers", 401, "Invalid dimensions");
        }

        // weight validation
        if (
            weight &&
            (typeof weight.value !== "number" ||
                !["kg", "lbs"].includes(weight.unit) ||
                !(weight.value > 0))
        ) {
            ThrowError("Invalid weight provided", 401, "Invalid weight");
        }

        // pages validation
        if (pages && (typeof pages !== "number" || pages <= 0)) {
            ThrowError("Pages must be a positive number", 401, "Invalid pages");
        }

        // language validation
        if (language && typeof language !== "string") {
            ThrowError("Language must be a string", 401, "Invalid language");
        }
        // isbn validation
        if (isbn && typeof isbn !== "string") {
            ThrowError("ISBN must be a string", 401, "Invalid ISBN");
        }
        // inCurrency validation
        if (inCurrency && typeof inCurrency !== "string") {
            ThrowError("Currency must be a string", 401, "Invalid currency");
        }

        // ----- validation end -----

        // If all validations pass, proceed with adding the book
        // Here we typically call a service or database function to add the book

        await dbConnect();

        const bookData: IBook = {
            title: title.trim(),
            author: author.trim(),
            publisher: publisher.trim(),
            isbn: isbn ? isbn.trim() : undefined,
            edition: edition.trim(),
            category: category.trim(),
            language: language ? language.trim() : undefined,
            condition: condition.trim() as "new" | "like-new" | "excellent" | "good" | "fair",
            pages: pages ? pages : undefined,
            dimensions: dimensions ? dimensions : undefined,
            weight: weight ? weight : undefined,
            images: images.map((image: string) => image.trim()),
            description: description.trim(),
            price: parseFloat(price.toString()),
            inCurrency: inCurrency ? inCurrency.trim() : "BDT",
            discount: parseFloat(discount.toString()),
            finalPrice: parseFloat(finalPrice.toString()),
            shipping_charge: parseFloat(shippingCharge.toString()),
            stock: parseInt(stock.toString(), 10),
            status: status.trim() as "available" | "pending" | "sold" | "removed",
            tags: tags.map((tag: string) => tag.trim()),
            seller: {
                name: "Default Seller", // This should be replaced with actual seller data
                contact: "Default Contact", // This should be replaced with actual seller data
                email: "",
                rating: 0, // Default rating, should be replaced with actual seller data
                total_sales: 0, // Default total sales, should be replaced with actual seller data
            },
            payment_details: {
                method: paymentInfo.method.trim() as
                    | "bkash"
                    | "nagad"
                    | "rocket"
                    | "paypal"
                    | "google-pay",
                account_identifier: paymentInfo.accountIdentifier.trim(),
            },
        };

        const createdBook = await BookModel.create(bookData);
        if (!createdBook) {
            ThrowError("Failed to create book", 500, "Database error");
        }

        return SuccessResponse("Book added successfully", 201);
    } catch (error: unknown) {
        return ErrorResponse(error);
    }
}
