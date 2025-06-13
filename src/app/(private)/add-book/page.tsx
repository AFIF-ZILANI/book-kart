"use client";

// We well break this into 3 parts
// 1st one id Basic Book Information
// 2nd one is Book Details
// 3rd one is Payment and Shipping Information

import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookCategories, languages } from "@/constants";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "@/components/bricks/dynamic/inputTags";
import UploadImages from "@/components/bricks/dynamic/uploadImages";
import { usePostData } from "@/lib/callAPIsHelper";
import { AxiosError } from "axios";
import Loader from "@/components/bricks/static/loader";

const payment_method_array = [
    { id: "bkash", label: "Bkash" },
    { id: "nagad", label: "Nagad" },
    { id: "rocket", label: "Rocket" },
    // { id: "paypal", label: "Paypal" },
    // { id: "google-pay", label: "Google Pay" },
];

// currently paypal and google pay is off

const basicFormSchema = z.object({
    title: z.string().min(6, "Title is required"),
    author: z.string().min(6, "Author is required"),

    condition: z.enum(["new", "like-new", "excellent", "good", "fair"]),

    description: z.string().min(10, "Description must be at least 10 characters"),
});

const bookDetailsSchema = z.object({
    publisher: z.string().min(6, "Publisher is required"),
    edition: z.string().optional(),
    isbn: z.string().optional(),
    category: z.string().nonempty("Category is required"),
    language: z.string().optional(),
    pages: z.number().optional(),
    // 1) Define dimensions fields as optional inside an object
    // 2) Then .refine(...) so that either all four are undefined or all are provided
    dimensions: z
        .object({
            width: z.number().min(1, "Width must be at least 1").optional(),
            height: z.number().min(1, "Height must be at least 1").optional(),
            depth: z.number().min(1, "Depth must be at least 1").optional(),
            unit: z.enum(["cm", "inches"]).optional(),
        })
        .refine(
            (dim) => {
                // Check whether any field is non‐undefined:
                const anyField =
                    dim.width !== undefined ||
                    dim.height !== undefined ||
                    dim.depth !== undefined ||
                    dim.unit !== undefined;

                // If no field was provided at all, it’s okay.
                if (!anyField) return true;

                // Otherwise, require that all four are present
                return (
                    dim.width !== undefined &&
                    dim.height !== undefined &&
                    dim.depth !== undefined &&
                    dim.unit !== undefined
                );
            },
            {
                message:
                    "If you supply any dimension, you must supply width, height, depth, and unit together.",
                path: [], // you can target a specific path if you want, but leaving it at root of this object is fine
            }
        )
        .optional(),

    // For weight, you said “weight optional, but if any part present, require both value & unit”.
    // You don’t strictly need a refine here, because z.object({ … }).optional() by default enforces that if `weight` exists,
    // it must have both `value` and `unit`. If `weight` is completely absent, it’s fine.
    weight: z
        .object({
            value: z.number().min(1, "Weight must be at least 1").optional(),
            unit: z.enum(["kg", "lbs"]).optional(),
        })
        .refine(
            (wei) => {
                const anyField = wei.value !== undefined || wei.unit !== undefined;

                if (!anyField) return true;

                return wei.value !== undefined && wei.unit !== undefined;
            },
            { message: "If you supply value of weight, you must supply unit together." }
        )
        .optional(),
    stock: z.number().min(1, "Stock must be at least 1"),
    tags: z
        .array(z.string().min(2, "At least two letters is required"))
        .min(1, "At least one tag is required"),
});

const paymentAndShippingSchema = z.object({
    price: z.number().min(0, "Price must be at least 0"),
    discount: z.number().min(0, "Discount must be at least 0"),
    finalPrice: z.number().min(0, "Final price must be at least 0"),
    paymentDetails: z.object({
        method: z.enum(["bkash", "nagad", "rocket", "paypal", "google-pay"]),
        account_identifier: z.string().nonempty({
            message: "Account identifier is required",
        }),
    }),
});

export default function Page() {
    // *********************** States **********************
    const steps = ["Basic Information", "Book Details", "Payment and Shipping", "Review"];
    const [currentStep, setCurrentStep] = useState(0);
    const [finalPriceValue, setFinalPriceValue] = useState<number | undefined>(undefined);
    const [discountValue, setDiscountValue] = useState<number | undefined>(undefined);
    const [priceValue, setPriceValue] = useState<number | undefined>(undefined);
    const [reviewError, setReviewError] = useState("");
    const [uploadedImages, setUploadedImages] = useState<
        { public_id: string; secure_url: string }[]
    >([]);
    const [imageUploadError, setImageUploadError] = useState("");
    const {
        mutate: mutateImage,
        data: imageData,
        isError: imageIsError,
        isPending: imageIsPending,
        isSuccess: imageIsSuccess,
        error: imageError,
    } = usePostData("/upload-images");
    const {
        mutate: mutateBook,
        data: bookDataResponse,
        isError: bookIsError,
        isPending: bookIsPending,
        isSuccess: bookIsSuccess,
        error: bookError,
    } = usePostData("/add-book");
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const [bookData, setBookData] = useState<{
        basicFormData: z.infer<typeof basicFormSchema>;
        bookDetailsData: z.infer<typeof bookDetailsSchema>;
        paymentAndShippingData: z.infer<typeof paymentAndShippingSchema>;
    }>({
        basicFormData: {} as z.infer<typeof basicFormSchema>,
        bookDetailsData: {} as z.infer<typeof bookDetailsSchema>,
        paymentAndShippingData: {} as z.infer<typeof paymentAndShippingSchema>,
    });

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const basicForm = useForm<z.infer<typeof basicFormSchema>>({
        resolver: zodResolver(basicFormSchema),
        // defaultValues: {
        //     title: "The New World",
        //     author: "Jordy",
        //     condition: "new",
        //     description: "This is a test description!",
        // },
        defaultValues: {
            title: "",
            author: "",
            condition: undefined,
            description: "",
        },
    });

    const bookDetailsForm = useForm<z.infer<typeof bookDetailsSchema>>({
        resolver: zodResolver(bookDetailsSchema),
        defaultValues: {
            publisher: "",
            edition: "",
            isbn: "",
            category: "",
            language: "",
            pages: undefined,
            dimensions: {
                width: undefined,
                height: undefined,
                depth: undefined,
                unit: undefined,
            },
            weight: {
                value: undefined,
                unit: undefined,
            },
            stock: 1,
            tags: [],
            // publisher: "AFIF ZILANI",
            // edition: "2ndth",
            // isbn: "8757252",
            // category: "Epic",
            // language: "Bengali",
            // pages: 98,
            // dimensions: {
            //     width: 34,
            //     height: 65,
            //     depth: 46,
            //     unit: "cm",
            // },
            // weight: {
            //     value: 0.8,
            //     unit: "kg",
            // },
            // stock: 19,
            // tags: ["Hello", "new book", "book"],
        },
    });

    type PaymentFormData = z.infer<typeof paymentAndShippingSchema>;

    const paymentAndShippingForm = useForm<PaymentFormData>({
        resolver: zodResolver(paymentAndShippingSchema),
        defaultValues: {
            // s
            price: undefined,
            discount: 0,
            finalPrice: undefined,
            paymentDetails: {
                method: undefined,
                account_identifier: "",
            },
        },
    });

    const handleBasicFormSubmit = (data: z.infer<typeof basicFormSchema>) => {
        console.log("Basic Form Data:", data);
        setBookData((prev) => ({ ...prev, basicFormData: data }));
        nextStep();
    };
    const handleBookDetailsSubmit = (data: z.infer<typeof bookDetailsSchema>) => {
        console.log(selectedFiles);
        if (!selectedFiles) {
            setImageUploadError("Please select files first");
            return;
        }

        if (selectedFiles.length < 3 || selectedFiles.length > 5) {
            setImageUploadError("Please select 3 to 5 images");
            return;
        }
        setBookData((prev) => ({ ...prev, bookDetailsData: data }));
        console.log("Book Details Data:", data);

        nextStep();
    };
    const handlePaymentAndShippingSubmit = (data: PaymentFormData) => {
        console.log("Payment and Shipping Data:", data);
        setBookData((prev) => ({ ...prev, paymentAndShippingData: data }));
        nextStep();
    };

    const handleSubmit = async () => {
        if (
            !bookData.basicFormData ||
            !bookData.bookDetailsData ||
            !bookData.paymentAndShippingData
        ) {
            setReviewError("Please fill all the steps before submitting");
        }
        if (!selectedFiles?.length) {
            setReviewError("Please upload images first");
            return;
        }
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            formData.append("image", file);
        });
        console.log("Uploading files:", formData);
        mutateImage(formData);

        // for ******debugging purpose*******
        // mutateBook({
        //     ...bookData.basicFormData,
        //     ...bookData.bookDetailsData,
        //     inCurrency: "BDT", // Assuming BDT as default currency
        //     payment_details: bookData.paymentAndShippingData.paymentDetails,
        //     price: bookData.paymentAndShippingData.price,
        //     discount: bookData.paymentAndShippingData.discount,
        //     finalPrice: bookData.paymentAndShippingData.finalPrice,
        //     images: [
        //         {
        //             public_id: "books/fqwtuzuazdoifp9kujw5",
        //             secure_url:
        //                 "https://res.cloudinary.com/drfbs9hmu/image/upload/v1749198095/books/fqwtuzuazdoifp9kujw5.jpg",
        //         },
        //         {
        //             public_id: "books/igdhcvmg0owiz0lxzzsm",
        //             secure_url:
        //                 "https://res.cloudinary.com/drfbs9hmu/image/upload/v1749198095/books/igdhcvmg0owiz0lxzzsm.png",
        //         },
        //         {
        //             public_id: "books/laqaezqiie23gaetq0vh",
        //             secure_url:
        //                 "https://res.cloudinary.com/drfbs9hmu/image/upload/v1749198094/books/laqaezqiie23gaetq0vh.jpg",
        //         },
        //     ],
        // });
    };

    useEffect(() => {
        if (bookIsError || bookError) {
            console.error("Book submission Error:", (bookError as AxiosError).response?.data);
            toast.error("Book submission failed. Please try again.");

            return;
        }
        if (bookDataResponse && bookIsSuccess) {
            console.log("Book submission Data:", bookDataResponse);
            setReviewError("");
            // Reset all forms and states after successful submission
            basicForm.reset();
            bookDetailsForm.reset();
            paymentAndShippingForm.reset();
            setSelectedFiles(null);
            setUploadedImages([]);
            setCurrentStep(0);
            toast.success("Book added successfully!");
        }
    }, [bookDataResponse, bookIsError, bookIsPending, bookIsSuccess, mutateBook, bookError]);

    // useEffect of image upload //

    useEffect(() => {
        if (imageIsError || imageIsError) {
            console.error("Image upload Error:", (imageError as AxiosError).response?.data);
            setReviewError("Image upload failed. Please try again.");
            return;
        }

        if (imageData && imageIsSuccess) {
            console.log("Image upload Data:", (imageData as any).data);
            setUploadedImages((prev) => [
                ...prev,
                ...(imageData as any).data.map(
                    (img: { public_id: string; secure_url: string }) => ({
                        public_id: img.public_id,
                        secure_url: img.secure_url,
                    })
                ),
            ]);
            setImageUploadError("");
            // setSelectedFiles(null); // Clear selected files after successful upload
            setReviewError(""); // Clear any previous review error

            //
            console.log("Images:", ImageData);
            mutateBook({
                ...bookData.basicFormData,
                ...bookData.bookDetailsData,
                inCurrency: "BDT", // Assuming BDT as default currency
                payment_details: bookData.paymentAndShippingData.paymentDetails,
                price: bookData.paymentAndShippingData.price,
                discount: bookData.paymentAndShippingData.discount,
                finalPrice: bookData.paymentAndShippingData.finalPrice,
                images: (imageData as any).data.map(
                    (img: { public_id: string; secure_url: string }) => ({
                        public_id: img.public_id,
                        secure_url: img.secure_url,
                    })
                ),
            });
        }
    }, [
        imageData,
        imageIsError,
        imageIsPending,
        imageIsSuccess,
        mutateImage,
        imageUploadError,
        imageError,
    ]);

    // useEffect of discount and final price calculation //

    useEffect(() => {
        // Only calculate if both price and discount exist and are valid numbers

        if (priceValue && !discountValue) {
            // If discount is not provided, set final price equal to price
            setFinalPriceValue(priceValue);
            paymentAndShippingForm.setValue("finalPrice", priceValue);
            paymentAndShippingForm.setValue("price", priceValue);
            paymentAndShippingForm.setValue("discount", 0);
            return;
        }

        if (priceValue && discountValue && discountValue >= 0 && discountValue <= 100) {
            const discountAmount = (priceValue * discountValue) / 100;
            const finalPrice = priceValue - discountAmount;
            setFinalPriceValue(finalPrice);
            paymentAndShippingForm.setValue("finalPrice", finalPrice);
            paymentAndShippingForm.setValue("price", priceValue);
            paymentAndShippingForm.setValue("discount", discountValue);
        } else {
            // Reset final price if conditions are not met
            setFinalPriceValue(0);
            paymentAndShippingForm.setValue("finalPrice", 0);
        }
    }, [priceValue, discountValue, paymentAndShippingForm]);

    return (
        <div className="min-h-screen">
            <div className="flex justify-around mx-[10rem] mt-6">
                {steps.map((step, index) => (
                    <div key={index} className="">
                        <Separator
                            className={`w-[12rem] h-1 ${currentStep >= index ? "bg-blue-400" : "bg-gray-300"} rounded-full`}
                        />

                        <p className="text-sm font-semibold px-2 mt-2">{step}</p>
                    </div>
                ))}
            </div>
            <div className="mx-auto max-w-2xl p-6">
                {currentStep === 0 && (
                    <Form {...basicForm}>
                        <form
                            onSubmit={basicForm.handleSubmit((data) => handleBasicFormSubmit(data))}
                            className="space-y-4"
                        >
                            <FormField
                                control={basicForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>

                                        <FormControl>
                                            <Input placeholder="Book Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={basicForm.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Author Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={basicForm.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>How is the book's condition</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="w-[300px]">
                                                    <SelectValue placeholder="Select Condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Condition</SelectLabel>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="like-new">
                                                            Like New
                                                        </SelectItem>
                                                        <SelectItem value="excellent">
                                                            Excellent
                                                        </SelectItem>
                                                        <SelectItem value="good">Good</SelectItem>
                                                        <SelectItem value="fair">Fair</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={basicForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write a brief description of your book"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormDescription>
                                Please provide a detailed description of your book, including its
                                condition, any notable features, and why someone would want to buy
                                it.
                            </FormDescription>

                            <div className="my-5">
                                <NavButton prevStep={prevStep} currentStep={currentStep} />
                            </div>
                        </form>
                    </Form>
                )}
                {currentStep === 1 && (
                    <Form {...bookDetailsForm}>
                        <form
                            onSubmit={bookDetailsForm.handleSubmit((data) =>
                                handleBookDetailsSubmit(data)
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={bookDetailsForm.control}
                                name="publisher"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Publisher</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Publisher Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={bookDetailsForm.control}
                                name="edition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Edition {"(optional)"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Edition" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={bookDetailsForm.control}
                                name="isbn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ISBN {"(optional)"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ISBN Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={bookDetailsForm.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bookCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={bookDetailsForm.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language {"(optional)"}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((lang) => (
                                                        <SelectItem key={lang} value={lang}>
                                                            {lang}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={bookDetailsForm.control}
                                    name="pages"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pages {"(optional)"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Number of Pages"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        if (!/^\d*$/.test(e.target.value)) return;
                                                        field.onChange(Number(e.target.value));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={bookDetailsForm.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Available Stock"
                                                    {...field}
                                                    onChange={(e) => {
                                                        if (!/^\d*$/.test(e.target.value)) return;
                                                        field.onChange(Number(e.target.value));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={bookDetailsForm.control}
                                name="dimensions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dimensions {"(optional)"}</FormLabel>

                                        <div className="grid grid-cols-3 gap-4">
                                            <Input
                                                placeholder="Width"
                                                value={field.value?.width || ""}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        width: Number(e.target.value),
                                                    })
                                                }
                                            />
                                            <Input
                                                placeholder="Height"
                                                value={field.value?.height || ""}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        height: Number(e.target.value),
                                                    })
                                                }
                                            />
                                            <Input
                                                placeholder="Depth"
                                                value={field.value?.depth || ""}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        depth: Number(e.target.value),
                                                    })
                                                }
                                            />
                                        </div>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange({
                                                    ...field.value,
                                                    unit: value,
                                                })
                                            }
                                            value={field.value?.unit}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cm">cm</SelectItem>
                                                <SelectItem value="inches">inches</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={bookDetailsForm.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight {"(optional)"}</FormLabel>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                type="number"
                                                placeholder="Weight"
                                                value={field.value?.value || ""}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        value: Number(e.target.value),
                                                    })
                                                }
                                            />
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        unit: value,
                                                    })
                                                }
                                                value={field.value?.unit}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">kg</SelectItem>
                                                    <SelectItem value="lbs">lbs</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={bookDetailsForm.control}
                                name="tags"
                                rules={{
                                    // Optional validation: require at least one tag
                                    validate: (val) =>
                                        val.length > 0 || "Please add at least one tag.",
                                }}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <TagInput
                                                    initialTags={field.value}
                                                    onChange={(newTags) => field.onChange(newTags)}
                                                    placeholder="Type a tag and hit Enter or add comma"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <UploadImages
                                error={imageUploadError}
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                                uploadedImages={uploadedImages}
                                setError={setImageUploadError}
                            />

                            <div className="my-5">
                                <NavButton prevStep={prevStep} currentStep={currentStep} />
                            </div>
                        </form>
                    </Form>
                )}
                {currentStep === 2 && (
                    <Form {...paymentAndShippingForm}>
                        <form
                            onSubmit={paymentAndShippingForm.handleSubmit((data) =>
                                handlePaymentAndShippingSubmit(data)
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={paymentAndShippingForm.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Book Price"
                                                {...field}
                                                value={priceValue ?? field.value ?? ""}
                                                onChange={(e) => {
                                                    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                                                    field.onChange(Number(e.target.value));
                                                    setPriceValue(Number(e.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={paymentAndShippingForm.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Discount in %"
                                                {...field}
                                                value={discountValue ?? field.value ?? ""}
                                                onChange={(e) => {
                                                    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                                                    field.onChange(Number(e.target.value));
                                                    setDiscountValue(Number(e.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={paymentAndShippingForm.control}
                                name="finalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Final Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Final Price"
                                                {...field}
                                                value={finalPriceValue ?? field.value ?? ""}
                                                onChange={(e) => {
                                                    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                                                    field.onChange(Number(e.target.value));
                                                    setFinalPriceValue(Number(e.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Rest of the form remains the same */}
                            <FormField
                                control={paymentAndShippingForm.control}
                                name="paymentDetails"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Details</FormLabel>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-1">
                                                <span className="border bg-background shadow-xs dark:bg-input/30 dark:border-input px-2 py-1 rounded-sm text-muted-foreground font-semibold">
                                                    +880
                                                </span>
                                                <Input
                                                    placeholder="A/C (BKash/Nagad/Rocket)"
                                                    value={field.value?.account_identifier ?? ""}
                                                    className=""
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (
                                                            value === "0" &&
                                                            !field.value?.account_identifier
                                                        )
                                                            return;
                                                        if (!/^\d*$/.test(value)) return;
                                                        if (value.length > 10) return;
                                                        field.onChange({
                                                            ...field.value,
                                                            account_identifier: value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange({
                                                        method: value,
                                                        account_identifier:
                                                            field.value?.account_identifier ?? "",
                                                    })
                                                }
                                                value={field.value?.method}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Payment Method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {payment_method_array.map((item) => (
                                                        <SelectItem value={item.id} key={item.id}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="my-5">
                                <NavButton prevStep={prevStep} currentStep={currentStep} />
                            </div>
                        </form>
                    </Form>
                )}
                {currentStep === 3 && (
                    <div className="w-full px-4 bg-gray-50 dark:bg-gray-900 py-8 rounded-lg shadow-md">
                        {(imageIsPending || bookIsPending) && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 scroll-hidden">
                                <Loader />
                            </div>
                        )}
                        <h2 className="text-2xl text-center font-semibold mb-6 text-gray-900 dark:text-gray-100">
                            Review Your Submission
                        </h2>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Basic Details
                            </h3>
                            <div className="grid gap-4 mb-6">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Title
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {basicForm.getValues("title")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Author
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {basicForm.getValues("author")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Publisher
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("publisher")}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Description
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {basicForm.getValues("description")}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 space-y-4 space-x-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Edition
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("edition") || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Condition
                                    </label>
                                    <p className="mt-1 capitalize text-gray-900 dark:text-gray-100">
                                        {basicForm.getValues("condition")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Category
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("category")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Stock
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("stock")} units
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        ISBN
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("isbn") || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Language
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("language") || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Pages
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {bookDetailsForm.getValues("pages") || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Tags
                                    </label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {bookDetailsForm.getValues("tags").map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Images
                                    </label>
                                    <div className={`grid grid-cols-3 gap-4 w-full mt-2`}>
                                        {selectedFiles &&
                                            Array.from(selectedFiles).map((file, index: number) => (
                                                <div
                                                    key={index}
                                                    className="relative aspect-square rounded-lg overflow-hidden"
                                                >
                                                    <Image
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Book Image ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Payment & Shipping Details
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Original Price
                                    </label>
                                    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        ৳{paymentAndShippingForm.getValues("price")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Discount
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {paymentAndShippingForm.getValues("discount")}%
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Final Price
                                    </label>
                                    <p className="mt-1 text-xl font-semibold text-green-600 dark:text-green-400">
                                        ৳{paymentAndShippingForm.getValues("finalPrice")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Payment Method
                                    </label>
                                    <p className="mt-1 capitalize text-gray-900 dark:text-gray-100">
                                        {paymentAndShippingForm.getValues("paymentDetails").method}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">
                                        Account Number
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                        {
                                            paymentAndShippingForm.getValues("paymentDetails")
                                                .account_identifier
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5 mt-10">
                            <NavButton
                                prevStep={prevStep}
                                currentStep={currentStep}
                                onClick={handleSubmit}
                            />
                        </div>
                        {reviewError && (
                            <div className="mt-4 text-red-600 dark:text-red-400">
                                <p>{reviewError}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function NavButton({
    prevStep,
    currentStep,
    onClick,
}: {
    prevStep: () => void;
    currentStep: number;
    onClick?: () => void;
}) {
    return (
        <div className="flex justify-between items-center">
            <Button
                onClick={prevStep}
                className="cursor-pointer"
                disabled={currentStep === 0}
                variant={"outline"}
            >
                <ChevronLeft />
                <span>Previous</span>
            </Button>

            {currentStep === 3 ? (
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-400 to-orange-700 cursor-pointer"
                    onClick={onClick}
                >
                    Submit
                </Button>
            ) : (
                <Button
                    onClick={onClick}
                    type="submit"
                    className="cursor-pointer"
                    variant={"outline"}
                >
                    <span>Next</span>
                    <ChevronRight />
                </Button>
            )}
        </div>
    );
}
