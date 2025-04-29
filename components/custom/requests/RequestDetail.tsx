"use client";

import React, {useState, useEffect} from "react";
import {FileIcon, TaskIcon, DollarLineIcon, PieChartIcon, InfoIcon, PlusIcon} from "@/icons";
import {toast} from "react-toastify";
import services from "@/core/service"
import {requestStepData} from "@/core/utils"
import {useParams} from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import FileInput from "@/components/form/input/FileInput";
import RequestStepForm from "@/components/custom/field/RequestStepForm";
import Image from "next/image";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";
import Select from "@/components/form/Select";
import Textarea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import DatePicker from "react-multi-date-picker";
import Label from "@/components/form/Label";
import {calculateTimestamp} from "@/core/utils";
import {filter} from "domutils";

// import FilterComponent from "@/components/custom/filters/FilterComponent";

interface RequestData {
    request_id: string;
    request_fieldinsurance_fa: string | '-';
    request_last_state_name: string | '-';
    staterequest_last_timestamp: string | '-';
    user_name: string | '-';
    user_family: string | '-';
    user_mobile: string | '-';
    user_pey_amount: number | '-';
    user_pey_cash: number | '-';
    request_financial_doc: Array<[]>;
    request_address: Array<[]>;
    request_description?: string | '-';
    request_ready?: Array<{
        requst_ready_start_date: string | '-';
        requst_ready_end_date: string | '-';
        requst_ready_end_price: string | '-';
        requst_ready_num_ins?: string | '-';
        requst_suspend_desc?: string | '-';
    }>;
    request_stats?: Array<{
        staterequest_timestamp: string | '-';
        request_state_name: string | '-';
        staterequest_desc: string | '-';
        agent_code?: string | '-';
        agent_name?: string | '-';
        agent_family?: string | '-';
        employee_name?: string | '-';
        employee_family?: string | '-';
    }>;
}

export default function RequestDetail() {
    const params = useParams();
    const id = params?.id;

    const [imageIsLoading, setImageIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("issuance");
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    // const [currentState, setCurrentState] = useState<string | null>(null);
    const [allRequestStates, setAllRequestStates] = useState([]);
    const [availableStates, setAvailableStates] = useState([]);
    const [deliveryModes, setDeliveryModes] = useState([]);
    const [cityStatesList, setCityStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState<any | number>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stepFields, setStepFields] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)

    function hasEmptyValue(obj: Record<string, any>): boolean {
        if(Object.values(obj).length == 0) return true
        return Object.values(obj).some(value => value == "" || value == null || value == undefined);
    }

    const handleFormSubmit = async (formDataset) => {
        if (hasEmptyValue(formDataset)) {
            toast.error("لطفا تمام فیلدهای ضروری را پر کنید");
            return;
        }

        setIsSubmitting(true);
        try {
            const query = new URLSearchParams({
                request_id: id,
                command: requestStepData[selectedStatus]?.command,
                ...formDataset
            }).toString();

            const response = await services.Requests.sendRequest(`?${query}`);

            if (response.data.result === "ok") {
                toast.success("وضعیت با موفقیت به روز شد");
                setTimeout(() => window.location.reload(), 2000)
            } else {
                throw new Error(response.data.desc);
            }
        } catch (err) {
            toast.error(err.message || "خطا در بروزرسانی وضعیت");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchRequestDetail = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const response = await services.Requests.getReport('?command=getagent_request')
            if (response?.data?.result === "ok") {
                let requests = response?.data?.data
                let reqIndex = requests.findIndex(req => req.request_id == id)
                setRequestData(requests[reqIndex] as RequestData);
                // setCurrentState(requests[reqIndex]?.request_last_state_id)
                fetchRequestStates(requests[reqIndex]?.request_last_state_id);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            setError(err.message || "مشکلی پیش آمد. لطفا مجددا تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequestStates = async (currentState) => {
        try {
            const response = await services.Requests.getReport('?command=getstaterequest')
            if (response?.data?.result === "ok") {
                let states = await response?.data?.data.map(function (stat) {
                    return {
                        value: stat?.request_state_id,
                        label: stat?.request_state_name
                    }
                })
                let filteredStates = await states.filter(state => {
                    // console.log(state, currentState)
                    if (currentState == state.value) return false
                    else if (currentState == '1' || currentState == '2') return state.value == '3'
                    else if (currentState == '3') return state.value == '4' || state.value == '5' || state.value == '6' || state.value == '7' || state.value == '8' || state.value == '9' || state.value == '16'  // اضافه واریزی
                    else if (currentState == '7' || currentState == '8') return state.value == '5' || state.value == '6' || state.value == '7' || state.value == '8' || state.value == '9' || state.value == '16'   // اضافه واریزی
                    else if (currentState == '9') return state.value == '10'
                    else if (currentState == '10') return state.value == '11'
                    else if (currentState == '11') return false
                    else return false
                })
                // console.log(states, filteredStates);
                setAvailableStates(filteredStates)
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setAllRequestStates([]);
            console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
        }
    };

    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    useEffect(() => {
        if (!selectedStatus) return
        setStepFields(requestStepData[selectedStatus])
        setFormData({})
    }, [selectedStatus]);

    if (isLoading) return <div className="text-center">در حال دریافت اطلاعات...</div>;

    if (!requestData) return <div className="text-center">اطلاعاتی یافت نشد.</div>;

    return (
        <>
            <div className="mb-6">

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            شماره درخواست:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_id}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            رشته بیمه :
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_fieldinsurance_fa || "نامشخص"}
                        </p>
                    </div>
                </div>
                <hr/>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            <Badge variant="solid"
                                   color="primary">{requestData?.request_last_state_name || "نامشخص"}</Badge>
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            تاریخ آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {calculateTimestamp(requestData?.staterequest_last_timestamp)}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            مشخصات کاربر:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_name} {requestData?.user_family}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            شماره همراه
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_mobile || "نامشخص"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-200">
                            مبلغ پرداخت شده :
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_pey_amount} ریال
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-200">
                            جزئیات درخواست:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_description || "-"}
                        </p>
                    </div>

                </div>
            </div>

            <div className="mb-6">
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tab value="issuance" icon={<FileIcon/>}>جزئیات صدور</Tab>
                    <Tab value="records" icon={<PieChartIcon/>}>وضعیت ها</Tab>
                    <Tab value="financial" icon={<DollarLineIcon/>}>مالی</Tab>
                    <Tab value="images" icon={<TaskIcon/>}>عکس ها</Tab>
                    <Tab value="address" icon={<InfoIcon/>}>آدرس</Tab>
                </Tabs>
            </div>

            {/* Tab Contents */}
            <div className="my-6">
                {activeTab === "issuance" && (
                    <div className="grid grid-cols-2 gap-4">
                        {requestData.request_ready?.map((ready, index) => (
                            <div key={index}>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">تاریخ
                                    شروع:</b> {calculateTimestamp(ready?.requst_ready_start_date)} </p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">تاریخ
                                    پایان:</b> {calculateTimestamp(ready?.requst_ready_end_date)} </p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">قیمت
                                    نهایی:</b> {ready?.requst_ready_end_price} ریال</p>
                                {/*شماره بیمه نامه*/}
                                {/*کد یکتا بیمه نامه*/}
                                {/*کد رایانه بیمه نامه*/}
                                {/*مبلغی که شامل کارمزد نمیشود*/}
                                {/*نحوه تسویه*/}
                                {/*توضیحات صدور*/}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "images" && (
                    <div className="grid grid-cols-3 gap-4">
                        {!requestData?.request_financial_doc.length && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">عکس موجود
                                نیست.</div>)}
                        {requestData?.request_financial_doc?.map((img, index) => (
                            // todo: find out how images will pass
                            {img, index}
                            // <Image
                            //     key={index}
                            //     src={img?.url}
                            //     alt={`Image ${index + 1}`}
                            //     width={200}
                            //     height={200}
                            //     className="rounded-lg"
                            // />
                        ))}
                    </div>
                )}

                {activeTab === "records" && (
                    <>
                        {!requestData.request_stats && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">رکوردی موجود
                                نیست.</div>)}
                        {requestData.request_stats?.length > 0 && (<table className="w-full">
                            <thead>
                            <tr>
                                <th>تاریخ</th>
                                <th>وضعیت</th>
                                <th>توضیحات</th>
                                <th>کد نماینده</th>
                                <th>نماینده</th>
                                <th>کارمند</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requestData.request_stats?.map((stat, index) => (
                                <tr key={index}>
                                    <td>{stat?.staterequest_timestamp}</td>
                                    <td>{stat.request_state_name}</td>
                                    <td>{stat.staterequest_desc}</td>
                                    <td>{stat.agent_code || "-"}</td>
                                    <td>{stat.agent_name ? `${stat.agent_name} ${stat.agent_family}` : "-"}</td>
                                    <td>{stat.employee_name ? `${stat.employee_name} ${stat.employee_family}` : "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>)}
                    </>
                )}

                {activeTab === "financial" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                پرداخت شده: </b> {requestData?.user_pey_amount} ریال</p>
                            <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                نقدی پرداخت شده: </b> {requestData?.user_pey_cash} ریال</p>
                        </div>
                    </div>
                )}

                {activeTab === "address" && (
                    <div>
                        {!requestData?.request_address && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">آدرس موجود
                                نیست.</div>)}

                        {requestData?.request_address?.map((address, index) => (
                            <div key={index} className="mb-4">
                                {/* todo: no available address */}
                                {/*<p>آدرس: {address?.user_address_str}</p>*/}
                                {/*<p>کد پستی: {address?.user_address_code}</p>*/}
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <hr/>
            {/* Status Change Dropdown */}
            <div className="mb-6">
                <div className={`w-[350px]`}>
                    <Label htmlFor="changeState">تغییر وضعیت درخواست</Label>
                    <Select
                        id="changeState"
                        options={availableStates}
                        onChange={(e) => setSelectedStatus(e)}
                        disabled={isSubmitting}
                        placeholder="انتخاب کنید"
                    >
                    </Select>
                </div>

                {stepFields && selectedStatus && (
                    <div className={'mt-6 p-4 w-full border border-gray-200 rounded-xl dark:border-gray-800'}>
                        <h3>{stepFields['title']}</h3>
                        <div className="mt-4">
                            <RequestStepForm
                                stepFields={stepFields['fields']}
                                onSubmit={handleFormSubmit}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
