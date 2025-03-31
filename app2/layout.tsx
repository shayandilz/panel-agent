import {Outfit} from "next/font/google";
import type {Metadata} from "next";
import "./assets/fonts/fontface.css";
import "./globals.css";

import {SidebarProvider} from "@/context/SidebarContext";
import {ThemeProvider} from "@/context/ThemeContext";

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
    let darkMode = false

    // function toggleDarkMode(): void {
    //     darkMode = !darkMode
    // }

    return (
        <html className={darkMode ? `dark` : ``} lang="fa" dir="rtl">
        <body className={`${outfit.variable} dark:bg-gray-900 BYekan antialiased`}>
        <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
