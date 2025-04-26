"use client";

import React, {useState, useEffect} from "react";
import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";
// import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

import {toast} from "react-toastify";
import services from "@/core/service";

interface FilterProps {
    onFilterApply: (filters: {
        documentNum: string ;
    }) => void;
}

interface DocumentData {
    document_id: string;
    document_number: string;
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
                setDocuments(response.data.data);
            }
        } catch (err) {
            toast.error("خطا در دریافت لیست شماره سند ها");
        } finally {
            setLoadingFields(false);
        }
    };

    useEffect(() => {
        fetchDocumentsNumber();
    }, []);

    const handleFilter = () => {
        onFilterApply({
            documentNum: selectedDocument
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
                    <select
                        value={selectedDocument}
                        onChange={(e) => setSelectedDocument(e.target.value)}
                        className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 
                        text-sm shadow-theme-xs placeholder:text-gray-400 
                        focus:border-brand-300 focus:outline-hidden focus:ring-3 
                        focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 
                        dark:text-white/90 dark:placeholder:text-white/60 
                        dark:focus:border-brand-800 ${
                            selectedDocument
                                ? "text-gray-800 dark:text-white/90"
                                : "text-gray-400 dark:text-gray-400"
                        }`}
                        disabled={loadingFields}
                    >
                        <option value="">همه سند ها</option>
                        {loadingFields && <option>در حال دریافت...</option>}
                        {documents.map((field) => (
                            <option key={field.document_id} value={field.document_id}>
                                {field.document_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <Button
                        size={"sm"}
                        onClick={handleFilter}
                    >
                        اعمال فیلتر
                    </Button>
                </div>
            </div>
        </div>
    );
}
