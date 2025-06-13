"use client";

import { useGetData } from "@/lib/callAPIsHelper";
import Image from "next/image";
import PaginationComp from "@/components/bricks/dynamic/paginationComp";

import React, {useEffect, useMemo, useState } from "react";
// import { books, filters } from "@/dev/booksData";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { IBook } from "@/types/modelTypes";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [books, setBooks] = useState<IBook[]>([]);
    const params = useSearchParams();

    const page = parseInt(params.get("page") ?? "", 10);
    const sort = params.get("sort") ?? "";
    const category = params.get("category") ?? "";
    const condition = params.get("condition") ?? "";
    const language = params.get("language") ?? "";
    const tags = params.get("tags")?.split(",") ?? [];
    const author = params.get("author") ?? "";
    const publisher = params.get("publisher") ?? "";
    const inStock = params.get("inStock") ?? "";
    const minPrice = params.get("minPrice") ? parseFloat(params.get("minPrice")!) : undefined;
    const maxPrice = params.get("maxPrice") ? parseFloat(params.get("maxPrice")!) : undefined;
    const fromDate = params.get("fromDate") ? params.get("fromDate")! : "";
    const toDate = params.get("toDate") ? params.get("toDate")! : "";

    // 1) Build a plain object of filters (for your API or debugging)
    const filters = useMemo(() => {
        const f: Record<string, any> = {};
        if (category) f.category = category;
        if (condition) f.condition = condition;
        if (language) f.language = language;
        if (tags.length) f.tags = tags;
        if (author) f.author = author;
        if (publisher) f.publisher = publisher;
        if (inStock === "true") f.inStock = true;
        if (inStock === "false") f.inStock = false;
        if (minPrice != null) f.minPrice = minPrice;
        if (maxPrice != null) f.maxPrice = maxPrice;
        if (fromDate) f.fromDate = fromDate;
        if (toDate) f.toDate = toDate;
        if (sort) f.sort = sort;
        if (page) setCurrentPage(page);
        return f;
    }, [
        category,
        condition,
        language,
        tags.join(","),
        author,
        publisher,
        inStock,
        minPrice,
        maxPrice,
        fromDate,
        toDate,
        page,
        sort,
    ]);

    // 2) Serialize once
    const queryString = useMemo(() => {
        const qp = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
            if (Array.isArray(v)) qp.set(k, v.join(","));
            else qp.set(k, String(v));
        });
        return qp.toString();
    }, [filters]);

    console.log(
        "Query String:",
        `/get-books?${queryString}&page=${currentPage}`,
        `/books?${queryString}&page=${currentPage}`
    );
    const {
        data: booksData,
    } = useGetData(
        [`/get-books?${queryString}&page=${currentPage}`, "books"],
        `/get-books?${queryString}&page=${currentPage}`,
        { keepPreviousData: true }
    );
    useEffect(() => {
        if (booksData) {
            setBooks((booksData as any).data.books);
            setTotalPages((booksData as any).data.totalPages);
        }
    }, [booksData]);
    return (
        <div className="flex w-full min-h-screen flex-col md:px-[2rem]">
            <div className="flex justify-end">
                <FilterSection />
            </div>
            <Separator className="my-4" />
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 p-4">
                {books.map((item: IBook, index) => (
                    <Card key={index} onClick={() => router.push(`/books/${item.slug}`)}>
                        <CardContent className="aspect-square p-6 relative flex flex-col items-center justify-center">
                            <Image
                                src={item.images[0].secure_url}
                                alt={`the book image of ${item.title}`}
                                width={200}
                                height={100}
                                className="object-center h-[14rem]"
                                loading="lazy"
                            />
                            <span className="absolute top-0 left-0 bg-red-600 text-white px-4 rounded-r-full">{`${(((item.price - item.finalPrice!!) / item.price) * 100).toFixed(1)}%`}</span>
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
                ))}
            </div>
            <div className="flex justify-center my-4">
                <PaginationComp
                    totalPages={totalPages}
                    router={router}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    queryString={queryString}
                />
            </div>
        </div>
    );
}

interface IFilter {
    category?: string;
    type?: string;
    condition?: IBook["condition"] | "";
    language?: string;
    tags?: string[];
    author?: string;
    publisher?: string;
    minPrice?: number;
    maxPrice?: number;
    minPages?: number;
    maxPages?: number;
    fromDate?: Date;
    toDate?: Date;
    sort?: string;
    page?: number;
    limit?: number;
}
const FilterSection = () => {
    const [filter, setFilter] = useState<IFilter>({
        category: "",
        type: "",
        condition: "",
        author: "",
        publisher: "",
        language: "",
        tags: [],
        minPrice: undefined,
        maxPrice: undefined,
        minPages: undefined,
        maxPages: undefined,
        fromDate: undefined,
        toDate: undefined,
        sort: "newest",
        page: 1,
        limit: 20,
    });
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter Books</DialogTitle>
                    <DialogDescription>
                        Use the form below to filter books by category, type, and condition.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4"></div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
