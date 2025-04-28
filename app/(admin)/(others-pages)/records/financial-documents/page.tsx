import FinancialDocuments from "@/components/custom/tabs/FinancialDocuments";
import ComponentCard from "@/components/common/ComponentCard";

import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "سوابق مالی اسناد",
    description:
        "صفحه سوابق مالی اسناد",
};

export default function FinancialDocumentsPage() {
    return (
        <div>
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    سوابق مالی اسناد
                </h3>
                <div className="space-y-6">
                    <ComponentCard title="سوابق مالی اسناد">
                        <FinancialDocuments/>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}