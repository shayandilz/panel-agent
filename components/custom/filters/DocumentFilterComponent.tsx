"use client";

import React, {useState, useEffect} from "react";
import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";
// import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

import {toast} from "react-toastify";
import services from "@/core/service";
import Select from "@/components/form/Select";

interface FilterProps {
    onFilterApply: (filters: {
        request_financial_doc_id: string ;
    }) => void;
}

interface DocumentData {
    value: string;
    label: string;
}

export default function DocumentFilterComponent({onFilterApply}: FilterProps) {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [loadingFields, setLoadingFields] = useState(true);

    const fetchDocumentsNumber = async () => {
        try {
            const response = await services.Requests.getReport(
                "?command=get_doc"
            );
            if (response?.data?.result === "ok") {
                let data = response?.data?.data

                setDocuments(data.map((field) => ({
                    value: field?.request_financial_doc_id,
                    label: field?.request_financial_doc_num
                })));
            }
        } catch (err) {
            toast.error("خطا در دریافت لیست شماره سند ها");
            setDocuments([])
        } finally {
            setLoadingFields(false);
        }
    };

    useEffect(() => {
        fetchDocumentsNumber();
    }, []);

    const handleFilter = (selectedDocument) => {
        onFilterApply({
            request_financial_doc_id: selectedDocument
        });
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="grid align-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Field document number Select */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره سند
                    </Label>
                    <Select
                        options={documents}
                        onChange={(value) => handleFilter(value)}
                        disabled={loadingFields}
                        placeholder={loadingFields ? "در حال دریافت..." : "همه سند ها"}
                    >
                    </Select>
                </div>

                {/*<div className="flex items-end">*/}
                {/*    <Button*/}
                {/*        size={"sm"}*/}
                {/*        onClick={handleFilter}*/}
                {/*    >*/}
                {/*        اعمال فیلتر*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
