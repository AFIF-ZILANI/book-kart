import type { Metadata } from "next";
import { Roboto_Mono, Ubuntu_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { LayoutWrapper } from "@/wrappers";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
    fallback: ["system-ui", "sans-serif"],
    style: ["normal", "italic"],
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
        <html lang="en" className="hydrated">
            <body className={`${inter.className} antialiased`}>
                <LayoutWrapper>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </LayoutWrapper>
                <time dateTime="2016-10-25" suppressHydrationWarning />
            </body>
        </html>
    );
}
