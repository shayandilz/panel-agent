"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import services from "@/core/service";
import {toast} from "react-toastify";
import DocumentFilterComponent from "@/components/custom/filters/DocumentFilterComponent";

interface PayedDocument {
    id: number;
    documentName: string;
    paymentDate: string;
    amount: number;
}

interface Filters {
    documentNum?: string;
}

interface ResponseData {
    result: string;
    data: PayedDocument[] | null;
    desc?: string;
}

export default function PayedDocuments() {
    const [payedDocuments, setPayedDocuments] = useState<PayedDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayedDocuments = async (filters: Filters = {}) => {
        try {
            setIsLoading(true);
            console.log('filters',filters)

            const response = await services.Requests.getReport("?command=get_doc&mode=doc_payed");
            if (response) {
                const data = response.data;
                console.log('get_doc doc_paying', data)
                if (data.result != 'ok') {
                    throw new Error(data.desc);
                }

                if (data.data) setPayedDocuments(data.data)
                else setPayedDocuments([])
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayedDocuments();
    }, []);

    return (
        <>
            <DocumentFilterComponent onFilterApply={(filters) => fetchPayedDocuments(filters)} />
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
                        {payedDocuments.length > 0 ? (payedDocuments.map((document, index) => (
                            <TableRow key={document.id || index}>
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
