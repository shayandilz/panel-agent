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

interface UnconfirmedRequestsChart {
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

export default function UnconfirmedRequests() {
    const [unconfirmedRequests, setUnconfirmedRequests] = useState<UnconfirmedRequestsChart[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const fetchUnconfirmedRequests = async () => {
        try {
            setIsLoading(true);
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=notapprov`);
            if (response) {
                const data = response.data;
                console.log('getagent_request notapprov', data)
                if (data.result != 'ok') {
                    throw new Error(data.desc);
                }

                if (data.data) setUnconfirmedRequests(data.data)
                else setUnconfirmedRequests([])
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
            setTimeout(fetchUnconfirmedRequests, 60000)
        }
    };

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    useEffect(() => {
        fetchUnconfirmedRequests();
    }, []);

    return (
        <>
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex justify-between border-bottom mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            درخواست های تائید نشده توسط نماینده
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
                                {unconfirmedRequests.length > 0 && unconfirmedRequests.map((request, index) => (
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
                                        <TableCell>{request?.user_pey_cash}</TableCell>
                                        <TableCell>{request?.request_last_state_id}</TableCell>
                                        <TableCell>{request?.request_ready[0]['requst_ready_end_price']}</TableCell>
                                        <TableCell>{request?.user_pey_amount}</TableCell>
                                        <TableCell>{request?.user_pey_amount}</TableCell>
                                        <TableCell>{request?.request_ready[0]['requst_ready_start_date'] || '-'}</TableCell>

                                    </TableRow>
                                ))}
                                {unconfirmedRequests.length == 0 && (
                                    <TableRow key="noRecord">
                                        <TableCell colSpan={5} className="text-center px-5 py-4 sm:px-6">
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
                </div>
            </div>
        </>
    )
}
