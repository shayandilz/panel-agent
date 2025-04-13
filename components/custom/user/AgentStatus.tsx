"use client";
import React from "react";
import {useEffect, useState} from 'react';
import {useAgent} from "@/context/AgentContext";
import {toast} from "react-toastify";
import services from "@/core/service"
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import DateRangeFilterComponent from "@/components/custom/filters/DateRangeFilterComponent";
import Badge from "@/components/ui/badge/Badge";

export default function AgentStatus() {
    const [agentStatus, setAgentStatus] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const calculateTimestamp = (timestamp) => {
        return (timestamp ? new Date(Number(timestamp) * 1000) : 'نا مشخص').toLocaleString()
    }
    const fetchAgentStatus = async (filters = null) => {
        try {
            setIsLoading(true);

            const query = filters?.start_date ? `&start_date=${filters?.start_date}&end_date=${filters?.end_date}` : "";
            const response = await services.General.getData(`?command=get_statusinfo${query}`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setAgentStatus(data.data || []);
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error(err || "مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentStatus();
    }, []);

    return (
        <>
            <DateRangeFilterComponent onFilterApply={(filters) => fetchAgentStatus(filters)}/>
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
                        {agentStatus.length > 0 ? (agentStatus.map((data) => (
                                <TableRow className="text-center" key={data.agent_status_timstamp}>
                                    <TableCell>{data.agent_status == '0' ? (
                                        <Badge size='lg' variant="light" color="primary">
                                            Offline
                                        </Badge>) : (<Badge size='md' variant="solid" color="success">
                                        Online
                                    </Badge>)}</TableCell>
                                    {data.agent_status_timstamp && (
                                        <TableCell>{(calculateTimestamp(data.agent_status_timstamp))}</TableCell>)}
                                </TableRow>
                            )))
                            : (
                                <TableRow key="noRecord">
                                    <TableCell className="text-center px-5 py-4 sm:px-6">
                                          <span
                                              className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
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
