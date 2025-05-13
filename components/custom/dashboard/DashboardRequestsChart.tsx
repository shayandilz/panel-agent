"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import Image from "next/image";
import Link from "next/link";
import services from "@/core/service";
import {toast} from "react-toastify";
import {useModal} from "@/hooks/useModal";
import {Modal} from "@/components/ui/modal";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

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
    const [selectedRequest, setSelectedRequest] = useState<DashboardRequestsChart>(null);
    const {isOpen, openModal, closeModal} = useModal();

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
                                <TableCell isHeader></TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dashboardRequests.length > 0 && dashboardRequests.map((request, index) => (
                                <TableRow className={`${index > 5 ? 'hidden' : ''} text-center`}
                                          key={request?.request_id}>
                                    <TableCell>{request?.request_id}</TableCell>
                                    <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                        <div onClick={() => {
                                            setSelectedRequest(request)
                                            openModal()
                                        }} className="w-full h-full overflow-hidden rounded-md">
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
                                    <TableCell>
                                        <Button variant="outline" onClick={() => {
                                            window.location.href = '/requests/' + request.request_id
                                        }}>جزئیات</Button>
                                    </TableCell>
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

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div
                    className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                    <div className="mb-12">
                        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                            جزئیات درخواست - شماره
                            {selectedRequest?.request_id}
                        </h4>
                    </div>
                    <form>
                        {/*<div>*/}

                        <div className="flex items-center w-full gap-6 xl:flex-row mb-12">
                            {selectedRequest?.fieldinsurance_logo_url && (
                                <div className="overflow-hidden rounded-md">
                                    <Image
                                        className="mx-auto"
                                        width={60}
                                        height={60}
                                        src={selectedRequest?.fieldinsurance_logo_url}
                                        alt={''}
                                    />
                                </div>
                            )}
                            <div className="order-3 xl:order-2">
                                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-start">
                                    <span className="me-3">{selectedRequest?.request_fieldinsurance_fa}</span>
                                </h4>
                                <div
                                    className="flex items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-start">
                                    <p className=" text-gray-500 dark:text-gray-400">
                                        {selectedRequest?.request_last_state_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:gap-8">
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    مشخصات کاربر
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {(selectedRequest?.user_name + ' ' +  selectedRequest?.user_family) || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    شماره  همراه
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.user_mobile || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    ارگان
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.request_organ || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    مبلغ نقدی پرداخت شده
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.user_pey_cash?.toLocaleString() || '0'}ریال
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    مبلغ بیمه
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.user_pey_amount?.toLocaleString() || '0'}ریال
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    قیمت اعلام شده نماینده
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.request_ready[0]?.requst_ready_end_price?.toLocaleString() || '0'}ریال
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    تاریخ آخرین وضعیت
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.staterequest_last_timestamp || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    جزئیات درخواست
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {selectedRequest?.request_description || '-'}
                                </p>
                            </div>
                        </div>
                        {/*</div>*/}
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                            <Button className="px-8" size="sm" onClick={() => {
                                window.location.href = '/requests/' + selectedRequest?.request_id
                            }}>جزئیات</Button>
                            <Button className="px-8" size="sm" variant="outline" onClick={closeModal}>
                                بستن
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
