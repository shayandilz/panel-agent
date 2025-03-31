"use client";

import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import {useAgent} from "@/context/AgentContext";

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

export default function RequestsTable() {
    const {tokenData, setTokenData} = useAgent();
    const [requestData, setRequestData] = useState<RequestData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequestsData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('https://api.rahnamayefarda.ir/api/agentrequestreport?command=getagent_request', {
                    method: 'POST',
                    headers: {
                        'Authorization': tokenData,
                    },
                });

                const data = await res.json();
                if (data.result != 'ok') {
                    console.error(data.desc)
                    setError(data.desc);
                    return;
                }

                // todo: success alert
                if(data.data != '') setRequestData(data.data)
                else setRequestData([])
                setError(null); // Clear any previous errors
                console.log(data.desc)
            } catch (err) {
                setError(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestsData();
    }, []);

    return (
        <>
            {error && <div className="text-red-500">{error}</div>}

            <div className="overflow-hidden bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {isLoading ? (
                            <div className="text-center">در حال دریافت اطلاعات...</div>
                        ) : (
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            نام کاربر
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            شماره موبایل
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            بیمه
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            لوگوی بیمه
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            تاریخ درخواست
                                        </TableCell>

                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {requestData?.map((test) => (

                                        <TableRow key={test.request_id}>
                                            {/* User Name */}
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                          <span
                                              className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {test.user_name} {test.user_family}
                                          </span>
                                            </TableCell>

                                            {/* User Mobile */}
                                            <TableCell
                                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {test.user_mobile}
                                            </TableCell>

                                            {/* Insurance Name */}
                                            <TableCell
                                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {test.request_fieldinsurance_fa}
                                            </TableCell>

                                            {/* Insurance Logo */}
                                            <TableCell
                                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="w-full h-full overflow-hidden rounded-md">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={test.fieldinsurance_logo_url}
                                                        alt={test.request_fieldinsurance_fa}

                                                    />
                                                </div>
                                            </TableCell>

                                            {/* Request Date */}
                                            <TableCell
                                                className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {test.staterequest_last_timestamp}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        )}

                    </div>
                </div>
            </div>
        </>

    );
}
