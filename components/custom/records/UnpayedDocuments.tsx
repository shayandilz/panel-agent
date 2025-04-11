"use client"

import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../ui/table";
import services from "@/core/service";
import {toast} from "react-toastify";
import DocumentFilterComponent from "@/components/custom/filters/DocumentFilterComponent";

interface UnpayedDocument {
    id: number;
    documentName: string;
    dueDate: string;
    amount: number;
}

export default function UnpayedDocuments() {
    const [UnpayedDocuments, setUnpayedDocuments] = useState<UnpayedDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchUnpayedDocuments = async (filters = null) => {
        try {
            setIsLoading(true);
            const queryParams = {
                document_num: filters?.document_num
            };
            const response = await services.Requests.getReport("?command=get_doc&mode=doc_paying");
            if (response) {
                const data = response.data;
                console.log('get_doc doc_paying', data)
                if (data.result != 'ok') {
                    throw new Error(data.desc);
                }

                if (data.data) setUnpayedDocuments(data.data)
                else setUnpayedDocuments([])
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnpayedDocuments();
    }, []);

    return (
        <>
            <DocumentFilterComponent onFilterApply={(filters) => fetchUnpayedDocuments(filters)}/>
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>آیدی سند</TableCell>
                            <TableCell isHeader>شماره سند</TableCell>
                            <TableCell isHeader>مبلغ سند</TableCell>
                            <TableCell isHeader>تاریخ صدور سند</TableCell>
                            <TableCell isHeader>تعداد درخواست های سند</TableCell>
                            <TableCell isHeader>نام نماینده</TableCell>
                            <TableCell isHeader>کارمند صادر کننده سند</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {UnpayedDocuments.length > 0 ? (UnpayedDocuments.map((document) => (
                            <TableRow key={document.id}>
                                <TableCell>{document.id}</TableCell>
                                <TableCell>{document.paymentDate}</TableCell>
                                <TableCell>{document.documentName}</TableCell>
                                <TableCell>{document.amount}</TableCell>
                                <TableCell>{document.amount}</TableCell>
                                <TableCell>{document.amount}</TableCell>
                                <TableCell>{document.amount}</TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
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