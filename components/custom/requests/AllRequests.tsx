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
import {useModal} from "@/hooks/useModal";
import {Modal} from "@/components/ui/modal";
import {useRouter} from "next/navigation";

interface RequestData {
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
}

interface RequestReady {
    requst_ready_start_date: string;
    requst_ready_end_date: string;
    requst_ready_end_price: string;
    requst_ready_num_ins?: string;
    requst_suspend_desc?: string;
}

export default function AllRequests() {
    const [requestData, setRequestData] = useState<RequestData[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<RequestData>(null);
    const [filteredData, setFilteredData] = useState<RequestData[]>(requestData);
    // const [error, setError] = useState<string | null>(null);
    const {isOpen, openModal, closeModal} = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const router = useRouter();

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
                if (filters.request_organ && !item.request_organ?.includes(filters.request_organ)) return false;
                if (filters.fieldinsurance_id && !item.fieldinsurance_id?.includes(filters.fieldinsurance_id)) return false;
                if (filters.user_mobile && !item.user_mobile?.includes(filters.user_mobile)) return false;
                if (filters.request_id && !item.request_id?.includes(filters.request_id)) return false;
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
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                            >
                                                شماره سفارش
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                نام کاربر
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                شماره موبایل
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                وضعیت سفارش
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                بیمه
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                لوگوی بیمه
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                            >
                                                تاریخ آخرین وضعیت
                                            </TableCell>

                                            <TableCell
                                                isHeader
                                            >
                                                {''}
                                            </TableCell>

                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {filteredData.length > 0 ? (filteredData?.map((request) => (
                                            <TableRow key={request.request_id}>
                                                <TableCell>

                                                    {request.request_id}
                                                </TableCell>
                                                {/* User Name */}
                                                <TableCell>

                                                    {request.user_name} {request.user_family}
                                                </TableCell>

                                                {/* User Mobile */}
                                                <TableCell
                                                >
                                                    {request.user_mobile}
                                                </TableCell>

                                                <TableCell
                                                >
                                                    {request.request_last_state_name}
                                                </TableCell>

                                                {/* Insurance Name */}
                                                <TableCell
                                                >
                                                    {request.request_fieldinsurance_fa}
                                                </TableCell>

                                                {/* Insurance Logo */}
                                                <TableCell>
                                                    <div className="w-full h-full overflow-hidden rounded-md">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={request.fieldinsurance_logo_url}
                                                            alt={''}

                                                        />
                                                    </div>
                                                </TableCell>

                                                {/* Request Date */}
                                                <TableCell
                                                >
                                                    {calculateTimestamp(request?.staterequest_last_timestamp)}
                                                </TableCell>

                                                {/* Request Detail */}
                                                <TableCell>
                                                    <Button className={'me-3'} variant="outline" onClick={() => {
                                                        setSelectedRequest(request)
                                                        openModal()
                                                    }}>جزئیات</Button>
                                                    <Button variant="primary" onClick={() => {
                                                        // setIsLoading(true)
                                                        router.push('/requests/' + request?.request_id);
                                                        // window.location.href = 'requests/' + request.request_id
                                                    }}>عملیات</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                            <TableRow key="noRecord">
                                                <TableCell>

                                                    رکوردی یافت نشد
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
                                    {(selectedRequest?.user_name + ' ' + selectedRequest?.user_family) || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    شماره همراه
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
                                router.push('/requests/' + selectedRequest?.request_id);
                                // window.location.href = 'requests/' + selectedRequest?.request_id
                            }}>عملیات</Button>
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
