import { ErrorResponse } from "@/lib/responseHelperFuncs";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams.get;
        

    } catch (error: unknown) {
        return ErrorResponse(error)
    }
}
