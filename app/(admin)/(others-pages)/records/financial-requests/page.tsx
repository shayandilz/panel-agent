"use client"

import ConfirmedRequests from "@/components/custom/requests/ConfirmedRequests";
import UnconfirmedRequests from "@/components/custom/requests/UnconfirmedRequests";
import PendingPaymentRequests from "@/components/custom/requests/PendingPaymentRequests";
import PaidRequests from "@/components/custom/requests/PaidRequests";
import UncheckedRequests from "@/components/custom/requests/UncheckedRequests";
import React, {useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function FinancialDocuments() {
    const [activeTab, setActiveTab] = useState("confirmed");

    return (
        <>
            <PageBreadcrumb pageTitle="سوابق مالی درخواست ها"/>
            <div className="space-y-6">
                <ComponentCard title="سوابق مالی درخواست ها">
                    {/* Tab Navigation */}
                    <div className="flex flex-col lg:flex-row justify-center lg:justify-start space-y-2 lg:space-y-0 lg:space-x-4">
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "unchecked"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("unchecked")}
                        >
                            درخواست های بررسی نشده
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "confirmed"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("confirmed")}
                        >
                            درخواست های تائید شده
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "unconfirmed"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("unconfirmed")}
                        >
                            درخواست های تائید نشده
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "pendingPayment"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("pendingPayment")}
                        >
                            درخواست های سند خورده درحال پرداخت
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                activeTab === "paid"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab("paid")}
                        >
                            درخواست های سند خورده و پرداخت شده
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "confirmed" && <ConfirmedRequests/>}
                        {activeTab === "unconfirmed" && <UnconfirmedRequests/>}
                        {activeTab === "pendingPayment" && <PendingPaymentRequests/>}
                        {activeTab === "paid" && <PaidRequests/>}
                        {activeTab === "unchecked" && <UncheckedRequests/>}
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
