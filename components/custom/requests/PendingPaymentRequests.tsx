"use client";

import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import Image from "next/image";
import services from "@/core/service";
import {toast} from "react-toastify";
import FilterComponent from "@/components/custom/filters/FilterComponent";

interface PendingPaymentRequests {
    request_id: any;
    request_fieldinsurance_fa: any;
    user_pey_amount: any;
    request_ready: any;
}

export default function PendingPaymentRequests() {
    const [pendingPaymentRequests, setPendingPaymentRequests] = useState<PendingPaymentRequests[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const fetchPendingPaymentRequests = async () => {
        try {
            setIsLoading(true);

            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=progresspaing`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setPendingPaymentRequests(data.data || []);
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error(err || "مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPaymentRequests();
    }, []);

    return (
        <>
            <FilterComponent onFilterApply={(filters) => setFilters(filters)}/>
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="text-center">
                            <TableCell isHeader>شماره</TableCell>
                            <TableCell isHeader>رشته بیمه</TableCell>
                            <TableCell isHeader>مبلغ نقدی پرداخت شده</TableCell>
                            <TableCell isHeader>مبلغ تایید شده</TableCell>
                            <TableCell isHeader>تاریخ شروع</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingPaymentRequests.length > 0 ? (
                            pendingPaymentRequests.map((request) => (
                                <TableRow key={request.request_id} className="text-center">
                                    <TableCell>{request.request_id}</TableCell>
                                    <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_end_price || "-"}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_start_date || "-"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow key="noRecord" className="text-center">
                                <TableCell colspan={5}>
                                    رکوردی یافت نشد
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </>
    );
}
