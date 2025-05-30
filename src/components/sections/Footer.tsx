import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Clock, Facebook, Headphones, Instagram, Shield, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <div className="bg-slate-900 md:h-[60vh] md:px-[3rem] px-4 pt-20 pb-4">
            <div className="text-white grid md:grid-cols-4 grid-cols-1 text-xs space-y-5">
                <div className="flex flex-col md:items-center md:gap-2">
                    <Link href="/about-us">About Us</Link>
                    <Link href="/contacts">Contact Us</Link>
                </div>
                <div className="flex flex-col md:items-center md:gap-2">
                    <Link href="/blogs">Blogs</Link>
                    <Link href="/how-it-works">How it works?</Link>
                </div>
                <div className="flex flex-col md:items-center md:gap-2">
                    <Link href="/terms-of-use">Terms Of use</Link>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-around w-full px-5">
                        <Facebook className="w-5 h-5 cursor-pointer" />
                        <Twitter className="w-5 h-5 cursor-pointer" />
                        <Instagram className="w-5 h-5 cursor-pointer" />
                        <Youtube className="w-5 h-5 cursor-pointer" />
                    </div>
                    <p className="text-center">
                        BookKart is a free platform where you can buy second hand books at very
                        cheap prices. Buy used books online like college books, school books, much
                        more near you.
                    </p>
                </div>
            </div>
            <div className="text-white grid grid-cols-3 mt-8">
                <div className="flex flex-col justify-center items-center text-center gap-3">
                    <Shield />
                    <div>
                        <p>Secure Payment</p>
                        <p className="text-xs text-muted-foreground">
                            100% Secure Online Transaction
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-3">
                    <Clock />
                    <div>
                        <p>BookKart Trust</p>
                        <p className="text-xs text-muted-foreground">
                            Money transferred safely after confirmation
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-3">
                    <Headphones />
                    <div>
                        <p>Customer Support</p>
                        <p className="text-xs text-muted-foreground">Friendly customer support</p>
                    </div>
                </div>
            </div>
            <Separator className="w-[80vw] md:my-8 mt-8 mb-2" />
            <div className="text-white text-center text-xs">
                &copy; {new Date().getFullYear()} BookKart. All rights reserved.
            </div>
        </div>
    );
}
