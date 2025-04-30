"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import services from "@/core/service";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import Label from "@/components/form/Label";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { convertToPersian } from "@/utils/utils";
import {Trash} from "lucide-react";
interface PaidRequests {
    request_id: any | '-';
    request_fieldinsurance_fa: any | '-';
    user_pey_amount: any | '-';
    request_ready: any | '-';
    fieldinsurance_id: any | '-'; // Ensure to include fieldinsurance_id
}

export default function PaidRequests() {
    const [paidRequests, setPaidRequests] = useState<PaidRequests[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<PaidRequests[]>([]);
    const [fieldInsurances, setFieldInsurances] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        orderNumber: "",
        fieldInsurance: "",
        startDate: "",
    });

    // Fetch paid requests
    const fetchPaidRequests = async () => {
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

    // Fetch field insurance data
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

    // Apply filters to paidRequests
    useEffect(() => {
        const applyFilters = () => {
            let filtered = paidRequests.filter((item) => {
                // Filter by order number
                if (filters.orderNumber && !item.request_id.toString().includes(filters.orderNumber)) return false;
                // Filter by field insurance ID
                if (filters.fieldInsurance && item.fieldinsurance_id !== filters.fieldInsurance) return false;
                // Filter by start date
                if (filters.startDate) {
                    const itemDate = convertToPersian(item.request_ready?.[0]?.requst_ready_start_date);
                    if (itemDate !== filters.startDate) return false;
                }
                return true;
            });
            setFilteredRequests(filtered);
        };

        applyFilters();
    }, [filters, paidRequests]);

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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
        setFilters({
            orderNumber: "",
            fieldInsurance: "",
            startDate: "",
        });
    };
    // Fetch data on mount
    useEffect(() => {
        fetchPaidRequests();
        fetchFieldInsurances();
    }, []);

    return (
        <>
            {/* Filter Inputs */}
            <div className="mb-6 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                    {/* Order Number Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره سفارش</label>
                        <input
                            type="text"
                            name="orderNumber"
                            value={filters.orderNumber || ""}
                            onChange={handleFilterChange}
                            placeholder="شماره سفارش"
                            className="block w-full border rounded px-4 py-2"
                        />
                    </div>

                    {/* Field Insurance Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رشته بیمه</label>
                        <select
                            name="fieldInsurance"
                            value={filters.fieldInsurance || ""}
                            onChange={handleFilterChange}
                            className="block w-full border rounded px-4 py-2"
                        >
                            <option value="">انتخاب رشته بیمه</option>
                            {fieldInsurances.map((insurance) => (
                                <option key={insurance.value} value={insurance.value}>
                                    {insurance.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date Picker */}
                    <div>
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تاریخ شروع
                        </Label>
                        <DatePicker
                            value={filters.startDate}
                            name="startDate"
                            calendar={persian}
                            locale={persian_fa}
                            format="YYYY/MM/DD"
                            onChange={(value) => handleDateChange("startDate", value)}
                            containerClassName="block w-full"
                            inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">حذف فیلترها</label>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <Trash size={14} />
                        </button>
                    </div>

                </div>
            </div>

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
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <TableRow key={request.request_id} className="text-center">
                                    <TableCell className={'py-3'}>{request.request_id}</TableCell>
                                    <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_end_price || "-"}</TableCell>
                                    <TableCell>{request.request_ready?.[0]?.requst_ready_start_date || "-"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow key="noRecord" className="text-center">
                                <TableCell> رکوردی یافت نشد </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </>
    );
}
