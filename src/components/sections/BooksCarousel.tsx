import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/dev/booksData";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

export default function BooksCarousel() {
    const booksData = books.slice(0, 6);

    return (
        <div className=" w-full bg-gray-200 py-9">
            <h2 className="text-center text-3xl font-semibold mb-4">Newly Books</h2>
            <div className="md:px-20 px-15">
                <Carousel className="w-full" opts={{ align: "start" }}>
                    {/* 2) Make this flex so children line up in a row */}
                    <CarouselContent className="flex gap-4">
                        {booksData.map((item, index) => (
                            /* 3) Each item is exactly 1/3 of the width, and won't shrink/grow */
                            <CarouselItem key={index} className="md:flex-none md:w-[32.5%]">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="aspect-square p-6 relative flex flex-col items-center justify-center">
                                            <Image
                                                src={`/images/${item.images[0]}`}
                                                alt={`the book image of ${item.title}`}
                                                width={200}
                                                height={100}
                                                className="object-center h-[14rem]"
                                                loading="lazy"
                                            />
                                            <span className="absolute top-0 left-0 bg-red-600 text-white px-4 rounded-r-full">{`${(((item.price - item.finalPrice) / item.price) * 100).toFixed(1)}%`}</span>
                                            <div className="w-full mt-4">
                                                <p className="text-[1rem] font-sans line-clamp-1 hover:line-clamp-none cursor-pointer">
                                                    {item.title}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-3 items-end mt-3">
                                                        <div className="flex items-start">
                                                            <span className="text-sm text-orange-400 font-semibold">
                                                                BDT
                                                            </span>
                                                            <span className="font-semibold text-2xl text-orange-400 ">
                                                                {item.finalPrice}
                                                            </span>
                                                        </div>
                                                        <span className="text-muted-foreground line-through">
                                                            {item.price}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.condition}
                                                    </span>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button className="bg-gradient-to-r from-blue-400 to-blue-900">
                                                        Buy Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <div className="flex justify-center items-center my-8">
                <Button className="bg-gradient-to-r from-blue-400 to-blue-900">
                    <ArrowUpRight />
                    Explore More Books
                </Button>
            </div>
        </div>
    );
}
