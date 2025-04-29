"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import Image from "next/image";
import services from "@/core/service";
import { toast } from "react-toastify";
import FilterComponent from "@/components/custom/filters/FilterComponent";

// Define types for the ConfirmedRequest and Filter parameters
interface RequestReady {
    requst_ready_end_price: number | string; // Assuming price can be string or number
    requst_ready_start_date: string; // Assuming it's a string
}

interface ConfirmedRequest {
    request_id: number;
    user_id: number;
    user_name: string;
    user_family: string;
    user_mobile: string;
    fieldinsurance_logo_url: string;
    fieldinsurance_id: string;
    request_fieldinsurance_fa: string;
    request_description: string;
    request_last_state_id: string;
    request_last_state_name: string;
    request_organ: string;
    user_pey_amount: number;
    user_pey_cash: number;
    user_pey_instalment: number;
    staterequest_last_timestamp: string;
    request_ready: RequestReady[];
    request_financial_approval: string;
    request_financial_doc: string;
}

interface Filters {
    startDate?: number;
    endDate?: number;
    fieldInsurance?: string;
    userMobile?: string;
    orderNumber?: string;
}

interface ResponseData {
    result: string;
    data: ConfirmedRequest[] | null;
    desc?: string;
}

export default function ConfirmedRequests() {
    const [confirmedRequests, setConfirmedRequests] = useState<ConfirmedRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({});

    const fetchConfirmedRequests = async () => {
        try {
            setIsLoading(true);
            const queryParams = {
                start_date: filters?.startDate,
                end_date: filters?.endDate,
                fieldinsurance_id: filters?.fieldInsurance,
                user_mobile: filters?.userMobile,
                order_number: filters?.orderNumber,
            };
            console.log('filters', filters);

            const query = filters ? `&start_date=${queryParams?.start_date}` : "";
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=checkedfinancial${query}`);

            if (response) {
                const data: ResponseData = response.data;
                // console.log('getagent_request checkedfinancial', data);
                if (data.result !== 'ok') {
                    throw new Error(data.desc || 'Unknown error');
                }

                if (data.data) {
                    setConfirmedRequests(data.data);
                } else {
                    setConfirmedRequests([]);
                }
            } else {
                toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            }
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfirmedRequests();
    }, []);

    return (
        <>
            <FilterComponent onFilterApply={(filters) => setFilters(filters)} filterType={"all"} />

            {
                isLoading ? (
                    <div className="text-center">در حال دریافت اطلاعات...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell isHeader> شماره</TableCell>
                                <TableCell isHeader>لوگو بیمه</TableCell>
                                <TableCell isHeader> رشته بیمه</TableCell>
                                <TableCell isHeader> مبلغ نقدی پرداخت شده</TableCell>
                                <TableCell isHeader>مبلغ تایید شده</TableCell>
                                <TableCell isHeader> تاریخ شروع</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {confirmedRequests.length > 0 ? (
                                confirmedRequests.map((request) => (
                                    <TableRow className="text-center" key={request.request_id}>
                                        <TableCell>{request.request_id}</TableCell>
                                        <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                            <div className="w-full h-full overflow-hidden rounded-md">
                                                <Image
                                                    className="mx-auto"
                                                    width={40}
                                                    height={40}
                                                    src={request.fieldinsurance_logo_url}
                                                    alt={request.request_fieldinsurance_fa}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                        <TableCell>{request.user_pey_amount}</TableCell>
                                        <TableCell>{request.request_ready[0]?.requst_ready_end_price}</TableCell>
                                        <TableCell>{request.request_ready[0]?.requst_ready_start_date}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key="noRecord">
                                    <TableCell className="text-center px-5 py-4 sm:px-6">
                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            رکوردی یافت نشد
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )
            }
        </>
    );
}
