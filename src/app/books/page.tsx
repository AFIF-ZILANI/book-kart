"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@radix-ui/react-accordion";
import { ChevronDown, ChevronUp } from "lucide-react";

import React, { useState } from "react";
import { books, filters } from "@/dev/booksData";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
    const [sortOption, setSortoption] = useState("newest");
    const booksPerPage = 6;

    const toggleFillter = (section: string, item: string) => {
        const updateFillter = (prev: string[]) => {
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
        };

        switch (section) {
            case "category":
                // setSelectedCategory(updateFillter)
                break;

            case "class-type":
                // setSelectedType(updateFillter)
                break;

            case "condition":
                // setSelectedCondition(updateFillter)
                break;

                setCurrentPage(1);
        }

        const filteredBooks = books.filter((book) => {
            const conditionMatch =
                selectedCondition.length === 0 ||
                selectedCondition
                    .map((con) => con.toLowerCase())
                    .includes(book.condition.toLowerCase());
            const categoryMatch =
                selectedCategory.length === 0 ||
                selectedCategory
                    .map((con) => con.toLowerCase())
                    .includes(book.category.toLowerCase());

            const typeMatch =
                selectedType.length === 0 ||
                selectedType.map((con) => con.toLowerCase()).includes(book.classType.toLowerCase());

            return conditionMatch && typeMatch && categoryMatch;
        });

        const sortBooks = [...filteredBooks].sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "price-low":
                    return a.finalPrice - b.finalPrice;
                case "price-high":
                    return b.finalPrice - a.finalPrice;

                default:
                    return 0;
            }
        });
    };

    return (
        <div className="flex w-full h-screen flex-col">
            <div className="px-4 text-xs">
                <Link href={"/"}>Home</Link>
                {" > "}
                <span>Books</span>
            </div>
            <Separator className="mt-2" />
            <div className="grid md:grid-cols-[288px_1fr]">
                <div className="bg-gray-100">
                    <Accordion type="multiple" className="p-6 border rounded-br-lg">
                        {Object.entries(filters).map(([key, values]) => (
                            <AccordionItem key={key} value={key}>
                                <AccordionTrigger className=" cursor-pointer hover:underline flex justify-between w-[200px] text-orange-500">
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <ChevronDown />
                                </AccordionTrigger>
                                <AccordionContent>
                                    {values.map((value) => (
                                        <div
                                            key={value}
                                            className="mt-2 flex items-center gap-2 text-muted-foreground"
                                        >
                                            <Checkbox
                                                id={value}
                                                checked={
                                                    key === "condition"
                                                        ? selectedCondition.includes(value)
                                                        : key === "classType"
                                                          ? selectedType.includes(value)
                                                          : selectedCategory.includes(value)
                                                }
                                                onCheckedChange={() => toggleFillter(key, value)}
                                            />
                                            <label
                                                htmlFor={value}
                                                className="text-sm font-medium leading-none"
                                            >
                                                {value}
                                            </label>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className=""></div>
            </div>
        </div>
    );
}
