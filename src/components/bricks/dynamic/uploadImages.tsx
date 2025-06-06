"use client";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";

export default function UploadImages({
    uploadedImages,
    selectedFiles,
    setSelectedFiles,
    error,
    setError,
}: {
    uploadedImages: {
        public_id: string;
        secure_url: string;
    }[];
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setSelectedFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
    selectedFiles: FileList | null;
}) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (files.length < 3 || files.length > 5) {
                setError("Please select 3 to 5 images");
                setSelectedFiles(null);
                e.target.value = ""; // Reset input
                return;
            }

            // Check file types
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            const invalidFiles = Array.from(files).filter(
                (file) => !allowedTypes.includes(file.type)
            );

            if (invalidFiles.length > 0) {
                setError("Only JPEG, JPG, PNG, and WEBP images are allowed");
                setSelectedFiles(null);
                e.target.value = ""; // Reset input
                return;
            }

            setError("");
            setSelectedFiles(files);
        }
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="space-y-2">
                            <div className="text-gray-600">
                                <svg
                                    className="mx-auto h-12 w-12"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex text-sm text-gray-600 justify-center">
                                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    Upload images
                                </span>
                                <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Select 3-5 images (PNG, JPG, JPEG, WEBP up to 10MB)
                            </p>
                        </div>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </label>

                    {selectedFiles && (
                        <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
                            {Array.from(selectedFiles).map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newFiles = Array.from(selectedFiles).filter(
                                                (_, i) => i !== index
                                            );
                                            const dataTransfer = new DataTransfer();
                                            newFiles.forEach((file) =>
                                                dataTransfer.items.add(file)
                                            );
                                            setSelectedFiles(dataTransfer.files);
                                            if (newFiles.length < 3)
                                                setError("Please select 3 to 5 images");
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="grid grid-cols-3 gap-4">
                {uploadedImages.map((image) => (
                    <div key={image.public_id} className="relative">
                        <img
                            src={image.secure_url}
                            alt="preview"
                            className="w-full h-32 object-cover rounded-md shadow-sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
