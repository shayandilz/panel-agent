"use client";

import {useSidebar} from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, {useEffect} from "react";
import {useAgent} from "@/context/AgentContext";
import {toast} from "react-toastify";
import services from "@/core/service";
import Cookies from "js-cookie";

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
                const agentId = Cookies.get('agent_id');
                const res = await services.General.agentData(agentId);
                const data = res.data
                console.log(data)
                if (data.result != 'ok') {
                    throw new Error('خطا در دریافت اطلاعات کاربر');
                }
                setAgentData(data.data);
                setTokenData(data.token);
            } catch (err) {
                console.error('catch',err.message);
                toast.error(err.message);
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
                <div className="py-4 mx-auto md:p-6">{children}</div>
            </div>
            <AppSidebar/>
        </div>
    );
}
