"use client";
import React from "react";
import {useModal} from "@/hooks/useModal";
import {Modal} from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import {useEffect, useState} from 'react';
import {useAuth} from "@/context/AgentContext";
import {toast} from "react-toastify";
import services from "@/core/service"
import {InfoIcon, LockIcon} from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/custom/user/Avatar";
import AgentLocationMap from './AgentLocationMap';
import 'leaflet/dist/leaflet.css';


interface AgentData {
    agent_id: string | null;
    agent_code: string | null;
    agent_gender: string | null;
    agent_name: string | null;
    agent_family: string | null;
    agent_mobile: string | null;
    agent_tell: string | null;
    agent_email: string | null;
    $agenttoken: string | null;
    employee_name: string | null;
    employee_family: string | null;
    agent_required_phone: string | null;
    agent_address: string | null;
    agent_register_date: string | null;
    agent_state_name: string | null;
    agent_city_name: string | null;
    agent_sector_name: string | null;
    agent_long: string | null;
    agent_lat: string | null;
    agent_banknum: string | null;
    agent_bankname: string | null;
    agent_banksheba: string | null;
    agent_image_code: string | null;
    agent_image: any;
    agent_image_tumb: string | null;
    agent_company_name: string | null;
    agent_company_logo_url: string;
    agent_deactive: string | null;
}

export default function UserInfoCard() {
    const {isOpen, openModal, closeModal} = useModal();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const {agentData, fetchAgentData, agentStatus} = useAuth();
    const [newAgentData, setNewAgentData] = useState<AgentData | {}>({});
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)
    const [markerPosition, setMarkerPosition] = useState({
        lat: Number(agentData?.agent_lat) || 35.6892,
        lng: Number(agentData?.agent_long) || 51.3890,
    });

    useEffect(() => {
        setMarkerPosition({
            lat: Number(agentData?.agent_lat) || 35.6892,
            lng: Number(agentData?.agent_long) || 51.3890,
        });
    }, [isOpen, agentData]);

    useEffect(() => {
        setNewAgentData(agentData || {});
    }, [isOpen]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!agentData) {
        // fetchAgentData()
        return <div>در حال بارگذاری...</div>;
    }

    const cancelSave = () => {
        setNewAgentData(agentData);
        closeModal();
    };
    const refreshData = async () => {
        await fetchAgentData()
        setNewAgentData(agentData);
        setShowLoader(false)
    };

    const calculateTimestamp = (timestamp: string | null): string => {
        return (timestamp ? new Date(Number(timestamp)).toLocaleDateString('fa-IR') : 'نا مشخص').toString()
    }

    const handleSave = async () => {
        setShowLoader(true)

        try {
            const res = await services.Agent.edit('?command=changeproperty', newAgentData)
            const data = res.data;
            if (data.result != 'ok') {
                toast.error(data.desc || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                return;
            }

            // setTimeout(() => window.location.reload(), 2000)
            toast.success(data.desc || 'با موفقیت انجام شد.');
            closeModal();
            await refreshData()

        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
            setShowLoader(false)
        }

    };

    const changeAgentStatus = async () => {
        setShowLoader(true)

        try {
            const res = await services.Agent.edit('?command=change_status')
            const data = res.data;
            if (data.result != 'ok') {
                toast.error(data.desc || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                return;
            }

            toast.success(data.desc || 'با موفقیت انجام شد.');
            // setTimeout(() => window.location.reload(), 2000)
            await refreshData()
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        }

    };
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex mb-8 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="mb-4 flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="overflow-hidden bg-white dark:bg-gray-dark">
                            <Avatar
                                src={agentData.agent_image || "/images/user.png"}
                                size="xxlarge"
                                status={agentStatus ? 'online' : 'offline'}
                            />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-start">
                                <span
                                    className="me-3">{agentData?.agent_gender} {agentData?.agent_name} {agentData?.agent_family}</span>
                                {agentStatus && (<Badge variant="solid" color="success">
                                    فعال
                                </Badge>)}
                                {!agentStatus && (<Badge variant="solid" color="light">
                                    غیر فعال
                                </Badge>)}
                            </h4>
                        </div>
                    </div>

                    <Button disabled={showLoader} className="text-nowrap" size={"sm"} variant="primary"
                            onClick={openModal}
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        ویرایش پروفایل
                    </Button>
                    <Button disabled={showLoader} className="text-nowrap" variant="outline" size={"sm"}
                            onClick={() => location.href = "/change-password"}
                    >
                        <LockIcon/>
                        تغییر رمز عبور
                    </Button>
                    <Button
                        disabled={showLoader}
                        className="text-nowrap"
                        variant="outline"
                        size={"sm"}
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        <InfoIcon/>
                        تغییر وضعیت
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 2xl:gap-x-32">
                    <div className="flex items-center w-full gap-6 xl:flex-row">
                        {agentData?.agent_company_logo_url && (
                            <div className="h-20 overflow-hidden bg-white">
                                <img
                                    className="h-full"
                                    height="100%"
                                    width="auto"
                                    src={agentData?.agent_company_logo_url || ''}
                                    alt="user"
                                />
                            </div>
                        )}
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-start">
                                <span className="me-3">{agentData?.agent_company_name}</span>
                            </h4>
                            <div
                                className="flex items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-start">
                                <p className=" text-gray-500 dark:text-gray-400">
                                    {agentData?.agent_state_name}
                                </p>
                                <div className="h-3.5 w-px bg-gray-300 dark:bg-gray-700"></div>
                                <p className=" text-gray-500 dark:text-gray-400">
                                    کد {agentData?.agent_code}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            ایمیل
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {agentData?.agent_email}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            شماره همراه
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {agentData?.agent_mobile}
                        </p>
                    </div>

                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            تلفن
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {agentData?.agent_tell}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2  leading-normal text-gray-500 dark:text-gray-400">
                            تلفن ضروری
                        </p>
                        <p className=" font-medium text-gray-800 dark:text-white/90">
                            {agentData?.agent_required_phone}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">آدرس</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_address}</p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">استان</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_state_name}</p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شهر</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_city_name}</p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">منطقه</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_sector_name}</p>
                    </div>

                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شماره حساب بانکی</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_banknum}</p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">نام بانک</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_bankname}</p>
                    </div>
                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">شماره شبا</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_banksheba}</p>
                    </div>

                    <div>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">تاریخ ثبت نام</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">{calculateTimestamp(agentData?.agent_register_date || null)}</p>
                    </div>
                    {/*<div className={'col-span-3'}>*/}
                    {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">موقعیت روی نقشه</p>*/}
                    {/*    <p className="font-medium text-gray-800 dark:text-white/90">{agentData?.agent_lat} - {agentData?.agent_long}</p>*/}
                    {/*</div>*/}

                    <div className={'col-span-3'}>
                        <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">موقعیت روی نقشه</p>
                        <AgentLocationMap
                            position={{
                                lat: Number(agentData?.agent_lat) || 35.6892, // مقدار پیش‌فرض تهران
                                lng: Number(agentData?.agent_long) || 51.3890,
                            }}
                            editable={false}
                        />
                    </div>

                    {/*<div>*/}
                    {/*    <p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">وضعیت کاربر</p>*/}
                    {/*    <p className="font-medium text-gray-800 dark:text-white/90">*/}
                    {/*        {agentData?.agent_deactive === "1" ? "غیرفعال" : "فعال"}*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                </div>

                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div
                        className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pl-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                ویرایش مشخصات
                            </h4>
                            {/*<p className="mb-6  text-gray-500 dark:text-gray-400 lg:mb-7">*/}
                            {/*    Update your details to keep your profile up-to-date.*/}
                            {/*</p>*/}
                        </div>
                        <form className="flex flex-col">
                            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                                <div className="mt-7">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>تلفن ضروری</Label>
                                            <Input type="tel" defaultValue={agentData?.agent_required_phone || 0}
                                                   onChange={(e) => setNewAgentData({
                                                       ...newAgentData,
                                                       agent_required_phone: e.target.value
                                                   })}/>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>تلفن</Label>
                                            <Input type="tel" defaultValue={agentData?.agent_tell || 0}
                                                   onChange={(e) => setNewAgentData({
                                                       ...newAgentData,
                                                       agent_tell: e.target.value
                                                   })}/>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>ایمیل</Label>
                                            <Input type="email" defaultValue={agentData?.agent_email || ''}
                                                   onChange={(e) => setNewAgentData({
                                                       ...newAgentData,
                                                       agent_email: e.target.value
                                                   })}/>
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>منطقه</Label>
                                            <Input type="text" defaultValue={agentData?.agent_sector_name || ''}
                                                   onChange={(e) => setNewAgentData({
                                                       ...newAgentData,
                                                       agent_sector_name: e.target.value
                                                   })}/>
                                        </div>
                                        <div className="col-span-2 lg:col-span-2">
                                            <Label>آدرس</Label>
                                            <Input type="text" defaultValue={agentData?.agent_address || ''}
                                                   onChange={(e) => setNewAgentData({
                                                       ...newAgentData,
                                                       agent_address: e.target.value
                                                   })}/>
                                        </div>
                                        <div className="col-span-2 lg:col-span-2">
                                            {/*<Label>آدرس</Label>*/}
                                            <AgentLocationMap
                                                position={markerPosition}
                                                editable={true}
                                                onChange={({ lat, lng }) => {
                                                    setMarkerPosition({ lat, lng });
                                                    setNewAgentData({
                                                        ...newAgentData,
                                                        agent_lat: lat,
                                                        agent_long: lng,
                                                    });
                                                }}
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                                <Button className="px-8" size="sm" onClick={handleSave} loading={showLoader}
                                        disabled={showLoader}>
                                    ثبت
                                </Button>
                                <Button className="px-8" size="sm" variant="outline" onClick={cancelSave}>
                                    لغو
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="max-w-[400px] m-4">
                    <div className="p-6 text-center">
                        <InfoIcon className="mx-auto mb-4 text-yellow-500" width={40} height={40} />
                        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                            تغییر وضعیت کاربر
                        </h4>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            آیا از تغییر وضعیت کاربر اطمینان دارید؟
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="primary"
                                onClick={async () => {
                                    setIsConfirmOpen(false);
                                    await changeAgentStatus();
                                }}
                                disabled={showLoader}
                            >
                                تایید
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={showLoader}
                            >
                                انصراف
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}
