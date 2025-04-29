"use client";

import React, {useEffect, useState} from "react";
import DatePicker from "react-multi-date-picker";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import {toast} from "react-toastify";
import services from "@/core/service";
import Select from "@/components/form/Select";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa";

interface FilterProps {
    onFilterApply: (filters: {
        startDate?: number;
        endDate?: number;
        documentNum?: string;
        requestState?: string;
        requestOrgan?: string;
        fieldInsurance?: string;
        userMobile?: string;
        orderNumber?: string;
    }) => void;
    filterType: "all" | "requests";
}

interface Document {
    value: string;
    label: string;
}

interface RequestOrgan {
    value: string;
    label: string;
}

interface RequestContract {
    value: string;
    label: string;
}

interface RequestState {
    value: string;
    label: string;
}

interface FieldInsurance {
    value: string;
    label: string;
}

export default function FilterComponent({filterType, onFilterApply}: FilterProps) {
    const [fieldInsurances, setFieldInsurances] = useState<FieldInsurance[]>([]);
    const [requestOrgans, setRequestOrgans] = useState<RequestOrgan[]>([]);
    const [requestContracts, setRequestContracts] = useState<RequestContract[]>([]);
    const [requestStates, setRequestStates] = useState<RequestState[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingFields, setLoadingFields] = useState(true);
    const [filtersObject, setFiltersObject] = useState<any>({});

    useEffect(() => {
        const fetchDocumentsNumber = async () => {
            try {
                const response = await services.Requests.getReport("?command=get_doc");
                if (response?.data?.result === "ok") {
                    const docs = response.data?.data.map((doc: any) => ({
                        value: doc.document_id,
                        label: doc.document_number,
                    }));
                    setDocuments(docs);
                } else setDocuments([]);
            } catch (err) {
                toast.error("خطا در دریافت لیست شماره سند ها");
            } finally {
                setLoadingFields(false);
            }
        };

        const fetchFieldOrgans = async () => {
            try {
                const response = await services.Requests.getOrgan("?command=get_organ");
                if (response?.data?.result === "ok") {
                    const organs = response.data?.data.map((field: any) => ({
                        value: field.organ_id,
                        label: field.organ_name + "(" + field.organ_address + ")",
                    }));
                    setRequestOrgans(organs);
                } else setRequestOrgans([]);
            } catch (err) {
                toast.error("خطا در دریافت لیست ارگان ها");
            } finally {
                setLoadingFields(false);
            }
        };
        const fetchFieldContracts = async () => {
            try {
                const response = await services.Requests.getOrgan("?command=get_contract");
                if (response?.data?.result === "ok") {
                    const contracts = response.data?.data.map((field: any) => ({
                        value: field.organ_contract_num,
                        label: field.organ_name,
                    }));
                    setRequestContracts(contracts);
                } else setRequestContracts([]);
            } catch (err) {
                toast.error("خطا در دریافت لیست قرارداد ها");
            } finally {
                setLoadingFields(false);
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
                } else setFieldInsurances([]);
            } catch (err) {
                toast.error("خطا در دریافت لیست رشته های بیمه");
            } finally {
                setLoadingFields(false);
            }
        };

        const fetchRequestStates = async () => {
            try {
                const response = await services.Requests.getReport("?command=getstaterequest");
                if (response?.data?.result === "ok") {
                    const states = response?.data?.data.map((stat: any) => ({
                        value: stat?.request_state_id,
                        label: stat?.request_state_name,
                    }));
                    setRequestStates(states);
                } else {
                    throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
                }
            } catch (err: any) {
                setRequestStates([]);
                console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        };

        fetchFieldInsurances();
        if (filterType == 'all') fetchDocumentsNumber();
        if (filterType == 'requests') {
            fetchRequestStates();
            fetchFieldOrgans()
            fetchFieldContracts()
        }
    }, []);

    const handleFilter = (newFilter: any) => {
        setFiltersObject({
            ...filtersObject,
            ...newFilter,
        });
        onFilterApply(filtersObject);
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="grid align-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {filterType == 'all' && (
                    <>
                        {/* Start Date */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاریخ شروع
                            </Label>
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY/MM/DD"
                                onChange={value => handleFilter({startDate: value?.unix})}
                                containerClassName="block w-full"
                                inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800"
                            />
                            {/*plugins={[persian()]}*/}
                        </div>

                        {/* End Date */}
                        <div>
                            <Label htmlFor="endDate"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاریخ پایان
                            </Label>
                            <DatePicker
                                name='endDate'
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY/MM/DD"
                                onChange={value => handleFilter({endDate: value?.unix})}
                                containerClassName="block w-full"
                                inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                شماره سند
                            </Label>
                            {documents.length > 0 ?
                                <Select
                                    options={documents}
                                    onChange={(value) => handleFilter({documentNum: value})}
                                    placeholder="همه سند ها"
                                >
                                </Select> : <Input
                                    type="number"
                                    onChange={(e) => handleFilter({documentNum: e.target.value})}
                                    placeholder="همه سند ها"/>}
                        </div>
                    </>
                )}
                {filterType == 'requests' && (
                    <>
                        {/* Field states Select */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                انتخاب وضعیت
                            </Label>
                            <Select
                                options={requestStates}
                                onChange={(value) => handleFilter({requestState: value})}
                                placeholder="همه"
                            >
                            </Select>
                        </div>

                        {/* Field states Select */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                انتخاب ارگان
                            </Label>
                            <Select
                                options={requestOrgans}
                                onChange={(value) => handleFilter({requestOrgan: value})}
                                placeholder="همه ارگان ها"
                            >
                            </Select>
                        </div>
                    </>
                )}

                {/* Field Insurance Select */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        انتخاب رشته بیمه
                    </Label>
                    <Select
                        options={fieldInsurances}
                        onChange={(value) => handleFilter({fieldInsurance: value})}
                        placeholder="همه"
                    >
                    </Select>
                </div>

                {/* User Mobile */}
                <div>
                    <Label htmlFor="userMobile"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره موبایل
                    </Label>
                    <Input
                        id="userMobile"
                        type="tel"
                        pattern="09[0-9]{9}"
                        onChange={(e) => handleFilter({userMobile: e.target.value.replace(/[^0-9]/g, '')})}
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
                        onChange={(e) => handleFilter({orderNumber: e.target.value})}
                        placeholder="شماره سفارش"
                    />
                </div>
            </div>


        </div>
    );
}
