"use client";
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import Image from "next/image";
import services from "@/core/service";
import { toast } from "react-toastify";
import DatePicker from "react-multi-date-picker";
import Label from "@/components/form/Label";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { convertToPersian } from "@/utils/utils";
import {Trash} from "lucide-react";

interface UnconfirmedRequests {
    request_id: any | '-';
    user_id: any | '-';
    user_name: any | '-';
    user_family: any | '-';
    user_mobile: any | '-';
    fieldinsurance_logo_url: any | '-';
    fieldinsurance_id: any | '-';
    request_fieldinsurance_fa: any | '-';
    request_description: any | '-';
    request_last_state_id: any | '-';
    request_last_state_name: any | '-';
    request_organ: any | '-';
    user_pey_amount: any | '-';
    user_pey_cash: any | '-';
    user_pey_instalment: any | '-';
    staterequest_last_timestamp: any | '-';
    request_ready: any | '-';
    request_financial_approval: any | '-';
    request_financial_doc: any | '-';
}

export default function UnconfirmedRequests() {
    const [unconfirmedRequests, setUnconfirmedRequests] = useState<UnconfirmedRequests[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<UnconfirmedRequests[]>([]);
    const [fieldInsurances, setFieldInsurances] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        orderNumber: "",
        userMobile: "",
        startDate: "",
        fieldInsurance: "",
    });

    // Fetch unconfirmed requests
    const fetchUnconfirmedRequests = async () => {
        try {
            setIsLoading(true);
            const response = await services.Requests.getReport(`?command=getagent_request&approvaslmode=notapprov`);
            if (response) {
                const data = response.data;
                if (data.result != "ok") {
                    throw new Error(data.desc);
                }
                setUnconfirmedRequests(data.data || []);
            } else {
                toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        } catch (err) {
            toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch field insurances
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

    // Apply filters to unconfirmedRequests
    useEffect(() => {
        const applyFilters = () => {
            let filtered = unconfirmedRequests.filter((item) => {
                if (filters.orderNumber && !item.request_id.toString().includes(filters.orderNumber)) return false;
                if (filters.userMobile && !item.user_mobile.includes(filters.userMobile)) return false;
                if (filters.fieldInsurance && item.fieldinsurance_id !== filters.fieldInsurance) return false;
                if (filters.startDate) {
                    const itemDate = convertToPersian(item.request_ready[0]?.requst_ready_start_date);
                    if (itemDate !== filters.startDate) return false;
                }
                return true;
            });
            setFilteredRequests(filtered);
        };

        applyFilters();
    }, [filters, unconfirmedRequests]);

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
            userMobile: "",
            startDate: "",
            fieldInsurance: "",
        });
    };

    // Fetch data on mount
    useEffect(() => {
        fetchUnconfirmedRequests();
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
                        <TableRow>
                            <TableCell isHeader> شماره</TableCell>
                            <TableCell isHeader> لوگو بیمه</TableCell>
                            <TableCell isHeader> رشته بیمه</TableCell>
                            <TableCell isHeader> مبلغ نقدی پرداخت شده</TableCell>
                            <TableCell isHeader> مبلغ اقساط پرداخت شده</TableCell>
                            <TableCell isHeader> کل حق بیمه دریافتی</TableCell>
                            <TableCell isHeader> قیمت اعلام شده نماینده</TableCell>
                            <TableCell isHeader> اختلاف قیمت</TableCell>
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
                                                alt={request.request_fieldinsurance_fa}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{request.request_fieldinsurance_fa}</TableCell>
                                    <TableCell>{request.user_pey_cash}</TableCell>
                                    <TableCell>{request.user_pey_instalment}</TableCell>
                                    <TableCell>{request.user_pey_amount}</TableCell>
                                    <TableCell>{request.request_ready[0]?.requst_ready_end_price}</TableCell>
                                    <TableCell>{request.request_last_state_id}</TableCell>
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
