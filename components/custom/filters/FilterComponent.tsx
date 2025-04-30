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
import Button from "@/components/ui/button/Button";

interface FilterProps {
    onFilterApply: (filters: {
        staterequest_last_timestamp?: string;
        document_number?: string;
        request_last_state_id?: string;
        request_organ?: string;
        fieldinsurance_id?: string;
        user_mobile?: string;
        request_id?: string;
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
        // Update filtersObject without calling onFilterApply immediately during render
        setFiltersObject((prevFilters: any) => ({
            ...prevFilters,
            ...newFilter,
        }));
    };

// Use useEffect to call onFilterApply after filtersObject has been updated
    useEffect(() => {
        onFilterApply(filtersObject);
    }, [filtersObject]); // Call onFilterApply whenever filtersObject changes

    return (
        <div className="mb-6 space-y-4">
            <div className="grid align-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {filterType == 'all' && (
                    <>
                        {/* Start Date */}
                        {/*<div>*/}
                        {/*    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">*/}
                        {/*        تاریخ شروع*/}
                        {/*    </Label>*/}
                        {/*    <DatePicker*/}
                        {/*        value={filtersObject?.startDate}*/}
                        {/*        calendar={persian}*/}
                        {/*        locale={persian_fa}*/}
                        {/*        format="YYYY/MM/DD"*/}
                        {/*        onChange={value => handleFilter({startDate: value?.unix})}*/}
                        {/*        containerClassName="block w-full"*/}
                        {/*        inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800"*/}
                        {/*    />*/}
                        {/*    /!*plugins={[persian()]}*!/*/}
                        {/*</div>*/}

                        {/* End Date */}
                        <div>
                            <Label htmlFor="endDate"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاریخ پایان
                            </Label>
                            <DatePicker
                                value={filtersObject?.staterequest_last_timestamp}
                                name='endDate'
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY/MM/DD"
                                onChange={value => handleFilter({staterequest_last_timestamp: value?.unix})}
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
                                    defaultValue={filtersObject.document_id}
                                    options={documents}
                                    onChange={(value) => handleFilter({document_id: value})}
                                    placeholder="همه سند ها"
                                >
                                </Select> : <Input defaultValue={filtersObject.document_number}
                                    type="number"
                                    onChange={(e) => handleFilter({document_number: e.target.value})}
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
                                defaultValue={filtersObject.request_last_state_id}
                                options={requestStates}
                                onChange={(value) => handleFilter({request_last_state_id: value})}
                                placeholder="همه" className={'!pr-3'}
                            >
                            </Select>
                        </div>

                        {/* Field states Select */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                انتخاب ارگان
                            </Label>
                            <Select
                                defaultValue={filtersObject.request_organ}
                                options={requestOrgans}
                                onChange={(value) => handleFilter({request_organ: value})}
                                placeholder="همه ارگان ها"
                                className={'!pr-3'}
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
                        defaultValue={filtersObject.fieldinsurance_id}
                        options={fieldInsurances}
                        onChange={(value) => handleFilter({fieldinsurance_id: value})}
                        placeholder="همه"
                        className={'!pr-3'}
                    >
                    </Select>
                </div>

                {/* User Mobile */}
                <div>
                    <Label htmlFor="user_mobile"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره موبایل
                    </Label>
                    <Input
                        defaultValue={filtersObject.user_mobile}
                        id="user_mobile"
                        type="tel"
                        pattern="09[0-9]{9}"
                        onChange={(e) => handleFilter({user_mobile: e.target.value.replace(/[^0-9]/g, '')})}
                        placeholder="09123456789"
                        className={'!pr-3'}
                    />
                </div>

                {/* Order Number */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره سفارش
                    </Label>
                    <Input
                        defaultValue={filtersObject.request_id}
                        type="number"
                        onChange={(e) => handleFilter({request_id: e.target.value})}
                        placeholder="شماره سفارش"
                    />
                </div>
            </div>
            <Button variant="outline" onClick={()=> {
                setFiltersObject({});
                onFilterApply({});
            }}>حذف فیلترها</Button>

        </div>
    );
}
