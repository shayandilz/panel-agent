"use client";

import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import services from "@/core/service";
import {toast} from "react-toastify";
import FilterComponent from "@/components/custom/filters/FilterComponent";

interface PaidRequests {
    request_id: any | '-';
    request_fieldinsurance_fa: any | '-';
    user_pey_amount: any | '-';
    request_ready: any | '-';
}

export default function PaidRequests() {
    const [paidRequests, setPaidRequests] = useState<PaidRequests[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const fetchPaidRequests = async (filters = null ) => {
        try {
            setIsLoading(true);

            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=payed`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setPaidRequests(data.data || []);
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaidRequests();
    }, []);

    return (
        <>
            <FilterComponent onFilterApply={(filters) => setFilters(filters)} filterType={"all"}/>
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
                        {paidRequests.length > 0 ? (
                            paidRequests.map((request) => (
                                <TableRow key={request.request_id} className="text-center">
                                    <TableCell>{request.request_id}</TableCell>
                                    <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_end_price || "-"}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_start_date || "-"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow key="noRecord">
                                <TableCell className="text-center">
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
