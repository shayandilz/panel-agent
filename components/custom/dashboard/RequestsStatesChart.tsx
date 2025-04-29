"use client";

import React, { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import services from "@/core/service";
import { toast } from "react-toastify";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

// Define the Step type based on the properties you are using.
interface Step {
    request_state_id: string;
    request_state_name: string;
    step_count?: number;
    step_percent?: number;
}

// Define the Props type to type `allRequests` parameter.
interface Props {
    allRequests: Array<{ request_last_state_id: string }>;
}

export default function RequestsTypesChart({ allRequests = [] }: Props) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState<number>(5);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stepsData, setStepsData] = useState<Step[]>([]);

    function showAll() {
        router.push("/requests/all");
    }

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    // Update the `findCount` function to have the correct types.
    function findCount(obj: Step): Step {
        if (!obj?.request_state_id) return { ...obj, step_count: 0, step_percent: 0 };
        let count = 0;
        for (const step of allRequests) {
            if (step.request_last_state_id === obj?.request_state_id) count++;
        }
        return {
            ...obj,
            step_count: count,
            step_percent: (count / allRequests.length) * 100,
        };
    }

    useEffect(() => {
        const fetchStepsData = async () => {
            setIsLoading(true);
            try {
                const res = await services.Fields.steps();
                if (res) {
                    let data = res.data;

                    if (data.result !== "ok") {
                        toast.error(data.desc);
                        return;
                    }

                    if (data.data !== "") {
                        let newData = data.data
                            .map((step: Step) => findCount(step))
                            .sort((a: { step_count: any; }, b: { step_count: any; }) => (b.step_count ?? 0) - (a.step_count ?? 0)); // Handle undefined values
                        setStepsData(newData);
                    } else setStepsData([]);
                } else {
                    toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
                }
            } catch (err) {
                toast.error( "مشکلی پیش آمد. دوباره تلاش کنید.");
            } finally {
                setIsLoading(false);
                if (stepsData.length === 0) setError("دیتایی برای نمایش وجود ندارد");
            }
        };

        fetchStepsData();
    }, [allRequests]);

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex justify-between border-bottom mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">سفارشات</h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            تعداد سفارشات بر اساس مرحله
                        </p>
                    </div>

                    <div className="relative inline-block">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                            <DropdownItem
                                onClick={showAll}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                مشاهده همه
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                <hr />
                {(error && !isLoading) && <div className="text-center">{error}</div>}
                {(!error && isLoading) ? (
                    <div className="text-center">در حال دریافت اطلاعات...</div>
                ) : (
                    !error && (
                        <div className="space-y-5">
                            {!stepsData.length && <div className="text-center">رکوردی وجود ندارد</div>}
                            {stepsData.length > 1 &&
                                stepsData.map((step, index) => (
                                    <div key={step.request_state_id} className={`${index >= visibleCount ? "hidden" : "flex"} items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="text-gray-800 text-theme-sm dark:text-white/90">{step?.request_state_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex w-full max-w-[140px] items-center gap-3">
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                <b>{step?.step_count || 0}</b>
                                            </p>
                                            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                                <div
                                                    style={{ width: `${step?.step_percent}%` }}
                                                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-orange-400 text-xs font-medium text-white"
                                                ></div>
                                            </div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {(step?.step_percent || 0) + "%"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )
                )}
                {stepsData.length > 5 && stepsData.length > visibleCount && (
                    <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        onClick={() => stepsData.length >= visibleCount + 10 ? setVisibleCount(visibleCount + 10) : setVisibleCount(stepsData.length)}
                    >
                        نمایش بیشتر
                    </Button>
                )}
                {stepsData.length > 5 && visibleCount >= stepsData.length && (
                    <Button className="w-full" size="sm" variant="outline" onClick={() => setVisibleCount(5)}>
                        نمایش کمتر
                    </Button>
                )}
            </div>
        </>
    );
}
