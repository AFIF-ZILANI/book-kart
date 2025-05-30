import { ArrowRight, BookOpen, Library, Store } from "lucide-react";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const blogPosts = [
    {
        imageSrc:
            "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
        title: "Where and how to sell old books online?",
        description:
            "Get started with selling your used books online and earn money from your old books.",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
        imageSrc:
            "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
        title: "What to do with old books?",
        description:
            "Learn about different ways to make use of your old books and get value from them.",
        icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
        imageSrc:
            "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
        title: "What is BookKart?",
        description: "Discover how BookKart helps you buy and sell used books online easily.",
        icon: <Store className="w-6 h-6 text-primary" />,
    },
];
export default function Blogs() {
    return (
        <div className="md:px-[3rem] px-4 py-12 bg-blue-100">
            <h2 className="text-2xl font-semibold text-center mb-8">Read Our Blog Posts</h2>
            <div className="grid md:grid-cols-3 grid-cols-1 w-full md:space-x-4 space-y-8">
                {blogPosts.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="h-[15rem] w-full relative bottom-6">
                            <Image
                                src={item.imageSrc}
                                alt="blog image"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-[1.05]"
                            />
                        </div>
                        <CardContent className="w-full space-y-4">
                            <div className="flex gap-3 items-center">
                                <span>{item.icon}</span>
                                <CardTitle className="text-center">{item.title}</CardTitle>
                            </div>
                            <CardDescription className="text-center">
                                {item.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href={""} className="flex justify-center items-center">
                                <Button variant={"link"}>Read More</Button>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
