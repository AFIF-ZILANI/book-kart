"use client";
import React from "react";
import ReducWrapper from "./ReducWrapper";
import { Toaster } from "react-hot-toast";
import ReactQueryClientWrapper from "./ReactQueryWrapper";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        // <ReducWrapper>
            <ReactQueryClientWrapper>
                <Toaster />
                {children}
            </ReactQueryClientWrapper>
        // </ReducWrapper>
    );
}
