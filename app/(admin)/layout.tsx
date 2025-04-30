"use client";

import {useSidebar} from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, {useEffect} from "react";
import {useAuth} from "@/context/AgentContext";
import {Loader} from "lucide-react";
import {useRouter} from "next/navigation";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const {isExpanded, isHovered, isMobileOpen} = useSidebar();
    const {isAuthenticated, fetchAgentStatus} = useAuth();
    const {isLoading, setIs} = useAuth();
    const router = useRouter();

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ms-0"
        : isExpanded || isHovered
            ? "lg:ms-[290px]"
            : "lg:ms-[90px]";

    useEffect(() => {
        if (isAuthenticated) {
            fetchAgentStatus(); // Initial fetch
            const interval = setInterval(fetchAgentStatus, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchAgentStatus])

    return (
        <>
            <div className="min-h-screen xl:flex">
                {/* Sidebar and Backdrop */}
                <Backdrop/>
                {/* Main Content Area */}
                <div
                    className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
                >
                    {/* Header */}
                    <AppHeader/>
                    {/* Page Content */}
                    <div className="py-4 mx-auto md:p-6">{children}</div>
                </div>
                <AppSidebar/>
            </div>
        </>
    );
}
