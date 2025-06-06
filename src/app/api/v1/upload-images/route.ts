import { ThrowError } from "@/lib/CustomError";
import { ErrorResponse, SuccessResponse } from "@/lib/responseHelperFuncs";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";

interface CloudinaryUploadResult {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
    api_key: string;
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const files = data.getAll("image") as File[];

        if (files.length < 3 || files.length > 5) {
            ThrowError("Number of images should be 3-5", 400);
        }

        const arrayBuffers = await Promise.all(
            files.map(async (file) => {
                const buffer = await file.arrayBuffer();
                return Buffer.from(buffer);
            })
        );
        const buffers = arrayBuffers.map((buffer) => new Uint8Array(buffer));

        let errorOccurred = false;
        const uploadPromises = buffers.map((buffer) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { resource_type: "image", folder: "/books" },
                        (error, result) => {
                            if (error) {
                                errorOccurred = true;
                                console.error("Cloudinary upload error:", error);
                                reject(error);
                                return;
                            }
                            resolve(result);
                        }
                    )
                    .end(buffer);
            });
        });
        const results = (await Promise.all(uploadPromises)) as CloudinaryUploadResult[];

        if (errorOccurred) {
            await Promise.all(
                results.map((result) =>
                    cloudinary.uploader.destroy(result.public_id, { resource_type: "image" })
                )
            );
            ThrowError("Failed to upload one or more images.", 500, "UploadError");
        }

        const uploadedImages = results.map((result) => ({
            public_id: result.public_id,
            secure_url: result.secure_url,
        }));

        // console.log("Uploaded images:", uploadedImages);

        // Here you can save the uploaded image URLs to your database if needed

        return SuccessResponse("Images uploaded successfully", 200, uploadedImages);
    } catch (error: unknown) {
        console.error("Error uploading images:", error);
        return ErrorResponse(error);
    }
}
