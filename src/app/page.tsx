import {
    BookOpen,
    Camera,
    CreditCard,
    Library,
    Search,
    Store,
    Tag,
    Truck,
    Wallet,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import BooksCarousel from "@/components/sections/BooksCarousel";
import WorkFlow from "@/components/sections/workFlow";
import Blogs from "@/components/sections/Blogs";

const sellSteps = [
    {
        step: "Step 1",
        title: "Post an ad for selling used books",
        description:
            "Post an ad on BookKart describing your book details to sell your old books online.",
        icon: <Camera className="h-9 w-9 text-primary" />,
    },
    {
        step: "Step 2",
        title: "Set the selling price for your books",
        description: "Set the price for your books at which you want to sell them.",
        icon: <Tag className="h-9 w-9 text-primary" />,
    },
    {
        step: "Step 3",
        title: "Get paid into your UPI/Bank account",
        description:
            "You will get money into your account once you receive an order for your book.",
        icon: <Wallet className="h-9 w-9 text-primary" />,
    },
];

const buySteps = [
    {
        step: "Step 1",
        title: "Select the used books you want",
        description: "Search from over thousands of used books listed on BookKart.",
        icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
        step: "Step 2",
        title: "Place the order by making payment",
        description: "Then simply place the order by clicking on the 'Buy Now' button.",
        icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
        step: "Step 3",
        title: "Get the books delivered at your doorstep",
        description: "The books will be delivered to you at your doorstep!",
        icon: <Truck className="h-8 w-8 text-primary" />,
    },
];

export default function page() {
    return (
        <section>
            <Hero />
            <BooksCarousel />
            <WorkFlow
                title="How to sell your old books online on BookKart?"
                subTitle="Earning money by selling your old books is just 3 steps away from you :)"
                flowArray={sellSteps}
                type="SELL"
            />
            <WorkFlow
                title="How to buy second hand books online on BookKart?"
                subTitle="Saving some good amount of money by buying used books is just 3 steps away from you :)"
                flowArray={buySteps}
                type="BUY"
            />
            <Blogs />
        </section>
    );
}
