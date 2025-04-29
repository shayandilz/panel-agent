import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import FinancialRequests from "@/components/custom/tabs/FinancialRequests";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "سوابق مالی درخواست ها",
    description:
        "صفحه سوابق مالی درخواست ها",
};

export default function FinancialRequestsPage() {
    return (
        <>
            <PageBreadcrumb pageTitle="سوابق مالی درخواست ها"/>
            <div className="space-y-6">
                <ComponentCard title="سوابق مالی درخواست ها">
                    <FinancialRequests />
                </ComponentCard>
            </div>
        </>
    );
}
