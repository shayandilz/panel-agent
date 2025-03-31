"use client";

import {useSidebar} from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, {useEffect} from "react";
import {useAgent} from "@/context/AgentContext";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const {isExpanded, isHovered, isMobileOpen} = useSidebar();
    const {agentData, setAgentData, tokenData, setTokenData} = useAgent();

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const res = await fetch(`/api/user`, {
                    method: 'POST',
                });
                if (!res.ok) {
                    throw new Error('خطا در دریافت اطلاعات کاربر');
                }
                const data = await res.json();
                setAgentData(data.data);
                setTokenData(data.token);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchAgentData();
    }, []);

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ms-0"
        : isExpanded || isHovered
            ? "lg:ms-[290px]"
            : "lg:ms-[90px]";

    return (
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
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
            </div>
            <AppSidebar/>
        </div>
    );
}
