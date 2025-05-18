"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/custom/tables";
import services from "@/core/service";
import { toast } from "react-toastify";

interface CouncilComment {
    agent_code: string;
    requestcouncil_id: string;
    requestcouncil_timestamp: string;
    requestcouncil_desc: string;
    agent_name: string;
    agent_family: string;
    employee_name: string;
    employee_family: string;
    requestcouncil_image: string | null;
}

interface Props {
    requestId: string;
    agentId: string;  // you need to provide agentId as prop or get from context/cookie
}

export default function CouncilCommentsTable({ requestId, agentId }: Props) {
    const [comments, setComments] = useState<CouncilComment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [commentText, setCommentText] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchCouncilComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = `?command=getcouncilrequest&request_id=${requestId}`;
            const res = await services.Requests.getReport(payload);

            if (res.data.result === "ok") {
                setComments(res.data.data);
            } else {
                setError(res.data.desc || "خطا در دریافت داده‌ها");
                toast.error(res.data.desc || "خطا در دریافت داده‌ها");
            }
        } catch (e: any) {
            setError(e.message || "خطا در دریافت داده‌ها");
            toast.error(e.message || "خطا در دریافت داده‌ها");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (requestId) {
            fetchCouncilComments();
        }
    }, [requestId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setImageFile(null);
            return;
        }

        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
            toast.error("فرمت فایل انتخابی معتبر نیست. لطفا jpg، png یا gif انتخاب کنید.");
            e.target.value = "";
            setImageFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("حجم فایل بیش از ۵ مگابایت است.");
            e.target.value = "";
            setImageFile(null);
            return;
        }

        setImageFile(file);
    };


    const handleSubmit = async () => {
        if (!commentText.trim()) {
            toast.error("لطفا متن کامنت را وارد کنید");
            return;
        }
        if (!agentId) {
            toast.error("شناسه نماینده نامشخص است");
            return;
        }

        setSubmitting(true);

        try {
            let imageCode = null;

            // 1. Upload image if provided
            if (imageFile) {
                const formData = new FormData();
                formData.append("command", "uploadpic");
                formData.append("image", imageFile);
                formData.append("image_name", "تصویر کامنت های");
                formData.append("image_desc", "تصویر اضافه شده به کامنت های کارمندان صدور");
                formData.append("name", "");

                const uploadRes = await services.Requests.sendImage("", formData);

                if (uploadRes.data?.result === "ok" && uploadRes.data?.data?.image_code) {
                    imageCode = uploadRes.data.data.image_code;
                } else {
                    toast.error("خطا در بارگذاری تصویر");
                    setSubmitting(false);
                    return;
                }
            }

            // 2. Send the comment with optional image_code
            const addPayload = {
                command: "addcouncilrequest",
                request_id: requestId,
                agent_id: agentId,
                requestcouncil_desc: commentText,
                requestcouncil_image_code: imageCode || "",
            };

            const addRes = await services.Requests.sendRequestForm("", addPayload);

            if (addRes.data?.result === "ok") {
                toast.success("کامنت با موفقیت ارسال شد");
                setCommentText("");
                setImageFile(null);
                fetchCouncilComments(); // refresh the list
            } else {
                toast.error(addRes.data?.desc || "خطا در ارسال کامنت");
            }
        } catch (error: any) {
            toast.error(error.message || "خطا در ارسال کامنت");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>در حال دریافت نظرات شورا...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <>
            <Table className="w-full mb-6">
                <TableHeader>
                    <TableRow>
                        <TableCell isHeader>ردیف</TableCell>
                        <TableCell isHeader>کاربر</TableCell>
                        <TableCell isHeader>کد نماینده</TableCell>
                        <TableCell isHeader>نماینده</TableCell>
                        <TableCell isHeader>توضیحات</TableCell>
                        <TableCell isHeader>عکس</TableCell>
                        <TableCell isHeader>تاریخ</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.map((comment, idx) => (
                        <TableRow key={comment.requestcouncil_id}>
                            <TableCell isHeader>{idx + 1}</TableCell>
                            <TableCell>{comment.agent_name} {comment.agent_family}</TableCell>
                            <TableCell>{comment.agent_code}</TableCell>
                            <TableCell>{comment.employee_name} {comment.employee_family}</TableCell>
                            <TableCell>{comment.requestcouncil_desc || "-"}</TableCell>
                            <TableCell>
                                {comment.requestcouncil_image ? (
                                    <Image
                                        src={comment.requestcouncil_image}
                                        alt={comment.requestcouncil_desc || "Council Image"}
                                        width={60}
                                        height={60}
                                        className="rounded-md"
                                    />
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell>{comment.requestcouncil_timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="p-4 border border-gray-300 rounded-md dark:border-gray-700 max-w-lg mx-auto">
                <h3 className="mb-3 font-semibold text-lg">افزودن کامنت جدید</h3>

                <label htmlFor="comment-text" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    متن توضیحات
                </label>
                <textarea
                    id="comment-text"
                    className="w-full p-2 mb-3 border rounded-md resize-none dark:bg-gray-800 dark:text-white"
                    placeholder="متن کامنت خود را وارد کنید..."
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={submitting}
                />

                <label htmlFor="image-upload" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    بارگذاری تصویر (اختیاری)
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleImageChange}
                    disabled={submitting}
                    className="mb-1 bg-success-600 p-3 rounded-2xl"
                />

                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                    فرمت‌های قابل قبول: JPG, PNG, GIF &nbsp;|&nbsp; حداکثر حجم فایل: ۵ مگابایت
                </p>

                {/* Show validation error if needed */}
                {imageFile && imageFile.size > 5 * 1024 * 1024 && (
                    <p className="mb-3 text-red-600 dark:text-red-400 font-medium">
                        حجم فایل بیش از ۵ مگابایت است. لطفاً فایل کوچکتر انتخاب کنید.
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={submitting || (!!imageFile && imageFile.size > 5 * 1024 * 1024)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "در حال ارسال..." : "ارسال کامنت"}
                </button>
            </div>

        </>
    );
}
