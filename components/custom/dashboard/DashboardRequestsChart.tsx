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
import ComponentCard from "@/components/common/ComponentCard";

interface DashboardRequestsChart {
    request_id: string | null;
    user_id: string | null;
    user_name: string | null;
    user_family: string | null;
    user_mobile: string | null;
    fieldinsurance_logo_url: string | null;
    fieldinsurance_id: string | null;
    request_fieldinsurance_fa: string | null;
    request_description: string | null;
    request_last_state_id: string | null;
    request_last_state_name: string | null;
    request_organ: string | null;
    user_pey_amount: string | null;
    user_pey_cash: string | null;
    user_pey_instalment: string | null;
    staterequest_last_timestamp: string | null;
    request_ready: RequestReady[] | [];
    // request_financial_approval: string | null;
    // request_financial_doc: string | null;
}


interface RequestReady {
    requst_ready_start_date: string;
    requst_ready_end_date: string;
    requst_ready_end_price: string;
    requst_ready_num_ins?: string;
    requst_suspend_desc?: string;
}

interface Props {
    title: string;
    mode: string;
    showAllLink: string;
}

export default function DashboardRequestsChart({title, mode, showAllLink}: Props) {
    const [dashboardRequests, setDashboardRequests] = useState<DashboardRequestsChart[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardRequests = async () => {
        try {
            setIsLoading(true);
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=` + mode);
            if (response) {
                const data = response.data;
                if (data.result != 'ok') {
                    throw new Error(data.desc);
                }

                if (data.data) setDashboardRequests(data.data)
                else setDashboardRequests([])
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
            setTimeout(fetchDashboardRequests, 60000)
        }
    };

    useEffect(() => {
        fetchDashboardRequests();
    }, []);

    return (
        <>
            <ComponentCard showAll={showAllLink} title={title}>

                {isLoading ? (
                    <div className="text-center">در حال دریافت اطلاعات...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell isHeader> شماره</TableCell>
                                <TableCell isHeader> لوگو بیمه</TableCell>
                                <TableCell isHeader> رشته بیمه</TableCell>
                                <TableCell isHeader>وضعیت</TableCell>
                                <TableCell isHeader> مبلغ نقدی پرداخت شده</TableCell>
                                {/*<TableCell isHeader>کل حق بیمه دریافتی</TableCell>*/}
                                <TableCell isHeader>قیمت اعلام شده نماینده</TableCell>
                                {/*<TableCell isHeader>اختلاف قیمت</TableCell>*/}
                                <TableCell isHeader> تاریخ شروع</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dashboardRequests.length > 0 && dashboardRequests.map((request, index) => (
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
                                                alt={''}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{request?.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request?.request_last_state_name}</TableCell>
                                    <TableCell>{request?.user_pey_cash}</TableCell>
                                    {/*<TableCell>{request?.request_ready[0]?.requst_ready_end_price}</TableCell>*/}
                                    <TableCell>{request?.user_pey_amount}</TableCell>
                                    {/*<TableCell>{request?.user_pey_amount}</TableCell>*/}
                                    <TableCell>{request?.request_ready[0]?.requst_ready_start_date}</TableCell>
                                </TableRow>
                            ))}
                            {dashboardRequests.length == 0 && (
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
            </ComponentCard>
        </>
    )
}
