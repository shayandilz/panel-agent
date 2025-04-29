"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import services from "@/core/service";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import DateRangeFilterComponent from "@/components/custom/filters/DateRangeFilterComponent";
import Badge from "@/components/ui/badge/Badge";

// Define types for the agent status and the response structure
interface AgentStatus {
    agent_status: string; // Assuming this is '0' for offline and '1' for online
    agent_status_timstamp: string; // Assuming this is a timestamp in string format
}

interface Filters {
    startDate: string;
    endDate: string;
}

interface ApiResponse {
    result: string;
    data: AgentStatus[] | null;
    desc?: string;
}

export default function AgentStatus() {
    const [agentStatus, setAgentStatus] = useState<AgentStatus[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Calculate timestamp function
    const calculateTimestamp = (timestamp: string): string => {
        return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'نا مشخص';
    }

    // Fetch agent status data
    const fetchAgentStatus = async (filters: Filters | null = null): Promise<void> => {
        try {
            setIsLoading(true);
            const query = filters?.startDate ? `&start_date=${filters.startDate}&end_date=${filters.endDate}` : "";
            // @ts-ignore
            const response = await services.General.getData<ApiResponse>(`?command=get_statusinfo${query}`);

            if (response && response.data) {
                if (response.data.result !== "ok") {
                    throw new Error(response.data.desc || "مشکلی پیش آمد.");
                }
                setAgentStatus(response.data.data || []);
            } else {
                toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        } catch (err: any) {
            toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            setError(err.message || "مشکلی پیش آمد.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentStatus();
    }, []);

    return (
        <>
            <DateRangeFilterComponent onFilterApply={(filters) => fetchAgentStatus(filters)} />
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>وضعیت</TableCell>
                            <TableCell isHeader>تاریخ</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agentStatus.length > 0 ? (
                            agentStatus.map((data, index) => (
                                <TableRow className="text-center" key={index}>
                                    <TableCell>
                                        {data.agent_status === '0' ? (
                                            <Badge variant="light" color="primary">
                                                Offline
                                            </Badge>
                                        ) : (
                                            <Badge size='md' variant="solid" color="success">
                                                Online
                                            </Badge>
                                        )}
                                    </TableCell>
                                    {data.agent_status_timstamp && (
                                        <TableCell>{calculateTimestamp(data.agent_status_timstamp)}</TableCell>
                                    )}
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
