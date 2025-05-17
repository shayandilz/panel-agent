"use client";

import React, {useState, useEffect} from "react";
import {FileIcon, TaskIcon, DollarLineIcon, PieChartIcon, InfoIcon, PlusIcon} from "@/icons";
import {toast} from "react-toastify";
import services from "@/core/service"
import {requestStepData} from "@/core/utils"
import {useParams} from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import RequestStepForm from "@/components/custom/field/RequestStepForm";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import {calculateTimestamp} from "@/core/utils";

interface RequestAddress {
    user_address_city: string | null;
    user_address_city_id: string | null;
    user_address_code: string | null;
    user_address_mobile: string | null;
    user_address_name: string | null;
    user_address_state: string | null;
    user_address_state_id: string | null;
    user_address_str: string | null;
    user_address_tell: string | null;
}

interface RequestImage {
    image_desc: string | null;
    image_name: string | null;
    image_tumb_url: string | null;
    image_url: string | null;
}

interface RequestPayDetail {
    user_pey_amount: string | null;
    user_pey_cash: string | null;
}

interface RequestReady {
    requst_ready_start_date: string | null;
    requst_ready_end_date: string | null;
    requst_ready_end_price: string | null;
    requst_ready_num_ins?: string | null;
    requst_suspend_desc?: string | null;
}

interface RequestStat {
    staterequest_id: string | null;
    request_state_name: string | null;
    staterequest_timestamp: string | null;
    staterequest_desc: string | null;
}

interface RequestData {
    request_id: string | null,
    request_description: string | null,
    request_fieldinsurance_fa: string | null;
    request_last_state_name: string | null;
    staterequest_last_timestamp: string | null;
    user_name: string | null;
    user_family: string | null;
    user_mobile: string | null;
    user_pey_amount: number | null;
    user_pey_cash: number | null;
    request_financial_approval: Array<any>;
    request_address: RequestAddress[];
    request_image: RequestImage[];
    request_ready?: RequestReady[];
    user_pey_detail?: RequestPayDetail[];
    request_stats?: RequestStat[];
}

interface RequestDetail {
    request_detail_id: string | null,
    request_detail_request_id: string | null,
    // json
    request_detail_json: string | null,
    request_detail_time: string | null,
    request_id: string | null
    request_user_id: string | null
    request_company_id: string | null
    request_agent_id: string | null
    request_fieldinsurance: string | null
    request_description: string | null,
    request_price_app: string | null,
    request_price_agent: string | null,
    request_last_state_id: string | null,
    request_adderss_id: string | null,
    request_addressofinsured_id: string | null,
    request_reagent_mobile: string | null,
    request_jsonpricing_id: string | null,
    request_organ: string | null,
    request_leader_mobile: string | null,
    request_reagent_mobile_refralcode: string | null,
    request_packageinsurance_id: string | null,
    request_partner: string | null,
    request_fieldinsurance_id: string | null,
    jsonpricing_id: string | null,
    // json
    jsonpricing_text:string | null,
    jsonpricing_date: string | null,
    jsonpricing_ip: string | null,
    jsonpricing_fieldinsurance: string | null,
    jsonpricing_request_id: string | null,
    jsonpricing_employee_id: string | null,
    // json
    jsonpricing_request_detail:string | null
}

// interface Filters {
//     startDate?: string | null;
//     endDate?: string | null;
//     fieldInsurance?: string | null;
//     userMobile?: string | null;
//     orderNumber?: string | null;
// }

interface StateOption {
    value: string;
    label: string;
}

export default function RequestDetail() {
    const params = useParams();
    const id = params?.id;

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("issuance");
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [requestDetails, setRequestDetails] = useState<RequestDetail[] | null>(null);
    const [allRequestStates, setAllRequestStates] = useState<StateOption[]>([]);
    const [availableStates, setAvailableStates] = useState<StateOption[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any | number>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stepFields, setStepFields] = useState<any>(null);
    const [formData, setFormData] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showLoader, setShowLoader] = useState(false);

    function hasEmptyValue(obj: Record<string, any>): boolean {
        if (Object.values(obj).length == 0) return true
        return Object.values(obj).some(value => value == "" || value == null || value == undefined);
    }

    const handleFormSubmit = async (formDataset: any) => {
        if (stepFields.length > 0 && hasEmptyValue(formDataset)) {
            toast.error("لطفا تمام فیلدهای ضروری را پر کنید");
            return;
        }

        setIsSubmitting(true);
        try {
            const query = new URLSearchParams({
                request_id: id || "",
                // @ts-ignore
                command: requestStepData[selectedStatus]?.command || "",
                ...formDataset,
            }).toString();

            const response = await services.Requests.sendRequest(`?${query}`);

            if (response.data.result === "ok") {
                toast.success("وضعیت با موفقیت به روز شد");
                // setTimeout(() => window.location.reload(), 2000)
                await fetchRequestData()
            } else {
                throw new Error(response.data.desc);
            }
        } catch (err) {
            toast.error("خطا در بروزرسانی وضعیت");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchRequestDetail = async () => {
        if (!id) return;

        try {
            const response = await services.Requests.getRequestDetail(id);
            if (response?.data?.result === "ok") {
                let requestDetails = response?.data?.data;
                setRequestDetails(requestDetails as RequestDetail[]);
            } else {
                setRequestDetails(null);
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setRequestDetails(null);
            toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            setError(err.message || "مشکلی پیش آمد. لطفا مجددا تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequestData = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const response = await services.Requests.getReport('?command=getdata&request_id=' + id);
            if (response?.data?.result === "ok") {
                let requests = response?.data?.data;
                setRequestData(requests[0] as RequestData);
                await fetchRequestStates(requests[0]?.request_last_state_id);
                await fetchRequestDetail()
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
                setIsLoading(false);
            }
        } catch (err: any) {
            toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            setError(err.message || "مشکلی پیش آمد. لطفا مجددا تلاش کنید.");
            setIsLoading(false);
        }
    };

    const fetchRequestStates = async (currentState: string) => {
        try {
            const response = await services.Requests.getReport('?command=getstaterequest')
            if (response?.data?.result === "ok") {
                let states = await response?.data?.data.map(function (stat: { request_state_id: any; request_state_name: any; }) {
                    return {
                        value: stat?.request_state_id,
                        label: stat?.request_state_name
                    }
                })
                let filteredStates = await states.filter((state: { value: string; }) => {
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
        fetchRequestData();
    }, [id]);

    useEffect(() => {
        if (!selectedStatus) return
        // @ts-ignore
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
                        {requestData?.request_image?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">عکس موجود
                                نیست.</div>)}

                        {requestData?.request_image?.length && <>
                            <h3>عکس های سفارش </h3>
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th>شماره</th>
                                    <th> نام عکس</th>
                                    <th> عکس</th>
                                    <th> توضیحات</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requestData?.request_image.map((image, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{image?.image_name || '-'}</td>
                                        <td>{image?.image_tumb_url && (
                                            <div className="overflow-hidden rounded-md">
                                                <img
                                                    className="mx-auto"
                                                    width={160}
                                                    height={160}
                                                    src={image?.image_tumb_url}
                                                    alt={image?.image_name || ''}
                                                />
                                            </div>
                                        )}</td>
                                        <td>{image?.image_desc || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>}
                    </div>
                )}

                {activeTab === "records" && (
                    <>
                        {requestData.request_stats?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">رکوردی موجود
                                نیست.</div>)}
                        {(requestData.request_stats?.length ?? 0) > 0 && (
                            <>
                                <h3>گزارش وضعیت بیمه نامه </h3>

                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th>شماره</th>
                                        <th>وضعیت</th>
                                        <th>تاریخ</th>
                                        <th>توضیحات</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {requestData.request_stats?.map((stat, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{stat?.request_state_name}</td>
                                            <td>{stat?.staterequest_timestamp}</td>
                                            <td>{stat?.staterequest_desc}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>)}
                    </>
                )}

                {activeTab === "financial" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                    پرداخت شده: </b> {requestData?.user_pey_amount} ریال</p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                    نقدی پرداخت شده: </b> {requestData?.user_pey_cash} ریال</p>
                            </div>
                        </div>
                        {requestData?.user_pey_detail?.length && <>
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th>شماره</th>
                                    <th>مبلغ پرداخت شده</th>
                                    <th>مبلغ نقدی پرداخت شده</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requestData?.user_pey_detail.map((pay, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{pay?.user_pey_amount || '-'}</td>
                                        <td>{pay?.user_pey_cash || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>}
                    </>

                )}

                {activeTab === "address" && (
                    <div>
                        {requestData?.request_address?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">آدرس موجود
                                نیست.</div>)}

                        {requestData?.request_address?.length && <>
                            <h3>آدرس ارسال بیمه نامه </h3>
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th>شماره</th>
                                    <th> تلفن</th>
                                    <th> شماره همراه</th>
                                    <th> استان</th>
                                    <th> آدرس</th>
                                    <th> کدپستی</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requestData?.request_address.map((address, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{address?.user_address_tell || '-'}</td>
                                        <td>{address?.user_address_mobile || '-'}</td>
                                        <td>{address?.user_address_state || '-'}</td>
                                        <td>{address?.user_address_str || '-'}</td>
                                        <td>{address?.user_address_code || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>}
                    </div>
                )}
            </div>


            <hr/>
            {/* Status Change Dropdown */}
            <div className="mb-6">
                <div className={`w-[350px]`}>
                    <Label htmlFor="changeState">تغییر وضعیت درخواست</Label>
                    <Select
                        options={availableStates}
                        onChange={(e) => setSelectedStatus(e)}
                        placeholder="انتخاب کنید"
                    >
                    </Select>
                </div>

                {stepFields && selectedStatus && (
                    <div className={'mt-6 p-4 w-full border border-gray-200 rounded-xl dark:border-gray-800'}>
                        <h3>{stepFields['title']}</h3>
                        <div className="mt-4">
                            <RequestStepForm
                                disabled={!requestStepData[selectedStatus]?.command}
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
