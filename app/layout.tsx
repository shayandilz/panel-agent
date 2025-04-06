import {Outfit} from "next/font/google";
import type {Metadata} from "next";
import "@/public/fonts/fontface.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import {SidebarProvider} from "@/context/SidebarContext";
import {ThemeProvider} from "@/context/ThemeContext";
import {AgentProvider} from '@/context/AgentContext';
import React from "react";
import {ToastContainer} from "react-toastify";

const outfit = Outfit({
    variable: "--font-outfit-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Panel Agent",
    description: "Developed by EJ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
        <body className={`${outfit.variable} dark:bg-gray-900 BYekan antialiased`}>
        <ThemeProvider>
            <AgentProvider>
                <SidebarProvider>
                    <>
                        {/* Global Toast Container */}
                        <ToastContainer

                            position="bottom-left"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={true}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />

                        {children}
                    </>
                </SidebarProvider>

            </AgentProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
