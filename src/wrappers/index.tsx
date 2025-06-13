"use client";
import React from "react";
import ReducWrapper from "./ReducWrapper";
import { Toaster } from "react-hot-toast";
import ReactQueryClientWrapper from "./ReactQueryWrapper";
import { SessionProvider } from "next-auth/react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        // <ReducWrapper>
        <ReactQueryClientWrapper>
            <SessionProvider>
                <Toaster />
                {children}
            </SessionProvider>
        </ReactQueryClientWrapper>
        // </ReducWrapper>
    );
}
