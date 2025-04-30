"use client";

import React, {useEffect, useState} from "react";
import {MoreDotIcon} from "@/icons";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";
import services from "@/core/service";
import {toast} from "react-toastify";
import Button from "@/components/ui/button/Button";
import {useRouter} from "next/navigation";

interface Insurance {
    fieldinsurance_id: string;
    fieldinsurance_fa: string;
    fieldinsurance_count?: number;
    fieldinsurance_percent?: number;
}

interface Props {
    allRequests: Array<{ fieldinsurance_id: string }>;
}

export default function RequestsTypesChart({allRequests}: Props) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState<number>(5);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [insurancesData, setInsurancesData] = useState<Insurance[]>([]);

    function showAll() {
        router.push('/requests/all');
    }

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    function findCount(obj: Insurance): Insurance {
        if (!obj?.fieldinsurance_id) return {...obj, fieldinsurance_count: 0, fieldinsurance_percent: 0};
        let count = 0;
        for (const Req of allRequests) {
            if (Req.fieldinsurance_id === obj?.fieldinsurance_id) count++;
        }
        return {
            ...obj,
            fieldinsurance_count: count,
            fieldinsurance_percent: (count / allRequests.length) * 100,
        };
    }

    useEffect(() => {
        const fetchInsurancesData = async () => {
            try {
                await services.Fields.insurances().then(
                    (res) => {
                        let data = res.data;

                        if (data.result !== 'ok') {
                            toast.error(data.desc);
                            return;
                        }

                        if (data.data) {
                            let newData = data.data.map((ins: Insurance) => findCount(ins)).sort((a: { fieldinsurance_count: any; }, b: { fieldinsurance_count: any; }) => b.fieldinsurance_count! - a.fieldinsurance_count!);
                            setInsurancesData(newData);
                            console.log(newData)
                        } else {
                            setInsurancesData([]);
                        }
                    }, () => {
                        toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
                    })
            } catch (err) {
                toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                // if (insurancesData.length === 0) setError('دیتایی برای نمایش وجود ندارد');
                setIsLoading(false);
            }
        };

        fetchInsurancesData();
    }, []);

    return (
        <>
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex justify-between border-bottom mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            همه درخواست ها
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            تعداد درخواست ها بر اساس نوع بیمه
                        </p>
                    </div>

                    <div className="relative inline-block">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"/>
                        </button>
                        <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                            <DropdownItem
                                onClick={showAll}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                بیشتر
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                <hr/>
                {(error && !isLoading) && <div className="text-center">{error}</div>}
                {isLoading ? (
                    <div className="text-center">در حال دریافت اطلاعات...</div>
                ) : !error ? (
                    <>
                        <div className="space-y-5 overflow-y-auto">
                            {!insurancesData.length && <div className="text-center">رکوردی وجود ندارد</div>}
                            {insurancesData.length > 0 && insurancesData.map((insurance, index) => (
                                <div key={insurance.fieldinsurance_id}
                                     className={`${index >= visibleCount ? 'hidden' : 'flex'} items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-gray-800 text-theme-sm dark:text-white/90">
                                                {insurance?.fieldinsurance_fa}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex w-full max-w-[140px] items-center gap-3">
                                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            <b>{insurance?.fieldinsurance_count || 0}</b>
                                        </p>
                                        <div
                                            className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                            <div style={{width: `${insurance?.fieldinsurance_percent}%`}}
                                                 className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-orange-400 text-xs font-medium text-white"></div>
                                        </div>
                                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {(insurance?.fieldinsurance_percent || 0) + '%'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {insurancesData.length > 5 && insurancesData.length >= visibleCount + 10 && (
                            <Button className="w-full" size="sm" variant="outline"
                                    onClick={() => setVisibleCount(visibleCount + 10)}>نمایش بیشتر</Button>
                        )}
                        {insurancesData.length > 5 && visibleCount >= insurancesData.length && (
                            <Button className="w-full" size="sm" variant="outline" onClick={() => setVisibleCount(5)}>نمایش
                                کمتر</Button>
                        )}
                    </>
                ) : null}
            </div>
        </>
    );
}
