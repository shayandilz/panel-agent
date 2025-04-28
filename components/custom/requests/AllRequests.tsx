"use client";

import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/custom/tables";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import services from "@/core/service";
import {calculateTimestamp} from "@/core/utils";
import {toast} from "react-toastify";
import FilterComponent from "@/components/custom/filters/FilterComponent";

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

export default function AllRequests() {
    const [requestData, setRequestData] = useState<RequestData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchRequestsData = async () => {
            setIsLoading(true);
            try {
                const res = await services.Requests.getReport('?command=getagent_request')
                if (res) {
                    let data = res.data

                    // console.log('getagent_request', data)
                    if (data.result != 'ok') {
                        toast.error(data.desc);
                        return;
                    }

                    // toast.success(data.desc);
                    if (data.data != '') setRequestData(data.data)
                    else setRequestData([])
                } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            } catch (err) {
                toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestsData();
    }, []);

    return (
        <>
            <div className="overflow-hidden">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {isLoading ? (
                            <div className="text-center">در حال دریافت اطلاعات...</div>
                        ) : (
                            <>
                                <FilterComponent filterType="requests" onFilterApply={(filters) => setFilters(filters)}/>

                                <Table>
                                    {/* Table Header */}
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                شماره سفارش
                                            </TableCell>
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
                                                وضعیت سفارش
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
                                                تاریخ آخرین وضعیت
                                            </TableCell>

                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                            </TableCell>

                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {requestData.length > 0 ? (requestData?.map((request) => (
                                            <TableRow key={request.request_id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                  <span
                                                      className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {request.request_id}
                                                  </span>
                                                </TableCell>
                                                {/* User Name */}
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                  <span
                                                      className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {request.user_name} {request.user_family}
                                                  </span>
                                                </TableCell>

                                                {/* User Mobile */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {request.user_mobile}
                                                </TableCell>

                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {request.request_last_state_name}
                                                </TableCell>

                                                {/* Insurance Name */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {request.request_fieldinsurance_fa}
                                                </TableCell>

                                                {/* Insurance Logo */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div className="w-full h-full overflow-hidden rounded-md">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={request.fieldinsurance_logo_url}
                                                            alt={request.request_fieldinsurance_fa}

                                                        />
                                                    </div>
                                                </TableCell>

                                                {/* Request Date */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    {calculateTimestamp(request?.staterequest_last_timestamp)}
                                                </TableCell>

                                                {/* Request Detail */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    <Link
                                                        className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                                        href={'/requests/' + request.request_id}>انتخاب</Link>
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                            <TableRow key="noRecord">
                                                <TableCell className="text-center px-5 py-4 sm:px-6">
                                                    <span
                                                        className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    رکوردی یافت نشد
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                    </TableBody>
                                </Table>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>

    );
}
