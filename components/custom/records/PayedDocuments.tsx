"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../ui/table";
import services from "@/core/service";
import {toast} from "react-toastify";

interface PayedDocument {
    id: number;
    documentName: string;
    paymentDate: string;
    amount: number;
}

export default function PayedDocuments() {
    const [payedDocuments, setPayedDocuments] = useState<PayedDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayedDocuments = async () => {
            try {
                setIsLoading(true);
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
                toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayedDocuments();
    }, []);

    return (isLoading ? (
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
                    {payedDocuments.length > 0 && payedDocuments.map((document) => (
                        <TableRow key={document.id}>
                            <TableCell>{document.id}</TableCell>
                            <TableCell>{document.paymentDate}</TableCell>
                            <TableCell>{document.documentName}</TableCell>
                            <TableCell>{document.amount}</TableCell>
                            <TableCell>{document.amount}</TableCell>
                            <TableCell>{document.amount}</TableCell>
                            <TableCell>{document.amount}</TableCell>
                        </TableRow>
                    ))}
                    {payedDocuments.length == 0 && (
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
        )
    );
}
