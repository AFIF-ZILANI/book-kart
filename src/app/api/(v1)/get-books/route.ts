import dbConnect from "@/lib/db";
import { ErrorResponse, SuccessResponse } from "@/lib/responseHelperFuncs";
import BookModel from "@/models/Book.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const params = req.nextUrl.searchParams;
        console.log("Fetching books with query parameters:", params.toString());
        const category = params.get("category");
        const condition = params.get("condition");
        const language = params.get("language");
        const tags = params.get("tags");
        const author = params.get("author");
        const publisher = params.get("publisher");
        const inStock = params.get("inStock");
        const minPrice = params.get("minPrice");
        const maxPrice = params.get("maxPrice");
        const fromDate = params.get("fromDate");
        const toDate = params.get("toDate");
        const sort = params.get("sort") || "newest";
        const page = parseInt(params.get("page") || "1", 10);
        const limit = parseInt(params.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (category) filter.category = category;
        if (condition) filter.condition = condition;
        if (language) filter.language = language;
        if (tags) filter.tags = { $in: tags.split(",") };
        if (author) filter.author = { $regex: author, $options: "i" };
        if (publisher) filter.publisher = { $regex: publisher, $options: "i" };
        if (inStock === "true") filter.stock = { $gt: 0 };
        if (inStock === "false") filter.stock = { $eq: 0 };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }

        // Determine sort order
        const sortOptions: Record<string, any> = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            "price-low": { price: 1 },
            "price-high": { price: -1 },
        };
        const sortStage = sortOptions[sort] || sortOptions["newest"];

        console.log("Filter criteria:", filter);
        console.log("Sort criteria:", sortStage);
        console.log("Pagination - Page:", page, "Limit:", limit, "Skip:", skip);

        // Aggregation pipeline
        const aggregatePipeline = await BookModel.aggregate([
            { $match: filter },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    books: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
                },
            },
        ]);

        const totalCount = aggregatePipeline[0].totalCount[0]?.count || 0;
        const books = aggregatePipeline[0].books;
        const totalPages = Math.ceil(totalCount / limit);

        console.log("Total count of books:", totalCount);
        console.log("Total pages:", totalPages);
        console.log("Books fetched:", books.length);
        // console.log("Books data:", books);
        return SuccessResponse({
            message: "Books fetched successfully",
            data: {
                books,
                totalCount,
                totalPages,
                currentPage: page,
            },
        });
    } catch (error: unknown) {
        return ErrorResponse(error);
    }
}
export const dynamic = "force-dynamic"; // Ensures the route is always fresh
