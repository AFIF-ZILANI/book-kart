// This file defines a custom error class and utility functions for handling errors in a structured way.
// It allows throwing errors with specific status codes and error codes, and provides a way to format error responses.
// CustomError class extends the built-in Error class to include additional properties like status, code, and data.
// It also includes a utility function ThrowError to throw these custom errors easily.

class CustomError<T> extends Error {
    public status: number;
    public code: string;
    public data: T | null;

    constructor(message: string, status: number, code: string, data: T | null = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.data = data;
        this.name = "CustomError";
    }
}
export default CustomError;

export function ThrowError<T>(message: string, status: number, code?: string, data?: T): never {
    throw new CustomError<T>(message, status, code ?? "", data ?? null);
}
