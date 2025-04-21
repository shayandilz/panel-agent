"use client"

import type {Metadata} from "next";
import React, {useEffect, useState} from "react";
import RequestsTypesChart from "@/components/custom/charts/RequestsTypesChart";
import RequestsStatesChart from "@/components/custom/charts/RequestsStatesChart";
import ConfirmedRequestsCharts from "@/components/custom/charts/ConfirmedRequestsCharts";
import PaidRequestsChart from "@/components/custom/charts/PaidRequestsChart";
import UnconfirmedRequestsChart from "@/components/custom/charts/UnconfirmedRequestsChart";
import UncheckedRequestsChart from "@/components/custom/charts/UncheckedRequestsChart";
import {toast} from "react-toastify";
import services from "@/core/service";

// export const metadata: Metadata = {
//     title: "دشبورد",
//     description: "صفحه دشبورد",
// };

export default function Dashboard() {
    const [requestData, setRequestData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // To avoid setting state on unmounted component

        const fetchRequestsData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await services.Requests.getReport("?command=getagent_request");
                if (res) {
                    const data = res["data"];
                    if (data.result !== "ok") {
                        setError(data.desc || "خطا در دریافت اطلاعات.");
                        toast.error(data.desc || "خطا در دریافت اطلاعات.");
                        setRequestData([]);
                    } else if (Array.isArray(data.data) && data.data.length > 0) {
                        setRequestData(data.data);
                    } else {
                        setRequestData([]);
                    }
                } else {
                    setError("مشکلی پیش آمد. دوباره تلاش کنید.");
                    toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
                    setRequestData([]);
                }
            } catch (err: any) {
                setError(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
                toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
                setRequestData([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchRequestsData();
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <div className="text-center">در حال دریافت اطلاعات...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 xl:col-span-5">
                <RequestsTypesChart allRequests={requestData}/>
            </div>
            <div className="col-span-12 xl:col-span-7">
                <RequestsStatesChart allRequests={requestData}/>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <ConfirmedRequestsCharts/>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <PaidRequestsChart/>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <UnconfirmedRequestsChart/>
            </div>
            <div className="col-span-12 xl:col-span-6">
                <UncheckedRequestsChart/>
            </div>
        </div>
    )
}
