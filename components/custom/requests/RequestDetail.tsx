"use client";

import React, {useState, useEffect} from "react";
import {FileIcon, TaskIcon, DollarLineIcon, PieChartIcon, InfoIcon, PlusIcon} from "@/icons";
import {toast} from "react-toastify";
import services from "@/core/service"
import {requestStepData} from "@/core/utils"
import {useParams} from "next/navigation";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import RequestStepForm from "@/components/custom/field/RequestStepForm";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import {calculateTimestamp} from "@/core/utils";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/custom/tables";
import {LocateIcon, SendIcon, UsersIcon} from "lucide-react";

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
    requst_ready_num_ins: string | null;
    requst_ready_code_yekta: string | null;
    requst_ready_code_rayane: string | null;
    requst_ready_name_insurer: string | null;
    requst_ready_code_insurer: string | null;
    requst_ready_code_penalty: string | null;
    // request_ready_image_tb?: array | null;
    // request_ready_file_tb?: array | null;
}

interface RequestDelivered {
    request_delivered_timesatmp: string | null;
    request_delivered_mode: string | null;
    request_delivered_dsc: string | null;
    request_delivered_state: string | null;
    request_delivered_city: string | null;
    request_delivered_state_id: string | null;
    request_delivered_city_id: string | null;
    user_pey_image_turl: string | null;
    user_pey_image_url: string | null;
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
    request_last_state_id: string | null;
    staterequest_last_timestamp: string | null;
    user_name: string | null;
    user_family: string | null;
    user_mobile: string | null;
    user_pey_amount: number | null;
    user_pey_cash: number | null;
    request_financial_approval: Array<any>;
    request_adderss: RequestAddress[];
    request_image: RequestImage[];
    request_ready?: RequestReady[];
    request_delivered?: RequestDelivered[];
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
    request_adderssofinsured_id: string | null,
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
    jsonpricing_text: string | null,
    jsonpricing_date: string | null,
    jsonpricing_ip: string | null,
    jsonpricing_fieldinsurance: string | null,
    jsonpricing_request_id: string | null,
    jsonpricing_employee_id: string | null,
    // json
    jsonpricing_request_detail: string | null
}

interface CouncilDetail {
    "requestcouncil_id": string | null;
    "requestcouncil_timestamp": string | null;
    "requestcouncil_desc": string | null;
    "agent_code": string | null;
    "agent_name": string | null;
    "agent_family": string | null;
    "employee_name": string | null;
    "employee_family": string | null;
    "requestcouncil_image": string | null;
    "requestcouncil_timage": string | null;
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
    const [activeTab, setActiveTab] = useState("details");
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [requestDetails, setRequestDetails] = useState<RequestDetail[] | null>(null);
    const [councilDetails, setRequestCouncilDetails] = useState<CouncilDetail[] | null>(null);
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

    const fetchRequestCouncilDetail = async () => {
        if (!id) return;

        try {
            const response = await services.Requests.getReport('?command=getcouncilrequest&request_id=' + id);
            if (response?.data?.result === "ok") {
                let councilDetails = response?.data?.data;
                setRequestCouncilDetails(councilDetails as CouncilDetail[]);
            } else {
                setRequestCouncilDetails(null);
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setRequestCouncilDetails(null);
            // toast.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
            console.log(err.message || "مشکلی پیش آمد. لطفا مجددا تلاش کنید.");
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

    // @ts-ignore
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
                    <Tab value="details" icon={<InfoIcon/>}>جزئیات بیمه</Tab>
                    <Tab value="delivered" icon={<SendIcon/>}>جزئیات صدور</Tab>
                    <Tab value="records" icon={<PieChartIcon/>}>وضعیت ها</Tab>
                    <Tab value="financial" icon={<DollarLineIcon/>}>مالی</Tab>
                    <Tab value="images" icon={<TaskIcon/>}>عکس ها</Tab>
                    <Tab value="address" icon={<LocateIcon/>}>آدرس</Tab>
                    <Tab value="council" icon={<UsersIcon/>}>شورا</Tab>
                </Tabs>
            </div>

            {/* Tab Contents */}
            <div className="my-6">
                {activeTab === "delivered" && (
                    <>
                        {requestData?.request_delivered?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعاتی موجود
                                نیست.</div>)}

                        {requestData?.request_delivered?.length > 0 && <>
                            {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعات صدور </h3>*/}
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader> تاریخ ارسال</TableCell>
                                        <TableCell isHeader> نوع ارسال</TableCell>
                                        <TableCell isHeader> توضیحات</TableCell>
                                        <TableCell isHeader> استان</TableCell>
                                        <TableCell isHeader>شهر</TableCell>
                                        <TableCell isHeader> رسید پرداخت</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requestData?.request_delivered?.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            <TableCell isHeader>{detail?.request_delivered_timesatmp}</TableCell>
                                            <TableCell isHeader>{detail?.request_delivered_mode}</TableCell>
                                            <TableCell isHeader>{detail?.request_delivered_dsc}</TableCell>
                                            <TableCell isHeader>{detail?.request_delivered_state}</TableCell>
                                            <TableCell isHeader>{detail?.request_delivered_city}</TableCell>
                                            <TableCell isHeader>{detail?.user_pey_image_turl && (
                                                <div className="overflow-hidden rounded-md">
                                                    <Image
                                                        className="mx-auto"
                                                        width={60}
                                                        height={60}
                                                        src={detail?.user_pey_image_turl}
                                                        alt={detail?.request_delivered_dsc}
                                                    />
                                                </div>
                                            )}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </>
                )}

                {activeTab === "details" && (
                    <>
                        {requestData?.request_ready?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعاتی موجود
                                نیست.</div>)}

                        {requestData?.request_ready?.length > 0 && <>
                            {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعات سفارش </h3>*/}
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader> تاریخ شروع</TableCell>
                                        <TableCell isHeader> تاریخ پایان</TableCell>
                                        <TableCell isHeader> قیمت تمام شده</TableCell>
                                        <TableCell isHeader> شماره بیمه</TableCell>
                                        <TableCell isHeader> کد یکتا</TableCell>
                                        <TableCell isHeader> کد رایانه</TableCell>
                                        <TableCell isHeader> نام بیمه شونده</TableCell>
                                        <TableCell isHeader> کد بیمه شونده</TableCell>
                                        <TableCell isHeader> کد پنالتی</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requestData?.request_ready?.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_start_date}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_end_date}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_end_price}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_num_ins}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_code_yekta}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_code_rayane}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_name_insurer}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_code_insurer}</TableCell>
                                            <TableCell isHeader>{detail?.requst_ready_code_penalty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </>
                )}

                {activeTab === "images" && (
                    <>
                        {requestData?.request_image?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">عکس موجود
                                نیست.</div>)}

                        {requestData?.request_image?.length > 0 && <>
                            {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">عکس های سفارش </h3>*/}
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader> نام عکس</TableCell>
                                        <TableCell isHeader> عکس</TableCell>
                                        <TableCell isHeader> توضیحات</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requestData?.request_image.map((image, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            <TableCell isHeader>{image?.image_name || '-'}</TableCell>
                                            <TableCell isHeader>{image?.image_tumb_url && (
                                                <div className="overflow-hidden rounded-md">
                                                    <Image
                                                        className="mx-auto"
                                                        width={60}
                                                        height={60}
                                                        src={image?.image_tumb_url}
                                                        alt={image?.image_name}
                                                    />
                                                </div>
                                            )}</TableCell>
                                            <TableCell isHeader>{image?.image_desc || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </>
                )}

                {activeTab === "records" && (
                    <>
                        {requestData.request_stats?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">رکوردی موجود
                                نیست.</div>)}
                        {requestData.request_stats?.length > 0 && (
                            <>
                                {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">گزارش وضعیت بیمه*/}
                                {/*    نامه </h3>*/}

                                <Table className="w-full text-start">

                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader>ردیف</TableCell>
                                            <TableCell isHeader>وضعیت</TableCell>
                                            <TableCell isHeader>تاریخ</TableCell>
                                            <TableCell isHeader>توضیحات</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requestData.request_stats?.map((stat, index) => (
                                            <TableRow key={index}>
                                                <TableCell isHeader>{index + 1}</TableCell>
                                                <TableCell isHeader>{stat?.request_state_name}</TableCell>
                                                <TableCell isHeader>{stat?.staterequest_timestamp}</TableCell>
                                                <TableCell isHeader>{stat?.staterequest_desc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>)}
                    </>
                )}

                {activeTab === "financial" && (
                    <>
                        {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعات مالی سفارش </h3>*/}

                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                    پرداخت شده: </b> {requestData?.user_pey_amount} ریال</p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-200"><b className="me-3">مبلغ
                                    نقدی پرداخت شده: </b> {requestData?.user_pey_cash} ریال</p>
                            </div>
                        </div>

                        {requestData?.user_pey_detail?.length > 0 && <>
                            <hr/>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader>مبلغ پرداخت شده</TableCell>
                                        <TableCell isHeader>مبلغ نقدی پرداخت شده</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requestData?.user_pey_detail?.map((pay, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            <TableCell isHeader>{pay?.user_pey_amount || '-'}</TableCell>
                                            <TableCell isHeader>{pay?.user_pey_cash || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </>

                )}

                {activeTab === "address" && (
                    <div>
                        {requestData?.request_adderss?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">آدرس موجود
                                نیست.</div>)}

                        {requestData?.request_adderss?.length > 0 && <>
                            {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">آدرس ارسال بیمه*/}
                            {/*    نامه </h3>*/}
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader> نام</TableCell>
                                        <TableCell isHeader> تلفن</TableCell>
                                        <TableCell isHeader> شماره همراه</TableCell>
                                        <TableCell isHeader> استان</TableCell>
                                        <TableCell isHeader> آدرس</TableCell>
                                        <TableCell isHeader> کدپستی</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requestData?.request_adderss.map((address, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            <TableCell isHeader>{address?.user_address_name || '-'}</TableCell>
                                            <TableCell isHeader>{address?.user_address_tell || '-'}</TableCell>
                                            <TableCell isHeader>{address?.user_address_mobile || '-'}</TableCell>
                                            <TableCell isHeader>{address?.user_address_state || '-'}</TableCell>
                                            <TableCell isHeader>{address?.user_address_str || '-'}</TableCell>
                                            <TableCell isHeader>{address?.user_address_code || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </div>
                )}

                {activeTab === "council" && (
                    <div>
                        {councilDetails?.length == 0 && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-200">اطلاعاتی موجود
                                نیست.</div>)}

                        {councilDetails?.length > 0 && <>
                            {/*<h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">شورا </h3>*/}
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader>ردیف</TableCell>
                                        <TableCell isHeader>کاربر</TableCell>
                                        <TableCell isHeader> نماینده</TableCell>
                                        <TableCell isHeader> توضیحات</TableCell>
                                        <TableCell isHeader> عکس</TableCell>
                                        <TableCell isHeader> تاریخ</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {councilDetails?.map((council, index) => (
                                        <TableRow key={index}>
                                            <TableCell isHeader>{index + 1}</TableCell>
                                            {/*<TableCell isHeader>{council?.agent_code || '-'}</TableCell>*/}
                                            <TableCell
                                                isHeader>{council?.agent_name && (council?.agent_name + ' ' + council?.agent_family) || '-'}</TableCell>
                                            <TableCell
                                                isHeader>{council?.employee_name && (council?.employee_name + ' ' + council?.employee_family) || '-'}</TableCell>
                                            <TableCell isHeader>{council?.requestcouncil_desc || '-'}</TableCell>
                                            <TableCell isHeader>{council?.requestcouncil_image && (
                                                <div className="overflow-hidden rounded-md">
                                                    <Image
                                                        className="mx-auto"
                                                        width={60}
                                                        height={60}
                                                        src={council?.requestcouncil_image}
                                                        alt={council?.requestcouncil_desc}
                                                    />
                                                </div>
                                            )}</TableCell>
                                            <TableCell isHeader>{council?.requestcouncil_timestamp || '-'}</TableCell>
                                            {/*<TableCell isHeader>{council?.requestcouncil_timage || '-'}</TableCell>*/}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}
                    </div>
                )}
            </div>


            {/* Status Change Dropdown */}
            {requestData && requestData?.request_last_state_id != '11' &&
                <>
                    <hr/>
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
                                <h3 className="mb-2 leading-normal text-gray-400 dark:text-gray-200">{stepFields['title']}</h3>
                                <div className="mt-4">
                                    <RequestStepForm
                                        // @ts-ignore
                                        disabled={!requestStepData[selectedStatus]?.command}
                                        stepFields={stepFields['fields']}
                                        onSubmit={handleFormSubmit}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            }

            {/*{requestDetails?.length > 0 && (*/}
            {/*    <>*/}
            {/*        {requestDetails?.map((requestDetail, index) => (*/}
            {/*            <div className="mt-8" key={index}>*/}
            {/*                <h3 className="font-bold mb-4">اطلاعات تکمیلی بیمه‌نامه</h3>*/}
            {/*                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">نوع ساختمان:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_kind_name}</p>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">نوع سازه:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_typeofcons_name}</p>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">متراژ واحد:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_area}</p>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">ارزش لوازم منزل:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_cost_furniture} ریال</p>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">عمر بنا:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_buildinglife_name}</p>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        <p className="mb-2 text-gray-500">فقط اثاثیه:</p>*/}
            {/*                        <p className="font-medium">{requestDetail?.firehome_only_furniture === "1" ? "بله" : "خیر"}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <hr className="my-4"/>*/}
            {/*                <h4 className="font-semibold mb-2">پوشش‌های اضافی:</h4>*/}
            {/*                <ul className="list-disc pl-5">*/}
            {/*                    {JSON.parse(requestDetail?.request_detail_json)?.body?.firehome_coverage_id?.map((cov) => (*/}
            {/*                        <li key={cov.id}>{cov.name}</li>*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*                <hr className="my-4"/>*/}
            {/*                <h4 className="font-semibold mb-2">مشخصات شرکت بیمه:</h4>*/}
            {/*                <div className="flex items-center gap-4">*/}
            {/*                    <img src={companyLogoUrl} alt="لوگو شرکت" width={40}/>*/}
            {/*                    <div>*/}
            {/*                        <div>نام شرکت: {companyName}</div>*/}
            {/*                        <div>سطح توانگری: {companyLevel}</div>*/}
            {/*                        <div>تعداد شعب خسارت: {companyBranches}</div>*/}
            {/*                        <div>رضایت مشتریان: {companySatisfaction} از 10</div>*/}
            {/*                        <div>سرعت پاسخگویی به شکایات: {companyAnswerSpeed} از 10</div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <hr className="my-4"/>*/}
            {/*                <h4 className="font-semibold mb-2">تخفیف:</h4>*/}
            {/*                <div>*/}
            {/*                    <div>عنوان تخفیف: {discountTitle}</div>*/}
            {/*                    <div>مبلغ تخفیف: {discountAmount} ریال</div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}

            {/*    </>*/}
            {/*)}*/}
        </>
    );
}
