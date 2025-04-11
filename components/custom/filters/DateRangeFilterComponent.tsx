"use client";

import React, {useState, useEffect} from "react";
import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";
// import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import DatePicker from "react-multi-date-picker";

interface FilterProps {
    onFilterApply: (filters: {
        startDate: string;
        endDate: string;
    }) => void;
}

export default function DateRangeFilterComponent({onFilterApply}: FilterProps) {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        onFilterApply({
            startDate: startDate,
            endDate: endDate
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
