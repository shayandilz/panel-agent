"use client";

import React, {useState, useEffect} from "react";
// import {useModal} from "@/hooks/useModal";
// import {Modal} from "@/components/ui/modal";
// import Button from "@/components/ui/button/Button";
// import Input from "@/components/form/input/InputField";
// import TextArea from "@/components/form/input/TextArea";
// import Label from "@/components/form/Label";
// import Image from "next/image";
// import {useAgent} from "@/context/AgentContext";
// import {as} from "@fullcalendar/core/internal-common";
import {toast} from "react-toastify";
import services from "@/core/service"
import {calculateTimestamp} from "@/core/utils"
import {useParams} from "next/navigation";
import Badge from "@/components/ui/badge/Badge";

interface RequestData {
    request_id: string;
    request_fieldinsurance_fa: string;
    request_last_state_name: string;
    staterequest_last_timestamp: string;
    user_name: string;
    user_family: string;
    user_mobile: string;
    user_pey_amount: number;
    request_description?: string | null;
    request_ready?: Array<{
        requst_ready_start_date: string;
        requst_ready_end_date: string;
        requst_ready_end_price: string;
    }>;
}

export default function RequestDetail() {
    const params = useParams();
    const id = params?.id;
    const [isLoading, setIsLoading] = useState(true);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)

    const fetchRequestDetail = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const response = await services.Requests.getReport('?command=getagent_request')
            if (response?.data?.result === "ok") {
                let requests = response?.data?.data
                let reqIndex = requests.findIndex(req => req.request_id == id)
                setRequestData(requests[reqIndex] as RequestData);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            setError(err.message || "مشکلی پیش آمد. لطفا مجددا تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    if (isLoading) return <div className="text-center">در حال دریافت اطلاعات...</div>;

    if (!requestData) return <div className="text-center">اطلاعاتی یافت نشد.</div>;

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            شماره درخواست:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_id}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            رشته بیمه :
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_fieldinsurance_fa || "نامشخص"}
                        </p>
                    </div>
                </div>
                <hr/>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            <Badge variant="light" color="primary">{requestData?.request_last_state_name || "نامشخص"}</Badge>
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            تاریخ آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.staterequest_last_timestamp}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            مشخصات کاربر:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_name} {requestData?.user_family}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            شماره همراه
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_mobile || "نامشخص"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            مبلغ پرداخت شده :
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_pey_amount} ریال
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            جزئیات درخواست:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_description || "-"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
