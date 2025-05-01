"use client"

import FinancialRequestsContent from "@/components/custom/requests/FinancialRequestsContent";
import React, {useState} from "react";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";

export default function FinancialRequests() {
    const [activeTab, setActiveTab] = useState("confirmed");

    return (
        <>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tab value="unchecked">بررسی نشده</Tab>
                <Tab value="confirmed">تائید شده</Tab>
                <Tab value="unconfirmed">تائید نشده</Tab>
                <Tab value="pendingPayment">سند خورده درحال پرداخت</Tab>
                <Tab value="paid">سند خورده و پرداخت شده</Tab>
            </Tabs>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "confirmed" && <FinancialRequestsContent mode={'checkedfinancial'}/>}
                {activeTab === "unconfirmed" && <FinancialRequestsContent mode={'notapprov'}/>}
                {activeTab === "pendingPayment" && <FinancialRequestsContent mode={'progresspaing'}/>}
                {activeTab === "paid" && <FinancialRequestsContent mode={'payed'}/>}
                {activeTab === "unchecked" && <FinancialRequestsContent mode={'unchecked'}/>}
            </div>

        </>
    );
}
