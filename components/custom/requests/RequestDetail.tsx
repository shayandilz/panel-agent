"use client";

import React, {useState, useEffect} from "react";
// import {useModal} from "@/hooks/useModal";
// import {Modal} from "@/components/ui/modal";
// import Button from "@/components/ui/button/Button";
// import Input from "@/components/form/input/InputField";
// import TextArea from "@/components/form/input/TextArea";
// import Label from "@/components/form/Label";
// import Image from "next/image";
// import {useAgent} from "@/context/AgentContext";
// import {as} from "@fullcalendar/core/internal-common";
import {FileIcon, TaskIcon, DollarLineIcon, PieChartIcon, InfoIcon} from "@/icons";
import {toast} from "react-toastify";
import services from "@/core/service"
import {useParams} from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import FileInput from "@/components/form/input/FileInput";
import Image from "next/image";
import {Tab, Tabs} from "@/components/ui/tabs/Tabs";
import Select from "@/components/form/select";
import Textarea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Label from "@/components/form/Label";
import {de} from "@fullcalendar/core/internal-common";
import {calculateTimestamp} from "@/core/utils";

interface RequestData {
    request_id: string;
    request_fieldinsurance_fa: string;
    request_last_state_name: string;
    staterequest_last_timestamp: string;
    user_name: string;
    user_family: string;
    user_mobile: string;
    user_pey_amount: number;
    request_financial_doc: Array<[]>;
    request_address: Array<[]>;
    request_description?: string | null;
    request_ready?: Array<{
        requst_ready_start_date: string;
        requst_ready_end_date: string;
        requst_ready_end_price: string;
        requst_ready_num_ins?: string;
        requst_suspend_desc?: string;
    }>;
    request_stats?: Array<{
        staterequest_timestamp: string;
        staterequest_desc: string;
        agent_code?: string;
        agent_name?: string;
        agent_family?: string;
        employee_name?: string;
        employee_family?: string;
    }>;
}

export default function RequestDetail() {
    const params = useParams();
    const id = params?.id;

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("issuance");
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [requestStates, setRequestStates] = useState([]);
    const [deliveryModes, setDeliveryModes] = useState([]);
    const [cityStatesList, setCityStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)

    const handleStatusChange = async () => {
        // todo: check if all fields are filled
        if (!selectedStatus) {
            toast.error("لطفا تمام فیلدهای ضروری را پر کنید");
            return;
        }

        setIsSubmitting(true);
        try {
            const query = new URLSearchParams({
                request_id: id,
                ...formData
            }).toString();

            const response = await services.Requests.sendRequest(`?${query}`);

            if (response.data.result === "ok") {
                toast.success("وضعیت با موفقیت به روز شد");
                fetchRequestDetail();
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

    const fetchRequestStates = async () => {
        try {
            const response = await services.Requests.getReport('?command=getstaterequest')
            if (response?.data?.result === "ok") {
                let states = await response?.data?.data.map(function (stat) {
                    return {
                        value: stat?.request_state_id,
                        label: stat?.request_state_name
                    }
                })
                setRequestStates(states);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setRequestStates([]);
            console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
        }
    };
    const fetchDeliveryModes = async () => {
        try {
            const response = await services.Requests.getReport('?command=get_mode_delivery')
            if (response?.data?.result === "ok") {
                let modes = await response?.data?.data.map(function (mode) {
                    return {
                        value: mode?.delivery_mode_id,
                        label: mode?.delivery_mode_name
                    }
                })
                setDeliveryModes(modes);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setDeliveryModes([]);
            console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
        }
    };
    const fetchCityStatesList = async () => {
        try {
            const response = await services.Requests.getState('?command=get_state')
            if (response?.data?.result === "ok") {
                let modes = await response?.data?.data.map(function (mode) {
                    return {
                        value: mode?.state_id,
                        label: mode?.state_name
                    }
                })
                setCityStatesList(modes);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setCityStatesList([]);
            console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
        }
    };

    const fetchCityList = async (id) => {
        try {
            const response = await services.Requests.getState('?command=get_city&state_id=' + id)
            if (response?.data?.result === "ok") {
                let modes = await response?.data?.data.map(function (mode) {
                    return {
                        value: mode?.city_id,
                        label: mode?.city_name
                    }
                })
                setCitiesList(modes);
            } else {
                throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            }
        } catch (err: any) {
            setCitiesList([]);
            console.error(err.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
        }
    };

    useEffect(() => {
        fetchRequestDetail();
        fetchRequestStates();
    }, [id]);

    useEffect(() => {
        setFormData({})
        if (selectedStatus == 11) {
            setFormData({...formData, command: "requestdelivered11"})
            fetchDeliveryModes();
            fetchCityStatesList();
        }
    }, [selectedStatus]);

    if (isLoading) return <div className="text-center">در حال دریافت اطلاعات...</div>;

    if (!requestData) return <div className="text-center">اطلاعاتی یافت نشد.</div>;

    return (
        <>
            <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            شماره درخواست:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.request_id}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
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
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            <Badge variant="light"
                                   color="primary">{requestData?.request_last_state_name || "نامشخص"}</Badge>
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            تاریخ آخرین وضعیت:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {calculateTimestamp(requestData?.staterequest_last_timestamp)}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            مشخصات کاربر:
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_name} {requestData?.user_family}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            شماره همراه
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_mobile || "نامشخص"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">
                            مبلغ پرداخت شده :
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {requestData?.user_pey_amount} ریال
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
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
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-400"><b className="me-3">تاریخ
                                    شروع:</b> {calculateTimestamp(ready?.requst_ready_start_date)} </p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-400"><b className="me-3">تاریخ
                                    پایان:</b> {calculateTimestamp(ready?.requst_ready_end_date)} </p>
                                <p className="mb-2 leading-normal text-gray-800 dark:text-gray-400"><b className="me-3">قیمت
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
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-400">عکس موجود
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
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-400">رکوردی موجود
                                نیست.</div>)}
                        {requestData.request_stats && (<table className="w-full">
                            <thead>
                            <tr>
                                <th>تاریخ</th>
                                <th>توضیحات</th>
                                <th>کد نماینده</th>
                                <th>نماینده</th>
                                <th>کارمند</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requestData.request_stats?.map((stat, index) => (
                                <tr key={index}>
                                    <td>{calculateTimestamp((stat?.staterequest_timestamp))}</td>
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
                            <p className="mb-2 leading-normal text-gray-800 dark:text-gray-400"><b className="me-3">مبلغ
                                پرداخت شده: </b> {requestData?.user_pey_amount} ریال</p>
                            <p className="mb-2 leading-normal text-gray-800 dark:text-gray-400"><b className="me-3">مبلغ
                                نقدی پرداخت شده: </b> {requestData?.user_pey_cash} ریال</p>
                        </div>
                    </div>
                )}

                {activeTab === "address" && (
                    <div>
                        {!requestData?.request_address && (
                            <div className="mb-2 leading-normal text-gray-400 dark:text-gray-400">آدرس موجود
                                نیست.</div>)}

                        {requestData?.request_address?.map((address, index) => (
                            <div key={index} className="mb-4">
                                {/* todo: no available address */}
                                <p>آدرس: {address?.user_address_str}</p>
                                <p>کد پستی: {address?.user_address_code}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <hr/>
            {/* Status Change Dropdown */}
            <div className="mb-6">
                <Select
                    options={requestStates}
                    defaultValue={selectedStatus}
                    onChange={(e) => setSelectedStatus(e)}
                    disabled={isSubmitting}
                    placeholder="تغییر وضعیت درخواست"
                >
                </Select>

                {selectedStatus == 11 && (
                    <div className="mt-5">
                        <h3>تغییر وضعیت به تحویل شده به کاربر</h3>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <Select
                                    options={deliveryModes}
                                    onChange={(mode) => setFormData({
                                        ...formData,
                                        request_delivered_mode_id: mode || ""
                                    })}
                                    disabled={isSubmitting}
                                    placeholder="نوع دریافت"
                                >
                                </Select>
                            </div>

                            <div>
                                <Select
                                    options={cityStatesList}
                                    onChange={(state) => {
                                        fetchCityList(state)
                                        setFormData({
                                            ...formData,
                                            request_delivered_state_id: state || ""
                                        })
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="استان"
                                >
                                </Select>
                            </div>
                            <div>
                                <Select
                                    options={citiesList}
                                    onChange={(city) => setFormData({
                                        ...formData,
                                        request_delivered_city_id: city || ""
                                    })}
                                    disabled={isSubmitting}
                                    placeholder="شهر"
                                >
                                </Select>
                            </div>

                            <div>
                                <Textarea
                                    onChange={(desc) => setFormData({
                                        ...formData,
                                        request_delivered_dsc: desc || ""
                                    })}
                                    disabled={isSubmitting}
                                    placeholder="توضیحات تحویل "
                                >
                                </Textarea>
                            </div>

                            <div>
                                <Label>عکس را انتخاب نمایید</Label>
                                <Label className="text-sm">Max file size: 5mb, accepted: jpg|gif|png</Label>
                                <FileInput
                                    onChange={(file) => setFormData({
                                        ...formData,
                                        request_delivered_receipt_image_code: file || ""
                                    })}
                                    disabled={isSubmitting}
                                >
                                </FileInput>
                            </div>
                        </div>

                        <Button
                            onClick={handleStatusChange}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "در حال ارسال..." : "ثبت وضعیت تحویل شده به کاربر"}
                        </Button>
                    </div>
                )}

                {selectedStatus == 9 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <Select
                                options={deliveryModes}
                                defaultValue={formData.delivery_mode}
                                onChange={(mode) => setFormData({
                                    ...formData,
                                    delivery_mode: mode || ""
                                })}
                                disabled={isSubmitting}
                                placeholder="نوع دریافت"
                            >
                            </Select>
                        </div>
                        <div>
                            <DatePicker
                                calendars="['persian']"
                                locales="['fa']"
                                format="YYYY/MM/DD"
                                value={formData.start_date}
                                onChange={(date) => setFormData({
                                    ...formData,
                                    start_date: date?.format("YYYY-MM-DD") || ""
                                })}
                                placeholder="تاریخ شروع"
                                containerClassName="block w-full"
                                inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <div>
                            <DatePicker
                                calendars="['persian']"
                                locales="['fa']"
                                format="YYYY/MM/DD"
                                value={formData.end_date}
                                onChange={(date) => setFormData({
                                    ...formData,
                                    end_date: date?.format("YYYY-MM-DD") || ""
                                })}
                                placeholder="تاریخ پایان"
                                containerClassName="block w-full"
                                inputClass="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <input
                            type="number"
                            placeholder="مبلغ نهایی"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="p-2 border rounded"
                        />

                        <Button
                            onClick={handleStatusChange}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "در حال ارسال..." : "ثبت تغییر وضعیت"}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
