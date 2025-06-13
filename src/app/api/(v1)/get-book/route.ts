import { ThrowError } from "@/lib/CustomError";
import dbConnect from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/lib/responseHelperFuncs";
import BookModel from "@/models/Book.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const slug = req.nextUrl.searchParams.get("slug");
        if (!slug) {
            ThrowError("Slug is missing", 400, "Book identifier missing");
        }

        await dbConnect();

        const book = await BookModel.findOne({ slug });

        if (!book) {
            ThrowError("Invalid slug and book not found", 404, "book not found");
        }
        console.log("book : ", book);
        return SuccessResponse({
            message: "Book Findout Successfully",
            data: book,
        });
    } catch (error) {
        return ErrorResponse(error);
    }
}
