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
import Button from "@/components/ui/button/Button";
import {router} from "next/client";

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
    const [filteredData, setFilteredData] = useState<RequestData[]>(requestData);
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
                toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestsData();
    }, []);

    useEffect(() => {
        const applyFilters = (data: RequestData[], filters: any) => {
            let filtered = data.filter((item) => {
                // Corrected the filtering logic
                if (filters.staterequest_last_timestamp && !item.staterequest_last_timestamp.includes(filters.staterequest_last_timestamp)) return false;
                if (filters.request_organ && !item.request_organ.includes(filters.request_organ)) return false;
                if (filters.fieldinsurance_id && !item.fieldinsurance_id.includes(filters.fieldinsurance_id)) return false;
                if (filters.user_mobile && !item.user_mobile.includes(filters.user_mobile)) return false;
                if (filters.request_id && !item.request_id.includes(filters.request_id)) return false;
                if (filters.request_last_state_id && item.request_last_state_id !== filters.request_last_state_id) return false;
                // Add more filter conditions as needed
                return true;
            });

            setFilteredData(filtered);
        };

        applyFilters(requestData, filters); // Apply filters when filters are changed
    }, [filters, requestData]); // Apply effect when filters or requestData changes



    return (
        <>
            <div className="overflow-hidden">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {isLoading ? (
                            <div className="text-center">در حال دریافت اطلاعات...</div>
                        ) : (
                            <>
                                <FilterComponent filterType="requests" onFilterApply={filters => setFilters(filters)}/>

                                <Table>
                                    {/* Table Header */}
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow className={'bg-gray-100'}>
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
                                                {''}
                                            </TableCell>

                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {filteredData.length > 0 ? (filteredData?.map((request) => (
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
                                                      className="block font-medium text-gray-800 dark:text-white/90">
                                                    {request.user_name} {request.user_family}
                                                  </span>
                                                </TableCell>

                                                {/* User Mobile */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                                                    {request.user_mobile}
                                                </TableCell>

                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                                                    {request.request_last_state_name}
                                                </TableCell>

                                                {/* Insurance Name */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
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
                                                    className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                    {calculateTimestamp(request?.staterequest_last_timestamp)}
                                                </TableCell>

                                                {/* Request Detail */}
                                                <TableCell
                                                    className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                    <Button variant="outline" onClick={()=> {
                                                        setIsLoading(true)
                                                        window.location.href = '/requests/' + request.request_id
                                                    }}>جزئیات</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                            <TableRow key="noRecord">
                                                <TableCell className="col-span-7 text-center px-5 py-4 sm:px-6">
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
