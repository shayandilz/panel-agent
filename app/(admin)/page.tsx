
import type {Metadata} from "next";
import React from "react";
import Dashboard from "@/components/custom/dashboard/DashboardPage";

export const metadata: Metadata = {
    title: "دشبورد",
    description: "صفحه دشبورد",
};

export default function DashboardPage() {

    return (
        <Dashboard />
    )
}
