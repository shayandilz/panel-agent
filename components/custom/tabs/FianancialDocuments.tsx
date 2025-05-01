"use client"

import PayedDocuments from "@/components/custom/records/PayedDocuments";
import UnpayedDocuments from "@/components/custom/records/UnpayedDocuments";
import React, {useState} from "react";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";
import {DollarLineIcon, FileIcon, InfoIcon, PieChartIcon, TaskIcon} from "@/icons";

export default function FinancialDocuments() {
    const [activeTab, setActiveTab] = useState("payed");

    return (
        <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tab value="payed" icon={<DollarLineIcon/>}>اسناد پرداخت شده</Tab>
                <Tab value="unpayed" icon={<InfoIcon/>}>اسناد پرداخت نشده</Tab>
            </Tabs>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "payed" && <PayedDocuments/>}
                {activeTab === "unpayed" && <UnpayedDocuments/>}
            </div>
        </>
    );
}
