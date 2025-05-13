import FinancialDocuments from "@/components/custom/tabs/FianancialDocuments";
import ComponentCard from "@/components/common/ComponentCard";

import {Metadata} from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "سوابق مالی اسناد",
    description:
        "صفحه سوابق مالی اسناد",
};

export default function FinancialDocumentsPage() {
    return (
        <>
            <PageBreadcrumb pageTitle="سوابق مالی درخواست ها"/>
            <div className="space-y-6">
                <ComponentCard title="سوابق مالی اسناد">
                    <FinancialDocuments/>
                </ComponentCard>
            </div>
        </>
    );
}