"use client";
import React from "react";
import ReducWrapper from "./ReducWrapper";
import { Toaster } from "react-hot-toast";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ReducWrapper>
            <Toaster />
            {children}
        </ReducWrapper>
    );
}
