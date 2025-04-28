import {Outfit} from "next/font/google";
import type {Metadata} from "next";
import "@/public/fonts/fontface.css";
import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

import {SidebarProvider} from "@/context/SidebarContext";
import {ThemeProvider} from "@/context/ThemeContext";
import {AuthProvider} from '@/context/AgentContext';
import React from "react";
import {ToastContainer} from "react-toastify";

const outfit = Outfit({
    variable: "--font-outfit-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "پنل نماینده",
    description: "پنل نماینده راهنمای بیمه",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className={'dark'} lang="fa" dir="rtl">
        <body className={`${outfit.variable} dark:bg-gray-900 BYekan antialiased`}>
        <ThemeProvider>
            <AuthProvider>
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

            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
