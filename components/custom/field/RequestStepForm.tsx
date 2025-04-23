import React, {useEffect, useState} from "react";
import ImageUploader from "@/components/custom/field/ImageUploader";
import {ImageListType} from "react-images-uploading";
import services from "@/core/service";
import Select from "@/components/form/select";
import Textarea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import DatePicker from "react-multi-date-picker";

export default function RequestStepForm({stepFields, onSubmit}) {
    const [form, setForm] = useState<{ [key: string]: any }>({});
    const [images, setImages] = useState<ImageListType>([]);
    const [optionsList, setOptionsList] = useState<{ [key: string]: any }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function getOptions (command, query = '') {
        if (command) {
            try {
                const response = await services.Fields.fetchList('?command=' + command + query)
                if (response?.data?.result === "ok") {
                    let modes = []
                    let modesId = []
                    let valueName = 'value'
                    let labelName = 'label'

                    if (command == 'get_mode_delivery') {
                        valueName = 'delivery_mode_id'
                        labelName = 'delivery_mode_name'
                    }
                    if (command == 'get_state') {
                        valueName = 'state_id'
                        labelName = 'state_name'
                    }
                    if (command == 'get_city') {
                        valueName = 'city_id'
                        labelName = 'city_name'
                    }

                    await response?.data?.data.forEach(function (mode) {
                        if (modesId.indexOf(mode?.[valueName]) < 0) {
                            modesId.push(mode?.[valueName])
                            modes.push({
                                value: mode?.[valueName],
                                label: mode?.[labelName]
                            })
                        }
                    })
                    console.log(command, modes)
                    setOptionsList({
                        ...optionsList,
                        [command]: modes
                    });
                } else {
                    throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
                }
            } catch (err: any) {
                setOptionsList({
                    ...optionsList,
                    [command]: null
                });
                // console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        }
        // return optionsList[command]
    };

    useEffect(() => {
        stepFields.fields.forEach(field => {
            if(field?.command && field?.command != "get_city") getOptions(field.command)
            if(field?.command && field?.command == "get_city") setOptionsList({
                ...optionsList,
                "get_city": []
            });
        })
    }, [stepFields]);

    // Handle generic field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if(e.target.name == 'request_delivered_state_id') {
            setOptionsList({
                ...optionsList,
                "get_city": []
            });
            getOptions("get_city", '&state_id=' + e.target.value)
        }
        setForm({...form, [e.target.name]: e.target.value});
    };

    // Handle image changes
    const handleImagesChange = (imageList: ImageListType) => {
        setImages(imageList);
        setForm({...form, images: imageList}); // Add images to form object
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can now send `form` object, which includes all fields and images
        setIsSubmitting(true)
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            {stepFields.map(field => {
                if (field.type === "image") {
                    return (
                        <div key={field.name} className="mb-4">
                            <label className="block mb-2">{field.label}</label>
                            <ImageUploader name={field.name} value={images} onChange={handleImagesChange}
                                           maxNumber={field.maxNumber || 5}/>
                        </div>
                    );
                }
                if (field.type === "textarea") {
                    return (
                        <div key={field.name} className="mb-4">
                            <Textarea
                                placeholder={field.label}
                                disabled={isSubmitting}
                                name={field.name}
                                value={form[field.name] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    );
                }
                if (field.type === "select") {
                    console.log('select',field.command, optionsList[field.command])
                    getOptions(field.command)
                    return (
                        optionsList[field.command] != undefined && <div key={field.name} className="mb-4">
                            <Select
                                disabled={isSubmitting}
                                name={field.name}
                                options={optionsList[field.command]}
                                onChange={handleChange}
                                placeholder={field.label}
                                defaultValue={form[field.name] || ""}
                            >
                            </Select>
                        </div>
                    );
                }
                // Default to text input
                return (
                    <div key={field.name} className="mb-4">
                        <label className="block mb-2">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={form[field.name] || ""}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                );
            })}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">ارسال</button>
        </form>
    );
}
