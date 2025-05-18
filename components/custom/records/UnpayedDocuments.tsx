"use client"
import React, {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import services from "@/core/service";
import {toast} from "react-toastify";
import DocumentFilterComponent from "@/components/custom/filters/DocumentFilterComponent";

interface UnpayedDocument {
    "request_financial_doc_id": string,
    "request_financial_doc_num": string,
    "request_financial_doc_price": string,
    "request_financial_doc_numdoc": string,
    "request_financial_doc_date": string,
    // "request_financial_doc": string,
    "request_financial_doc_peydate": string,
    "request_financial_doc_code": string,
    "request_financial_doc_employee_id": string,
    "employee_name": string,
    "employee_family": string,
    "employee_mobile": string,
    "request_financial_doc_pey_employee_id": string,
    "pey_employee_name": string,
    "pey_employee_family": string,
    "pey_employee_mobile": string,
    "agent_id": string,
    "agent_name": string,
    "agent_family": string,
    "agent_mobile": string,
    "agent_banknum": string,
    "agent_bankname": string,
    "agent_banksheba": string,
}

interface Filters {
    request_financial_doc_id?: string;
}

interface ResponseData {
    result: string;
    data: UnpayedDocument[] | null;
    desc?: string;
}

export default function UnpayedDocuments() {
   const [unpayedDocuments, setUnpayedDocuments] = useState<UnpayedDocument[]>([]);
    const [filteredData, setFilteredData] = useState<UnpayedDocument[]>(unpayedDocuments);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnpayedDocuments = async () => {
        try {
            setIsLoading(true);

            const response = await services.Requests.getReport("?command=get_doc&mode=doc_paying");
            if (response) {
                const data = response.data;
                if (data.result != 'ok') {
                    throw new Error(data.desc);
                }

                if (data.data) setUnpayedDocuments(data?.data)
                else setUnpayedDocuments([])
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnpayedDocuments();
    }, []);

    const applyFilters = (filters: Filters = {}) => {
        let filtered = unpayedDocuments.filter((item) => {
            // Corrected the filtering logic
            if (filters.request_financial_doc_id && !item.request_financial_doc_id.includes(filters.request_financial_doc_id)) return false;
            return true;
        });

        setFilteredData(filtered);
    };
    useEffect(() => {
        applyFilters(); // Apply filters when filters are changed
    }, [unpayedDocuments]); // Apply effect when filters or requestData changes


    return (
        <>
            <DocumentFilterComponent onFilterApply={(filters:Filters) => applyFilters(filters)} />
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>شماره سند</TableCell>
                            <TableCell isHeader>نام نماینده</TableCell>
                            {/*<TableCell isHeader>کارمند صادر کننده سند</TableCell>*/}
                            <TableCell isHeader>مبلغ سند</TableCell>
                            <TableCell isHeader>بانک صادر کننده سند</TableCell>
                            <TableCell isHeader>شماره شبا بانک</TableCell>
                            {/*<TableCell isHeader>تاریخ پرداخت</TableCell>*/}
                            <TableCell isHeader>تاریخ صدور سند</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (filteredData.map((document, index) => (
                            <TableRow key={document?.request_financial_doc_id}>
                                <TableCell>{document?.request_financial_doc_num}</TableCell>
                                <TableCell>{document?.agent_name} {document?.agent_family}</TableCell>
                                {/*<TableCell>{document?.pey_employee_name} {document?.pey_employee_family}</TableCell>*/}
                                <TableCell>{Number(document?.request_financial_doc_price).toLocaleString()}</TableCell>
                                <TableCell>{document?.agent_bankname}</TableCell>
                                <TableCell>{document?.agent_banksheba}</TableCell>
                                {/*<TableCell>{document?.request_financial_doc_peydate}</TableCell>*/}
                                <TableCell>{document?.request_financial_doc_date}</TableCell>

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
