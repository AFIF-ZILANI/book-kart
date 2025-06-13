"use client";
import { useGetData } from "@/lib/callAPIsHelper";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Page() {
    const pathname = usePathname();
    const pathArray = pathname.split("/");
    const slug = pathArray[2];
    const { data, isError, isFetched, isLoading } = useGetData([slug], `/get-book?slug=${slug}`);
    return <div>Hello from {slug}</div>;
}
