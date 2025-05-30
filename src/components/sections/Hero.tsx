"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingBag, Box } from "lucide-react";
import { useRouter } from "next/navigation";

const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book3.jpg",
    "/images/book4.jpg",
    "/images/book5.jpg",
];

export default function Hero() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
    }, []);
    return (
        <div className="md:h-[90vh] h-[94.2vh] overflow-hidden relative">
            {bannerImages.map((image, index) => (
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${currentImageIndex === index ? "opacity-100" : "opacity-0"}`}
                    key={index}
                >
                    <Image
                        src={image}
                        alt="banner image"
                        className="object-cover"
                        fill
                        priority={index === 0}
                    />
                </div>
            ))}
            <div className="container mx-auto flex relative flex-col gap-24 justify-center items-center h-full">
                <h1 className="sm:text-5xl text-4xl text-center font-black text-white">
                    Sell & Buy Old Books Online In Bangladesh
                </h1>
                <div className="flex gap-12">
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-blue-400 hover:from-blue-500 hover:to-blue-950 to-blue-900 text-amber-50 cursor-pointer"
                        onClick={() => router.push("/books")}
                    >
                        <ShoppingBag /> Buy Books
                    </Button>
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-orange-400 to-orange-900 text-amber-50 cursor-pointer"
                        onClick={() => router.push("/sell-books")}
                    >
                        <Box />
                        Sell Books
                    </Button>
                </div>
            </div>
        </div>
    );
}
