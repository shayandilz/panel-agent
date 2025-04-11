"use client";

import React, {useState, useEffect} from "react";
import {useModal} from "@/components/hooks/useModal";
import {Modal} from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Image from "next/image";
import {useAgent} from "@/context/AgentContext";
import {as} from "@fullcalendar/core/internal-common";
import {toast} from "react-toastify";
import services from "@/core/service"
import { useRouter } from "next/router";

export default function RequestDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const [requestData, setRequestData] = useState({});
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)
    const router = useRouter();
    const { id } = router.query; // Extract 'id' from the route

    if (!id) {
        return <div>در حال دریافت اطلاعات...</div>; // Show a loading state until 'id' is available
    }

    // "data": [
    //     {
    //         "request_id": "12691",
    //         "request_company_id": "16",
    //         "company_name": "بیمه سامان",
    //         "company_logo_url": "https://api.rahnamayefarda.ir/filefolder/fieldinsurancelogo/c16.png",
    //         "agent_id": "3",
    //         "agent_code": "20473",
    //         "agent_name": "علیرضا",
    //         "agent_family": "معصومی",
    //         "agent_gender": "آقای",
    //         "agent_mobile": "09121722833",
    //         "agent_tell": "0863121513",
    //         "agent_email": "sabimins@gmail.com",
    //         "agent_required_phone": "021220190219",
    //         "agent_address": "جردن 2",
    //         "agent_state_id": "8",
    //         "agent_city_id": "117",
    //         "agent_state_name": "تهران",
    //         "agent_city_name": "تهران",
    //         "agent_sector_name": "جردن 2",
    //         "agent_long": "48.3840140616968",
    //         "agent_lat": "35.09425938576085",
    //         "agent_banknum": "333333",
    //         "agent_bankname": "ملت",
    //         "agent_banksheba": "www",
    //         "agent_image_code": "1587763885b7hctCIN",
    //         "agent_image": null,
    //         "agent_image_tumb": null,
    //         "agent_deactive": "0",
    //         "agent_register_date": "2147483647",
    //         "agent_status": "0",
    //         "user_id": "5334",
    //         "user_name": "محمد",
    //         "user_family": "aaaaaaaa",
    //         "user_mobile": "09335444712",
    //         "fieldinsurance_logo_url": "https://api.rahnamayefarda.ir/filefolder/fieldinsurancelogo/69.png",
    //         "fieldinsurance_id": "69",
    //         "request_fieldinsurance_fa": "بیمه موبایل",
    //         "request_description": null,
    //         "request_last_state_id": "9",
    //         "request_last_state_name": "در حال صدور توسط نماینده",
    //         "request_adderss": [
    //             {
    //                 "user_address_state": "آذربایجان شرقی",
    //                 "user_address_city": "تبریز",
    //                 "user_address_state_id": "1",
    //                 "user_address_city_id": "1",
    //                 "user_address_str": "ببببببببببببببببببببببببب",
    //                 "user_address_code": "1111111111",
    //                 "user_address_name": "صثصثص",
    //                 "user_address_mobile": "09335444712",
    //                 "user_address_tell": "4242"
    //             }
    //         ],
    //         "request_addressofinsured": [
    //             {
    //                 "user_address_state_id": "1",
    //                 "user_address_state": "آذربایجان شرقی",
    //                 "user_address_city": "تبریز",
    //                 "user_address_str": "ببببببببببببببببببببببببب",
    //                 "user_address_code": "1111111111",
    //                 "user_address_name": "صثصثص",
    //                 "user_address_mobile": "09335444712",
    //                 "user_address_tell": "4242"
    //             }
    //         ],
    //         "user_pey_amount": 12375,
    //         "user_pey_cash": 12375,
    //         "user_pey_instalment": null,
    //         "user_pey_detail": [],
    //         "staterequest_last_timestamp": "2025-04-11 12:26:23",
    //         "request_stats": [
    //             {
    //                 "staterequest_id": "20393",
    //                 "request_state_name": "استعلام قیمت توسط کاربر",
    //                 "staterequest_timestamp": "2025-03-11 11:55:54",
    //                 "staterequest_desc": " انتخاب قیمت درخواست"
    //             },
    //             {
    //                 "staterequest_id": "20394",
    //                 "request_state_name": "ثبت اطلاعات سفارش توسط کاربر",
    //                 "staterequest_timestamp": "2025-03-11 11:56:00",
    //                 "staterequest_desc": "درخواست توسط کابر ثبت شد"
    //             },
    //             {
    //                 "staterequest_id": "20395",
    //                 "request_state_name": "صادر شده و آماده تحویل",
    //                 "staterequest_timestamp": "2025-03-11 11:58:12",
    //                 "staterequest_desc": " صادر شده و آماده تحویل ",
    //                 "agent_code": "8170",
    //                 "agent_name": "احسان",
    //                 "agent_family": "معصومی",
    //                 "employee_name": "محمد حسین",
    //                 "employee_family": "حسینی"
    //             },
    //             {
    //                 "staterequest_id": "20402",
    //                 "request_state_name": "در حال صدور توسط نماینده",
    //                 "staterequest_timestamp": "2025-04-11 12:26:23",
    //                 "staterequest_desc": " در حال صدور ",
    //                 "agent_code": "20473",
    //                 "agent_name": "علیرضا",
    //                 "agent_family": "معصومی",
    //                 "employee_name": "محمد حسین",
    //                 "employee_family": "حسینی"
    //             }
    //         ],
    //         "request_ready": [
    //             {
    //                 "requst_ready_start_date": "2025-03-11 11:58:12",
    //                 "requst_ready_end_date": "2025-03-11 11:58:12",
    //                 "requst_ready_end_price": "12375",
    //                 "requst_ready_num_ins": "1231",
    //                 "requst_ready_code_yekta": "21313213",
    //                 "requst_ready_code_rayane": "32131",
    //                 "requst_ready_name_insurer": "haji",
    //                 "requst_ready_code_insurer": "00235",
    //                 "requst_ready_code_penalty": "0",
    //                 "request_ready_image_tb": [],
    //                 "request_ready_file_tb": []
    //             }
    //         ],
    //         "request_delivered": [],
    //         "request_image": [],
    //         "visit_image": []
    //     }
    // ],
    const fetchRequestDetail = async () => {
        try {
            setIsLoading(true);
            const response = await services.Requests.getReport(`?command=requestissuing9&request_id=${id}`);
            if (response) {
                const data = response.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setRequestData(data.data || []);
            } else toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
        } catch (err) {
            toast.error(err || "مشکلی پیش آمد. دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    return (
        <>
            {isLoading ? (
                <div className="text-center">در حال دریافت اطلاعات...</div>
            ) : (
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
  

                    <div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    شماره درخواست:
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.request_id}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    رشته بیمه :
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.request_fieldinsurance_fa}
                                </p>
                            </div>

                            <hr/>

                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    آخرین وضعیت:
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.request_last_state_name}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    تاریخ آخرین وضعیت:
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.staterequest_last_timestamp}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    مشخصات کاربر:
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.user_name} {requestData.user_family}
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    شماره همراه
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.user_mobile}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    مبلغ پرداخت شده :
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData.user_pey_amount} ریال
                                </p>
                            </div>
                            <div>
                                <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                                    جزئیات درخواست:
                                </p>
                                <p className=" font-medium text-gray-800 dark:text-white/90">
                                    {requestData?.request_description}
                                </p>
                            </div>
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">آدرس</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_address}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">استان</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_state_name}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شهر</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_city_name}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">منطقه</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_sector_name}</p>*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شماره حساب بانکی</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_banknum}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">نام بانک</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_bankname}</p>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شماره شبا</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_banksheba}</p>*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">تاریخ ثبت نام</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">{requestData.agent_register_date}</p>*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">وضعیت کاربر</p>*/}
                            {/*    <p className="font-medium text-gray-800 dark:text-white/90">*/}
                            {/*        {requestData.agent_deactive === "0" ? "غیرفعال" : "فعال"}*/}
                            {/*    </p>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    {/*<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">*/}
                    {/*    <div*/}
                    {/*        className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">*/}
                    {/*        <div className="px-2 pl-14">*/}
                    {/*            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">*/}
                    {/*                ویرایش مشخصات*/}
                    {/*            </h4>*/}
                    {/*            /!*<p className="mb-6  text-gray-500 dark:text-gray-400 lg:mb-7">*!/*/}
                    {/*            /!*    Update your details to keep your profile up-to-date.*!/*/}
                    {/*            /!*</p>*!/*/}
                    {/*        </div>*/}
                    {/*        <form className="flex flex-col">*/}
                    {/*            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">*/}
                    {/*                <div className="mt-7">*/}
                    {/*                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">*/}
                    {/*                        <div className="col-span-2 lg:col-span-1">*/}
                    {/*                            <Label>تلفن ضروری</Label>*/}
                    {/*                            <Input type="tel" defaultValue={newAgentData?.agent_required_phone}/>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="col-span-2 lg:col-span-1">*/}
                    {/*                            <Label>تلفن</Label>*/}
                    {/*                            <Input type="tel" defaultValue={newAgentData?.agent_tell}/>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="col-span-2 lg:col-span-1">*/}
                    {/*                            <Label>ایمیل</Label>*/}
                    {/*                            <Input type="email" defaultValue={newAgentData?.agent_email}/>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="col-span-2 lg:col-span-1">*/}
                    {/*                            <Label>منطقه</Label>*/}
                    {/*                            <Input type="text" defaultValue={newAgentData?.agent_sector_name}/>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="col-span-2 lg:col-span-2">*/}
                    {/*                            <Label>آدرس</Label>*/}
                    {/*                            <Input type="text" defaultValue={newAgentData?.agent_address}/>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">*/}
                    {/*                <Button className="px-8" size="sm" onClick={handleSave} loading={showLoader}*/}
                    {/*                        disabled={showLoader}>*/}
                    {/*                    ثبت*/}
                    {/*                </Button>*/}
                    {/*                <Button className="px-8" size="sm" variant="outline" onClick={cancelSave}>*/}
                    {/*                    لغو*/}
                    {/*                </Button>*/}
                    {/*            </div>*/}
                    {/*        </form>*/}
                    {/*    </div>*/}
                    {/*</Modal>*/}
                </div>
            )}
        </>
    );
}
