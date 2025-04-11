"use client";

import React, {useState, useEffect} from "react";
import DatePicker from "react-multi-date-picker";
// import persian from "react-multi-date-picker/plugins/hijri_fa";
import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

import {toast} from "react-toastify";
import services from "@/core/service";

interface FilterProps {
    onFilterApply: (filters: {
        startDate: string;
        endDate: string;
        fieldInsurance: string;
        userMobile: string;
        orderNumber: string;
        documentNum: string ;
    }) => void;
}

interface FieldInsurance {
    fieldinsurance_id: string;
    fieldinsurance_fa: string;
}

interface DocumentData {
    document_id: string;
    document_number: string;
}

export default function FilterComponent({onFilterApply}: FilterProps) {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [fieldInsurances, setFieldInsurances] = useState<FieldInsurance[]>([]);
    const [selectedFieldInsurance, setSelectedFieldInsurance] = useState('');
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [userMobile, setUserMobile] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [loadingFields, setLoadingFields] = useState(true);

    useEffect(() => {
        const fetchDocumentsNumber = async () => {
            try {
                const response = await services.Requests.getReport(
                    "?command=get_doc"
                );
                if (response?.data?.result === "ok") {
                    setDocuments(response.data.data);
                }
            } catch (err) {
                toast.error("خطا در دریافت لیست شماره سند ها");
            } finally {
                setLoadingFields(false);
            }
        };

        const fetchFieldInsurances = async () => {
            try {
                const response = await services.Requests.getReport(
                    "?command=get_fieldinsurance"
                );
                if (response?.data?.result === "ok") {
                    setFieldInsurances(response.data.data);
                }
            } catch (err) {
                toast.error("خطا در دریافت لیست رشته های بیمه");
            }
        };

        fetchFieldInsurances();
        fetchDocumentsNumber();
    }, []);

    const handleFilter = () => {
        onFilterApply({
            documentNum: selectedDocument,
            startDate,
            endDate,
            fieldInsurance: selectedFieldInsurance,
            userMobile,
            orderNumber
        });
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="grid align-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Start Date */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تاریخ شروع
                    </Label>
                    <DatePicker
                        calendars="['persian']"
                        locales="['fa']"
                        format="YYYY/MM/DD"
                        onChange={value => setStartDate(value)}
                        containerClassName="block w-full"
                        inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                    {/*plugins={[persian()]}*/}
                </div>

                {/* End Date */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تاریخ پایان
                    </Label>
                    <DatePicker
                        calendars="['persian']"
                        locales="['fa']"
                        format="YYYY/MM/DD"
                        onChange={value => setEndDate(value)}
                        containerClassName="block w-full"
                        inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                </div>

                {/* Field Insurance Select */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        انتخاب رشته
                    </Label>
                    <select
                        value={selectedFieldInsurance}
                        onChange={(e) => setSelectedFieldInsurance(e.target.value)}
                        className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 
                        text-sm shadow-theme-xs placeholder:text-gray-400 
                        focus:border-brand-300 focus:outline-hidden focus:ring-3 
                        focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 
                        dark:text-white/90 dark:placeholder:text-white/30 
                        dark:focus:border-brand-800 ${
                            selectedFieldInsurance
                                ? "text-gray-800 dark:text-white/90"
                                : "text-gray-400 dark:text-gray-400"
                        }`}
                        disabled={loadingFields}
                    >
                        <option value="">همه رشته ها</option>
                        {loadingFields && <option>در حال دریافت...</option>}
                        {fieldInsurances.map((field) => (
                            <option key={field.fieldinsurance_id} value={field.fieldinsurance_id}>
                                {field.fieldinsurance_fa}
                            </option>
                        ))}
                    </select>
                </div>

                {/* User Mobile */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره همراه کاربر
                    </Label>
                    <Input
                        type="tel"
                        pattern="09[0-9]{9}"
                        value={userMobile}
                        onChange={(e) => setUserMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="09123456789"
                    />
                </div>

                {/* Order Number */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره سفارش
                    </Label>
                    <Input
                        type="number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="شماره سفارش"
                    />
                </div>

                {/* Field document number Select */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره سند
                    </Label>
                    <select
                        value={selectedDocument}
                        onChange={(e) => setSelectedDocument(e.target.value)}
                        className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 
                        text-sm shadow-theme-xs placeholder:text-gray-400 
                        focus:border-brand-300 focus:outline-hidden focus:ring-3 
                        focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 
                        dark:text-white/90 dark:placeholder:text-white/30 
                        dark:focus:border-brand-800 ${
                            selectedDocument
                                ? "text-gray-800 dark:text-white/90"
                                : "text-gray-400 dark:text-gray-400"
                        }`}
                        disabled={loadingFields}
                    >
                        <option value="">همه سند ها</option>
                        {loadingFields && <option>در حال دریافت...</option>}
                        {documents.map((field) => (
                            <option key={field.document_id} value={field.document_id}>
                                {field.document_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <Button
                        size={"sm"}
                        onClick={handleFilter}
                    >
                        اعمال فیلتر
                    </Button>
                </div>
            </div>


        </div>
    );
}
