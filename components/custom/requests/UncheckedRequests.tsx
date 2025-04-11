"use client";

import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import services from "@/core/service";
import {toast} from "react-toastify";
import FilterComponent from "@/components/custom/filters/FilterComponent";

interface UncheckedRequests {
    request_id: any;
    user_id: any;
    user_name: any;
    user_family: any;
    user_mobile: any;
    fieldinsurance_logo_url: any;
    fieldinsurance_id: any;
    request_fieldinsurance_fa: any;
    request_description: any;
    request_last_state_id: any;
    request_last_state_name: any;
    request_organ: any;
    user_pey_amount: any;
    user_pey_cash: any;
    user_pey_instalment: any;
    staterequest_last_timestamp: any;
    request_ready: any;
    request_financial_approval: any;
    request_financial_doc: any;
}

export default function UncheckedRequests() {
    const [uncheckedRequests, setUncheckedRequests] = useState<UncheckedRequests[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUncheckedRequests();
    }, []);

    const fetchUncheckedRequests = async (filters = null) => {
        try {
            setIsLoading(true);
            const queryParams = {
                start_date: filters?.startDate,
                end_date: filters?.endDate,
                fieldinsurance_id: filters?.fieldInsurance,
                user_mobile: filters?.userMobile,
                order_number: filters?.orderNumber
            };
            console.log('filters', filters)

            const query = queryParams ? `&start_date=${queryParams.start_date}` : "";
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=unchecked${query}`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setUncheckedRequests(data.data || []);
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error(err || "مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <FilterComponent onFilterApply={(filters) => fetchUncheckedRequests(filters)}/>
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader> شماره</TableCell>
                            <TableCell isHeader> لوگو بیمه</TableCell>
                            <TableCell isHeader> رشته بیمه</TableCell>
                            <TableCell isHeader> مبلغ نقدی پرداخت شده</TableCell>
                            <TableCell isHeader>مبلغ اقساط پرداخت شده</TableCell>
                            <TableCell isHeader>کل حق بیمه دریافتی</TableCell>
                            <TableCell isHeader>قیمت اعلام شده نماینده</TableCell>
                            <TableCell isHeader>اختلاف قیمت</TableCell>
                            <TableCell isHeader> تاریخ شروع</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {uncheckedRequests.length > 0 ? (uncheckedRequests.map((request) => (
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
                                    <TableCell>{request.user_pey_cash}</TableCell>
                                    <TableCell>{request.request_last_state_id}</TableCell>
                                    <TableCell>{request.request_ready[0]['requst_ready_end_price']}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.request_ready[0]['requst_ready_start_date']}</TableCell>

                                </TableRow>
                            )))
                            : (
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
            )}
        </>
    );
}
