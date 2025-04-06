"use client"

import PayedDocuments from "@/components/custom/records/PayedDocuments";
import UnpayedDocuments from "@/components/custom/records/UnpayedDocuments";
// import {Metadata} from "next";
import React, {useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function FinancialDocuments() {
    const [activeTab, setActiveTab] = useState("payed");

    return (
        <>
            <PageBreadcrumb pageTitle="سوابق مالی اسناد"/>
            <div className="space-y-6">
                <ComponentCard title="سوابق مالی اسناد">
                    {/* Tab Navigation */}
                    <div className="flex flex-col lg:flex-row justify-center lg:justify-start space-y-2 lg:space-y-0 lg:space-x-4">
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "payed"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("payed")}
                        >
                            اسناد پرداخت شده
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "unpayed"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("unpayed")}
                        >
                            اسناد پرداخت نشده
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "payed" && <PayedDocuments/>}
                        {activeTab === "unpayed" && <UnpayedDocuments/>}
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
