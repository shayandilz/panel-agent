"use client";

import React, {useEffect, useState} from "react";
import {MoreDotIcon} from "@/icons";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";
import services from "@/core/service";
import {toast} from "react-toastify";
import Button from "@/components/ui/button/Button";
import {useRouter} from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";

interface Step {
    request_state_id: string;
    request_state_name: string;
    step_count: number;
    step_percent: number;
}

// Define the Props type to type `allRequests` parameter.
interface Props {
    allRequests: Array<{ request_last_state_id: string }>;
}

export default function RequestsTypesChart({allRequests}: Props) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stepsData, setStepsData] = useState<Step[]>([]);

    // Update the `findCount` function to have the correct types.
    function findCount(obj: Step): Step {
        if (!obj?.request_state_id) return {...obj, step_count: 0, step_percent: 0};
        let count = 0;
        for (const req of allRequests) {
            if (req.request_last_state_id == obj.request_state_id) count++;
        }
        return {
            ...obj,
            step_count: count,
            step_percent: Math.round((count / allRequests.length) * 100),
        };
    }

    useEffect(() => {
        const fetchStepsData = async () => {
            try {
                await services.Fields.steps().then(
                    (res) => {
                        let data = res.data;

                        if (data.result !== "ok") {
                            toast.error(data.desc);
                            return;
                        }

                        if (data.data) {
                            let newData = data.data
                                .map((step: Step) => findCount(step))
                                .sort((a: { step_count: any; }, b: { step_count: any; }) => (b.step_count ?? 0) - (a.step_count ?? 0)); // Handle undefined values
                            setStepsData(newData);
                        } else setStepsData([]);
                    }, () => {
                        toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
                    }
                );
            } catch (err) {
                toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
            } finally {
                setIsLoading(false);
                console.log(allRequests)
            }
        };

        fetchStepsData();
    }, [allRequests]);

    return (
        <>
            <ComponentCard showAll={"/requests/all"} title="همه سفارشات" desc={"تعداد سفارشات بر اساس مرحله"}>
                {(error && !isLoading) && <div className="text-center">{error}</div>}
                {(!error && isLoading) ? (
                    <div className="text-center">در حال دریافت اطلاعات...</div>
                ) : (
                    !error && (
                        <>
                            {!stepsData.length && <div className="text-center">رکوردی وجود ندارد</div>}
                            <div className="space-y-5 overflow-y-auto" style={{maxHeight: '190px'}}>

                                {stepsData.length > 0 &&
                                    stepsData.map((step, index) => (
                                        <div key={step.request_state_id}
                                             className={`flex items-center justify-between`}>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="text-gray-800 text-theme-sm dark:text-white/90">{step?.request_state_name}</p>
                                                </div>
                                            </div>

                                            <div className="flex w-full max-w-[140px] items-center gap-3">
                                                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    <b>{step?.step_count || 0}</b>
                                                </p>
                                                <div
                                                    className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                                    <div
                                                        style={{width: `${step?.step_percent}%`}}
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
                        </>
                    )
                )}
                {/*{stepsData.length > 5 && stepsData.length > visibleCount && (*/}
                {/*    <Button*/}
                {/*        className="w-full"*/}
                {/*        size="sm"*/}
                {/*        variant="outline"*/}
                {/*        onClick={() => stepsData.length >= visibleCount + 10 ? setVisibleCount(visibleCount + 10) : setVisibleCount(stepsData.length)}*/}
                {/*    >*/}
                {/*        نمایش بیشتر*/}
                {/*    </Button>*/}
                {/*)}*/}
                {/*{stepsData.length > 5 && visibleCount >= stepsData.length && (*/}
                {/*    <Button className="w-full" size="sm" variant="outline" onClick={() => setVisibleCount(5)}>*/}
                {/*        نمایش کمتر*/}
                {/*    </Button>*/}
                {/*)}*/}
            </ComponentCard>
        </>
    );
}
