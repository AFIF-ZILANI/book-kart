"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    ShoppingCart,
    User,
    LogOut,
    LogIn,
    History,
    Heart,
    PiggyBank,
    Menu,
    Home,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";

const menuContent = [
    {
        label: "Profile",
        icon: <User className="text-black" />,
        href: "/profile",
    },
    {
        label: "Selling Products",
        icon: <PiggyBank className="text-black" />,
        href: "/selling-products",
    },
    {
        label: "Wishlist",
        icon: <Heart className="text-black" />,
        href: "/wishlist",
    },
    {
        label: "Order History",
        icon: <History className="text-black" />,
        href: "/history",
    },
    {
        label: "Logout",
        icon: <LogOut className="text-black" />,
        onclickfunc: () => console.log("Logout"),
    },
];

export default function Header() {
    const router = useRouter();
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const user = {
        avatar: "https://github.com/shadcn.png",
        // isLogin: false,
        isLogin: true,
        fullName: "AFIF ZILANI",
    };

    return (
        <header className="p-2">
            <nav className="flex w-full items-center sm:justify-around justify-between">
                <div className="sm:w-[12rem] w-[6rem]">
                    <Link href="/">
                        <Image
                            src="/images/web-logo.png"
                            alt="Book Kart logo"
                            width={450}
                            height={100}
                        />
                    </Link>
                </div>
                <div className="w-full flex items-center max-w-[40vw]">
                    <Input placeholder="Search books..." className="text-sm " type="text" />
                    <div className="bg-gray-100 rounded-lg p-2 ml-2 hover:bg-gray-200">
                        <Search className="sm:w-6 sm:h-6 w-4 h-4  cursor-pointer" />
                    </div>
                </div>
                <div className="items-center space-x-12 hidden sm:flex">
                    <Button variant="outline">Sell Used Books</Button>
                    <div className="flex items-center space-x-3">
                        <div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="cursor-pointer"
                                onClick={() => router.push("/cart")}
                            >
                                <ShoppingCart />
                                Cart
                            </Button>
                            <span className="px-1 rounded-full bg-red-500 text-[10px] text-white relative right-15 bottom-3.5 cursor-pointer">
                                {4}
                            </span>
                        </div>

                        {user.isLogin ? (
                            <DropdownMenu
                                open={isDropDownMenuOpen}
                                onOpenChange={setIsDropDownMenuOpen}
                            >
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="cursor-pointer">
                                        <Avatar>
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={`avatar of ${user.fullName}`}
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {menuContent.map(({ label, icon, href, onclickfunc }) => (
                                        <DropdownMenuItem key={label}>
                                            {onclickfunc ? (
                                                <div
                                                    onClick={() => {
                                                        onclickfunc;
                                                        setIsDropDownMenuOpen((prev) => !prev);
                                                    }}
                                                    className="flex items-center"
                                                >
                                                    {icon}
                                                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={href}
                                                    className="flex items-center"
                                                    onClick={() =>
                                                        setIsDropDownMenuOpen((prev) => !prev)
                                                    }
                                                >
                                                    {icon}
                                                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                                                </Link>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" type="button">
                                <LogIn />
                                Login
                            </Button>
                        )}
                    </div>
                </div>

                <div className="md:hidden">
                    {user.isLogin ? (
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-80 p-0" side="left">
                                <SheetHeader>
                                    <SheetTitle className="">Navigation Menu</SheetTitle>
                                </SheetHeader>
                                <div className="px-4">
                                    <Link
                                        href="/"
                                        className="flex items-center font-bold gap-1 focus:bg-gray-100 rounded-lg py-2 pl-4"
                                        onClick={() => setIsSheetOpen((prev) => !prev)}
                                    >
                                        <Home className="w-5 h-5" /> <span>Home</span>
                                    </Link>
                                    {menuContent.map(({ label, icon, href, onclickfunc }) =>
                                        onclickfunc ? (
                                            <div
                                                className="flex items-center font-bold gap-3 focus:bg-gray-100 rounded-lg py-2 pl-4 text-[1rem]"
                                                key={label}
                                                onClick={() => {
                                                    onclickfunc;
                                                    setIsSheetOpen((prev) => !prev);
                                                }}
                                            >
                                                <span className="w-5 h-5">{icon}</span>
                                                <span>{label}</span>
                                            </div>
                                        ) : (
                                            <Link
                                                href={href}
                                                className="flex items-center font-bold gap-3 focus:bg-gray-100 rounded-lg py-2 pl-4 text-[1rem]"
                                                key={label}
                                                onClick={() => setIsSheetOpen((prev) => !prev)}
                                            >
                                                <span className="w-4 h-4">{icon}</span>
                                                <span>{label}</span>
                                            </Link>
                                        )
                                    )}
                                </div>
                                <SheetFooter className="text-[10px] flex flex-row justify-around">
                                    <Link
                                        href="/privacy-policy"
                                        className="hover:text-blue-600 cursor-pointer"
                                        onClick={() => setIsSheetOpen((prev) => !prev)}
                                    >
                                        Privacy Policy
                                    </Link>
                                    <Link
                                        href="/how-to-use"
                                        className="hover:text-blue-600 cursor-pointer"
                                        onClick={() => setIsSheetOpen((prev) => !prev)}
                                    >
                                        How to use
                                    </Link>
                                    <Link
                                        href="/terms-of-use"
                                        className="hover:text-blue-600 cursor-pointer"
                                        onClick={() => setIsSheetOpen((prev) => !prev)}
                                    >
                                        Terms of use
                                    </Link>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Button variant="ghost" type="button" className="text-[10px] sm:text-sm">
                            <LogIn />
                            Login
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
}
