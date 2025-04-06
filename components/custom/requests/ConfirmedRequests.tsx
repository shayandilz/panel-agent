"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../ui/table";
import Image from "next/image";
import services from "@/core/service";
import {toast} from "react-toastify";

interface ConfirmedRequests {
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

export default function ConfirmedRequests() {
    const [confirmedRequests, setConfirmedRequests] = useState<ConfirmedRequests[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfirmedRequests = async () => {
            try {
                setIsLoading(true);
                const response = await services.Requests.getReport("?command=getagent_request&approvaslmode=checkedfinancial");
                if (response) {
                    const data = response.data;
                    console.log('getagent_request checkedfinancial', data)
                    if (data.result != 'ok') {
                        throw new Error(data.desc);
                    }

                    if (data.data) setConfirmedRequests(data.data)
                    else setConfirmedRequests([])
                } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            } catch (err) {
                toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfirmedRequests();
    }, []);

    return (isLoading ? (
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
                    {confirmedRequests.length > 0 && confirmedRequests.map((request) => (
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
                            <TableCell>{request.request_ready[0]['requst_ready_end_price']}</TableCell>
                            <TableCell>{request.request_ready[0].requst_ready_start_date}</TableCell>
                        </TableRow>
                    ))}
                    {confirmedRequests.length == 0 && (
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
        )
    );
}
