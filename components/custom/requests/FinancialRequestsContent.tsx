"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import Image from "next/image";
import services from "@/core/service";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {convertToPersian} from "@/utils/utils";
import {Trash} from "lucide-react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";


// Define types for the FinancialRequest and Filter parameters
interface RequestReady {
    requst_ready_end_price: number | string;
    requst_ready_start_date: string;
    requst_ready_end_date: string;
    requst_ready_num_ins?: string;
    requst_suspend_desc?: string;
}

interface FinancialRequest {
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
    // request_financial_approval: string;
    // request_financial_doc: string;
}

interface Filters {
    request_id?: number | null;
    user_mobile?: string | null;
    fieldinsurance_id?: string | null;
    user_pey_cash?: string | null;
    user_pey_amount?: string | null;
    requst_ready_start_date?: string | null;  // We'll store the date in "YYYY-MM-DD" format
    endDate?: string | null;    // We'll store the date in "YYYY-MM-DD" format
}

interface Props {
    mode: string;
}

export default function FinancialRequestsContent({mode}: Props) {
    const [financialRequests, setFinancialRequests] = useState<FinancialRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<FinancialRequest[]>([]);
    const [fieldInsurances, setFieldInsurances] = useState<{ value: string, label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({});

    // Fetch financial requests and field insurance data
    const fetchFinancialRequests = async () => {
        try {
            setIsLoading(true);

            const response = await services.Requests.getReport(
                `?command=getagent_request&approvaslmode=`+ mode
            );

            if (response) {
                const data = response.data;
                if (data.result !== "ok") {
                    throw new Error(data.desc || "مشکلی پیش آمد. دوباره تلاش کنید.");
                }
                setFinancialRequests(data.data || []);
            } else {
                toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        } catch (err) {
            toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFieldInsurances = async () => {
        try {
            const response = await services.Requests.getReport("?command=get_fieldinsurance");

            if (response?.data?.result === "ok") {
                const insurances = response.data?.data.map((field: any) => ({
                    value: field.fieldinsurance_id,
                    label: field.fieldinsurance_fa,
                }));
                setFieldInsurances(insurances);
            }
        } catch (err) {
            toast.error("خطا در دریافت رشته های بیمه");
        }
    };

    // Apply filters to financialRequests
    useEffect(() => {
        const applyFilters = (data: FinancialRequest[], filters: Filters) => {
            let filtered = data.filter((item) => {
                // Filter logic based on filters
                if (filters.request_id && !item.request_id.toString().includes(String(filters.request_id))) return false;
                if (filters.user_mobile && !item.user_mobile.includes(filters.user_mobile)) return false;
                if (filters.fieldinsurance_id && item.fieldinsurance_id !== filters.fieldinsurance_id) return false;
                if (filters.user_pey_cash && !item.user_pey_cash.toString().includes(filters.user_pey_cash)) return false;
                if (filters.user_pey_amount && !item.user_pey_amount.toString().includes(filters.user_pey_amount)) return false;

                // Date Filtering logic
                if (filters.requst_ready_start_date && item?.request_ready[0]) {
                    const itemDate = convertToPersian(item?.request_ready[0]?.requst_ready_start_date);
                    if (itemDate !== filters.requst_ready_start_date) {
                        return false;
                    } else {
                        console.log("Dates match:", itemDate, "==", filters.requst_ready_start_date); // Log match
                    }
                }


                return true;
            });

            setFilteredRequests(filtered);
        };

        applyFilters(financialRequests, filters); // Apply filters whenever filters or financialRequests change
    }, [filters, financialRequests]);

    // Re-fetch financial requests and field insurances when the component mounts
    useEffect(() => {
        fetchFinancialRequests();
        fetchFieldInsurances();
    }, []); // Initial fetch when the component loads

    // Handle filter change
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string,value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Handle date picker change
    const handleDateChange = (name: string, value: any) => {
        const formattedDate = value ? value.format("YYYY/MM/DD") : "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: formattedDate,
        }));
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    return (
        <>
            {/* Filter Inputs */}
            <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        {/*<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره سفارش</label>*/}
                        <Input
                            type="number"
                            name="request_id"
                            defaultValue={filters?.request_id }
                            onChange={handleFilterChange}
                            placeholder="شماره سفارش"
                        />
                    </div>

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره موبایل</label>*/}
                    {/*    <input*/}
                    {/*        type="tel"*/}
                    {/*        name="user_mobile"*/}
                    {/*        value={filters.user_mobile || ""}*/}
                    {/*        onChange={handleFilterChange}*/}
                    {/*        placeholder="شماره موبایل"*/}
                    {/*        className="block w-full border rounded px-4 py-2"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div>
                        {/*<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رشته بیمه</label>*/}
                        <Select
                            options={fieldInsurances}
                            defaultValue={filters?.fieldinsurance_id || ''}
                            onChange={val=>handleSelectChange('fieldinsurance_id', val)}
                            placeholder={'انتخاب رشته بیمه'}
                        >
                        </Select>
                    </div>

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">مبلغ نقدی پرداخت شده</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="user_pey_cash"*/}
                    {/*        value={filters.user_pey_cash || ""}*/}
                    {/*        onChange={handleFilterChange}*/}
                    {/*        placeholder="مبلغ نقدی پرداخت شده"*/}
                    {/*        className="block w-full border rounded px-4 py-2"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">مبلغ تایید شده</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="user_pey_amount"*/}
                    {/*        value={filters.user_pey_amount || ""}*/}
                    {/*        onChange={handleFilterChange}*/}
                    {/*        placeholder="مبلغ تایید شده"*/}
                    {/*        className="block w-full border rounded px-4 py-2"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Start Date Picker */}
                    <div>
                        {/*<Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">*/}
                        {/*    تاریخ شروع*/}
                        {/*</Label>*/}
                        <DatePicker
                            value={filters?.requst_ready_start_date}
                            placeholder={'تاریخ شروع'}
                            name="requst_ready_start_date"
                            calendar={persian}
                            locale={persian_fa}
                            format="YYYY/MM/DD"
                            onChange={(value) => handleDateChange("requst_ready_start_date", value)}
                            containerClassName="block w-full"
                            inputClass="h-11 w-full rounded-lg border dark:border-gray-700 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800"
                        />
                    </div>
                    <div>
                        {/*<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">حذف فیلترها</label>*/}
                        <Button
                            size={'sm'}
                            onClick={handleClearFilters}
                        >
                            <Trash size={14} /> حذف فیلترها
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
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
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <TableRow className="text-center" key={request.request_id}>
                                    <TableCell>{request.request_id}</TableCell>
                                    <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                        <div className="w-full h-full overflow-hidden rounded-md">
                                            <Image
                                                className="mx-auto"
                                                width={40}
                                                height={40}
                                                src={request.fieldinsurance_logo_url}
                                                alt={''}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request.user_pey_cash}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{convertToPersian(request.request_ready[0]?.requst_ready_start_date)}</TableCell>

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
            )}
        </>
    );
}
