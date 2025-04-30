"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import Image from "next/image";
import Link from "next/link";
import services from "@/core/service";
import {toast} from "react-toastify";
import {MoreDotIcon} from "@/icons";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";

interface PaidRequestsChart {
    request_id: string;
    user_id: string;
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
    user_pey_instalment: string;
    staterequest_last_timestamp: string;
    request_financial_approval: string;
    request_financial_doc: string;
    request_ready: RequestReady[] | [];
}

interface RequestReady {
    requst_ready_start_date: string;
    requst_ready_end_date: string;
    requst_ready_end_price: string;
    requst_ready_num_ins?: string;
    requst_suspend_desc?: string;
}

export default function PaidRequests() {
    const [paidRequests, setPaidRequests] = useState<PaidRequestsChart[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);


    const fetchPaidRequests = async () => {
        try {
            setIsLoading(true);
            // const queryParams = {
            //     start_date: filters?.startDate,
            //     end_date: filters?.endDate,
            //     fieldinsurance_id: filters?.fieldInsurance,
            //     user_mobile: filters?.userMobile,
            //     order_number: filters?.orderNumber
            // };
            // console.log('filters', filters)

            // const query = filters ? `&start_date=${queryParams?.start_date}` : "";
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=payed`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                if (data.data) setPaidRequests(data.data)
                else setPaidRequests([])
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
            setTimeout(fetchPaidRequests, 60000)
        }
    };

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    useEffect(() => {
        fetchPaidRequests();
    }, []);

    return (
        <>
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex justify-between border-bottom mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            درخواست های پرداخت شده توسط کاربر
                        </h3>
                        {/*<p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">*/}
                        {/*    تعداد درخواست ها بر اساس رشته بیمه*/}
                        {/*</p>*/}
                    </div>

                    <div className="relative inline-block">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            <MoreDotIcon
                                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"/>
                        </button>
                        <Dropdown
                            isOpen={isOpen}
                            onClose={closeDropdown}
                            className="w-40 p-2"
                        >
                            <DropdownItem
                                href="/records/financial-requests"
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                بیشتر
                            </DropdownItem>
                            {/*<DropdownItem*/}
                            {/*    onItemClick={closeDropdown}*/}
                            {/*    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"*/}
                            {/*>*/}
                            {/*    Delete*/}
                            {/*</DropdownItem>*/}
                        </Dropdown>
                    </div>
                </div>

                <hr/>
                <div className="space-y-5">
                    {isLoading ? (
                        <div className="text-center">در حال دریافت اطلاعات...</div>
                    ) : (<Table>
                        <TableHeader>
                            <TableRow className="text-center">
                                <TableCell isHeader>شماره</TableCell>
                                <TableCell isHeader>لوگو بیمه</TableCell>
                                <TableCell isHeader>رشته بیمه</TableCell>
                                <TableCell isHeader>مبلغ نقدی پرداخت شده</TableCell>
                                <TableCell isHeader>مبلغ تایید شده</TableCell>
                                <TableCell isHeader>تاریخ شروع</TableCell>
                                {/*<TableCell isHeader>تاریخ شروع</TableCell>*/}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paidRequests.length > 0 ? (
                                paidRequests.map((request, index) => (
                                    <TableRow className={`${index > 5 ? 'hidden' : ''} text-center`}
                                              key={request?.request_id}>
                                        <TableCell>{request?.request_id}</TableCell>
                                        <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                            <div className="w-full h-full overflow-hidden rounded-md">
                                                <Image
                                                    className="mx-auto"
                                                    width={40}
                                                    height={40}
                                                    src={request?.fieldinsurance_logo_url}
                                                    alt={request?.request_fieldinsurance_fa}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>{request?.request_fieldinsurance_fa}</TableCell>
                                        <TableCell>{request?.user_pey_amount}</TableCell>
                                        <TableCell>{request.request_ready?.[0]?.requst_ready_end_price}</TableCell>
                                        <TableCell>{request.request_ready?.[0]?.requst_ready_start_date}</TableCell>

                                        {/* Request Detail */}
                                        {/*<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">*/}
                                        {/*    <Link className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"*/}
                                        {/*          href={'/requests/' + request.request_id}>انتخاب</Link>*/}
                                        {/*</TableCell>*/}
                                        {/*<TableCell>{request.request_ready?.[0]?.requst_ready_start_date || "-"}</TableCell>*/}
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
                    </Table>)}
                </div>
            </div>
        </>
    )
}
