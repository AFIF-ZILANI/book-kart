import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { LayoutWrapper } from "@/wrappers";

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Book Cart",
    description: "A platform to buy and sell used books",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto_mono.className} antialiased`}>
                {/* <LayoutWrapper> */}
                    <Header />
                    <main>{children}</main>
                    <Footer />
                {/* </LayoutWrapper> */}
                <time dateTime="2016-10-25" suppressHydrationWarning />
            </body>
        </html>
    );
}
