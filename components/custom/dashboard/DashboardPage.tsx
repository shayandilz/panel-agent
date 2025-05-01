"use client"

import React, {useEffect, useState} from "react";
import RequestsTypesChart from "@/components/custom/dashboard/RequestsTypesChart";
import RequestsStatesChart from "@/components/custom/dashboard/RequestsStatesChart";
import {toast} from "react-toastify";
import services from "@/core/service";
import DashboardRequestsChart from "@/components/custom/dashboard/DashboardRequestsChart";

interface RequestData {
    request_id: string;
    user_id: string;
    user_name: string;
    user_family: string;
    user_mobile: string;
    fieldinsurance_logo_url: string;
    fieldinsurance_id: string;
    request_fieldinsurance_fa: string;
    request_description: string | null;
    request_last_state_id: string;
    request_last_state_name: string;
    request_organ: string;
    user_pey_amount: number;
    user_pey_cash: number;
    user_pey_instalment: number | null;
    staterequest_last_timestamp: string;
}

export default function Dashboard() {
    const [requestData, setRequestData] = useState<RequestData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequestsData = async () => {
            // if (!isLoading) {
            setIsLoading(true);
            setError(null);
            try {
                const res = await services.Requests.getReport("?command=getagent_request");
                const data = res["data"];
                if (data.result == "ok" && Array.isArray(data.data) && data.data.length > 0) {
                    setRequestData(data.data);
                } else {
                    setError(data.desc || "خطا در دریافت اطلاعات.");
                    toast.error(data.desc || "خطا در دریافت اطلاعات.");
                    setRequestData([]);
                }

            } catch (err: any) {
                setError(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
                toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
                setRequestData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestsData();
    }, []);

    if (isLoading) {
        return <div className="text-center">در حال دریافت اطلاعات...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            {requestData.length > 0 && <div className="col-span-12 xl:col-span-6">
                <RequestsTypesChart allRequests={requestData}/>
            </div>}
            {requestData.length > 0 && <div className="col-span-12 xl:col-span-6">
                <RequestsStatesChart allRequests={requestData}/>
            </div>}
            <div className="col-span-12 xl:col-span-12">
                <DashboardRequestsChart showAllLink={'/records/financial-requests'} mode={'checkedfinancial'} title={'درخواست های تائید شده توسط نماینده'}/>
            </div>
            <div className="col-span-12 xl:col-span-12">
                <DashboardRequestsChart showAllLink={'/records/financial-requests'} mode={'progresspaing'} title={'درخواست های  سند خورده درحال پرداخت'}/>
            </div>
            <div className="col-span-12 xl:col-span-12">
                <DashboardRequestsChart showAllLink={'/records/financial-requests'} mode={'payed'} title={'درخواست های پرداخت شده توسط کاربر'}/>
            </div>
            <div className="col-span-12 xl:col-span-12">
                <DashboardRequestsChart showAllLink={'/records/financial-requests'} mode={'notapprov'} title={'درخواست های تائید نشده توسط نماینده'}/>
            </div>
            <div className="col-span-12 xl:col-span-12">
                <DashboardRequestsChart showAllLink={'/records/financial-requests'} mode={'unchecked'} title={'درخواست های بررسی نشده توسط نماینده'}/>
            </div>
        </div>
    )
}
