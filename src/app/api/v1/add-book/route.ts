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
        console.log("Received data for adding a new book:", body);
        const {
            title, // required
            author, // required
            publisher, // required
            edition,
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
            stock, // required
            tags, // required
            payment_details, // required
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
            !condition ||
            !images.length ||
            !description ||
            !discount ||
            !finalPrice ||
            !tags.length ||
            !payment_details
        ) {
            ThrowError("All required fields must be provided", 400, "Required fields missing");
        }

        // validate category feild
        if (!bookCategories.includes(category.trim())) {
            ThrowError("Invalid category provided", 400, "Invalid category");
        }

        // validate price
        if (isNaN(price) || price <= 0) {
            ThrowError("Price must be a positive number", 400, "Invalid price");
        }

        // validate finalPrice
        if (isNaN(finalPrice) || finalPrice <= 0) {
            ThrowError("Final price must be a positive number", 400, "Invalid final price");
        }

        // validate discount
        if (isNaN(discount) || discount < 0 || discount > 100) {
            ThrowError("Discount must be a number between 0 and 100", 400, "Invalid discount");
        }
        // validate stock
        if (isNaN(stock) || stock < 0) {
            ThrowError("Stock must be a non-negative number", 400, "Invalid stock");
        }

        // validate images
        images.forEach((image) => {
            if (image && (!image.public_id || !image.secure_url)) {
                ThrowError("Each image must have a public_id and secure_url", 400, "Invalid image");
            }
        });
        // validate tags
        tags.forEach((tag: string) => {
            if (typeof tag !== "string" || !tag.trim()) {
                ThrowError("All tags must be valid strings", 400, "Invalid tag");
            }
        });
        // validate payment_details
        if (
            typeof payment_details !== "object" ||
            !payment_details.method ||
            !payment_details.account_identifier
        ) {
            ThrowError("Payment information is incomplete", 400, "Invalid payment info");
        }

        if (
            payment_details.method !== "paypal" &&
            payment_details.method !== "bkash" &&
            payment_details.method !== "nagad" &&
            payment_details.method !== "rocket" &&
            payment_details.method !== "google-pay"
        ) {
            ThrowError("Invalid payment method", 400, "Invalid payment method");
        }
        if (
            typeof payment_details.account_identifier !== "string" ||
            !payment_details.account_identifier.trim()
        ) {
            ThrowError(
                "Account identifier must be a valid string",
                400,
                "Invalid account identifier"
            );
        }

        // condition validation
        if (!["new", "like-new", "excellent", "good", "fair"].includes(condition)) {
            ThrowError("Invalid condition provided", 400, "Invalid condition");
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
            ThrowError("Invalid dimensions provided", 400, "Invalid dimensions");
        }

        if (!(dimensions.width > 0) || !(dimensions.height > 0) || !(dimensions.depth > 0)) {
            ThrowError("Dimensions must be positive numbers", 400, "Invalid dimensions");
        }

        // weight validation
        if (
            weight &&
            (typeof weight.value !== "number" ||
                !["kg", "lbs"].includes(weight.unit) ||
                !(weight.value > 0))
        ) {
            ThrowError("Invalid weight provided", 400, "Invalid weight");
        }

        // pages validation
        if (pages && (typeof pages !== "number" || pages <= 0)) {
            ThrowError("Pages must be a positive number", 400, "Invalid pages");
        }

        // language validation
        if (language && typeof language !== "string") {
            ThrowError("Language must be a string", 400, "Invalid language");
        }
        // isbn validation
        if (isbn && typeof isbn !== "string") {
            ThrowError("ISBN must be a string", 400, "Invalid ISBN");
        }
        // inCurrency validation
        if (inCurrency && typeof inCurrency !== "string") {
            ThrowError("Currency must be a string", 400, "Invalid currency");
        }

        // ----- validation end -----

        // If all validations pass, proceed with adding the book
        // Here we typically call a service or database function to add the book

        await dbConnect();

        const images_object = images.map((image: { public_id: string; secure_url: string }) => ({
            public_id: image.public_id,
            secure_url: image.secure_url,
        }));

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
            images: images_object,
            description: description.trim(),
            price: parseFloat(price.toString()),
            inCurrency: inCurrency ? inCurrency.trim() : "BDT",
            discount: parseFloat(discount.toString()),
            finalPrice: parseFloat(finalPrice.toString()),
            stock: parseInt(stock.toString(), 10),
            status: "available", // Default status, can be changed later
            tags: tags.map((tag: string) => tag.trim()),
            seller: {
                name: "Default Seller", // This should be replaced with actual seller data
                contact: "Default Contact", // This should be replaced with actual seller data
                email: "",
                rating: 0, // Default rating, should be replaced with actual seller data
                total_sales: 0, // Default total sales, should be replaced with actual seller data
            },
            payment_details,
        };

        const createdBook = await BookModel.create(bookData);
        if (!createdBook) {
            ThrowError("Failed to create book", 500, "Database error");
        }

        return SuccessResponse("Book added successfully", 201);
    } catch (error: unknown) {
        console.error("Error adding book:", error);
        return ErrorResponse(error);
    }
}
