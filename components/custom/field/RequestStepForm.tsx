import React, {useEffect, useState} from "react";
import ImageUploader from "@/components/custom/field/ImageUploader";
import {ImageListType} from "react-images-uploading";
import services from "@/core/service";
import Select from "@/components/form/Select";
import Textarea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import DatePicker from "react-multi-date-picker";
import Input from "@/components/form/input/InputField";

export default function RequestStepForm({stepFields, onSubmit}) {
    const [form, setForm] = useState<{ [key: string]: any }>({});
    const [images, setImages] = useState<ImageListType>([]);
    const [optionsList, setOptionsList] = useState<{ [key: string]: Array<{ value: any, label: string }> }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize options list with empty arrays
    useEffect(() => {
        const initialOptions = stepFields.reduce((acc, field) => {
            if (field.command) {
                acc[field.command] = [];
            }
            return acc;
        }, {});
        setOptionsList(initialOptions);

        // Fetch initial data for independent commands
        stepFields.forEach(async (field) => {
            if (field.command && !field.dependsOn) {
                await getOptions(field.command);
            }
        });
    }, []);

    async function getOptions(command: string, query: string = '') {
        try {
            const response = await services.Fields.fetchList(`${getValueIp(command)}?command=${command}${query}`);
            if (response?.data?.result === "ok") {
                const valueName = getValueFieldName(command);
                const labelName = getLabelFieldName(command);

                const modes = response.data.data.reduce((acc, mode) => {
                    if (!acc.some(item => item.value === mode[valueName])) {
                        acc.push({
                            value: mode[valueName],
                            label: mode[labelName]
                        });
                    }
                    return acc;
                }, []);

                setOptionsList(prev => ({
                    ...prev,
                    [command]: modes
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${command}:`, error);
            setOptionsList(prev => ({
                ...prev,
                [command]: []
            }));
        }
    }

    const getValueIp = (command: string) => {
        const fieldMap = {
            'get_organ': 'organ',
            'get_clearingmode': 'statecity',
            'get_state': 'statecity',
            'get_city': 'statecity'
        };
        return fieldMap[command] || 'agentrequestreport';
    };

    const getValueFieldName = (command: string) => {
        const fieldMap = {
            'get_organ': 'organ_id',
            'get_clearingmode': 'request_ready_clearing_mode_id',
            'get_mode_delivery': 'delivery_mode_id',
            'get_state': 'state_id',
            'get_city': 'city_id'
        };
        return fieldMap[command] || 'value';
    };

    const getLabelFieldName = (command: string) => {
        const fieldMap = {
            'get_organ': 'organ_name',
            'get_clearingmode': 'request_ready_clearing_mode_name',
            'get_mode_delivery': 'delivery_mode_name',
            'get_state': 'state_name',
            'get_city': 'city_name'
        };
        return fieldMap[command] || 'label';
    };

    const handleSelectChange = async (name: string, value: any) => {
        // Handle dependent fields
        const fieldConfig = stepFields.find(f => f.name === name);
        if (fieldConfig?.triggers) {
            await getOptions(fieldConfig.triggers, `&${fieldConfig.triggerParam}=${value}`);
        }

        setForm(prev => ({...prev, [name]: value}));
    };

    const handleChange = (name: string, value: any) => {
        setForm(prev => ({...prev, [name]: value}));
    };


    const handleImagesChange = (imageList: ImageListType, name) => {
        setImages(imageList);
        setForm(prev => ({
            ...prev,
            [name]: imageList[0] ? imageList[0]?.image_code || null : null
        }));
        console.log('handleImagesChange', images, form)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(form);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                {stepFields.map(field => {
                    if (field.type === "image") {
                        return (
                            <div key={field.name} className="mb-4 col-span-2">
                                <label className="block mb-2 text-sm font-medium">
                                    {field.label}
                                </label>
                                <ImageUploader
                                    name={field.name}
                                    onChange={(e) => handleImagesChange(e, field.name)}
                                    value={images}
                                    maxNumber={field.maxNumber || 1}
                                />
                            </div>
                        );
                    }

                    if (field.type === "date") {
                        return (
                            <div key={field.name} className="mb-4">
                                <label className="block mb-2 text-sm font-medium">
                                    {field.label}
                                </label>
                                <DatePicker
                                    value={form[field.name] || ""}
                                    disabled={isSubmitting}
                                    required={field.required}
                                    calendars="['persian']"
                                    locales="['fa']"
                                    format="YYYY/MM/DD"
                                    onChange={value => handleChange(field.name, value)}
                                    containerClassName="block w-full"
                                    inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/60 dark:focus:border-brand-800  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                                />
                            </div>
                        );
                    }

                    if (field.type === "textarea") {
                        return (
                            <div key={field.name} className="mb-4 col-span-2 order-3">
                                <label className="block mb-2 text-sm font-medium">
                                    {field.label}
                                </label>
                                <Textarea
                                    disabled={isSubmitting}
                                    value={form[field.name] || ""}
                                    onChange={value => handleChange(field.name, value)}
                                    required={field.required}
                                />
                            </div>
                        );
                    }

                    if (field.type === "select") {
                        return (
                            <div key={field.name} className="mb-4">
                                <label className="block mb-2 text-sm font-medium">
                                    {field.label}
                                </label>
                                <Select
                                    disabled={isSubmitting || !optionsList[field.command]?.length}
                                    options={optionsList[field.command] || []}
                                    onChange={(val) => handleSelectChange(field.name, val)}
                                    value={form[field.name]}
                                    loading={!optionsList[field.command]}
                                    required={field.required}
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={field.name} className="mb-4">
                            <label className="block mb-2 text-sm font-medium">
                                {field.label}
                            </label>
                            <Input
                                type={field.type}
                                disabled={isSubmitting}
                                value={form[field.name] || ""}
                                onChange={e => handleChange(field.name, e.target.value)}
                                required={field.required}
                            />
                        </div>
                    );
                })}
            </div>

            <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full justify-center"
            >
                ارسال
            </Button>
        </form>
    );
}
