import { NextResponse } from "next/server";
import CustomError from "./CustomError";

// This file defines utility functions for handling API responses in a structured way.
// It includes functions for creating error responses and success responses, ensuring consistent formatting across the application.
// ErrorResponse function formats error responses for API endpoints
// It takes a CustomError object and returns a NextResponse with the error details in JSON format.
// SuccessResponse function formats successful responses for API endpoints
// It takes a message, status code, and optional data, returning a NextResponse with the success details in JSON format.

export function ErrorResponse(error: unknown): NextResponse {
    if (error instanceof CustomError) {
        return NextResponse.json(
            {
                message: error.message, // Error message to be returned in the response
                code: error.code, // Error code to be returned in the response
                status: error.status, // Status code to be returned in the response
                success: false, // Indicates that the request was not successful
                data: error.data, // Data to be returned in the response, can be null
                // Additional properties can be added here if needed
            },
            {
                status: error.status,
                headers: {
                    "Content-Type": "application/json",
                },
                statusText: error.message, // Optional: Set the status text to the error message
            }
        );
    } else {
        // If the error is not an instance of CustomError, return a generic error response
        return NextResponse.json(
            {
                message: "An unexpected error occurred", // Generic error message
                code: "UNKNOWN_ERROR", // Generic error code
                status: 500, // Internal server error status code
                success: false, // Indicates that the request was not successful
                data: null, // No additional data to return
            },
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
                statusText: "Internal Server Error", // Optional: Set the status text to indicate an internal server error
            }
        );
    }
}

export function SuccessResponse<T>({
    message,
    data,
    status = 200,
}: {
    message: string;
    status?: number;
    data?: T | null;
}): NextResponse {
    return NextResponse.json(
        {
            message, // Message to be returned in the response
            status, // Status code to be returned in the response
            success: true, // Indicates that the request was successful
            data: data ? data : null, // Data to be returned in the response, can be null
        },
        {
            status, // HTTP status code for success
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
            statusText: message, // Optional: Set the status text to the message
        }
    );
}
