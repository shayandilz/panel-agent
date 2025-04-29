"use client";

import React, {useState} from "react";
import ImageUploading, {ImageListType} from "react-images-uploading";
import services from "@/core/service";
import {images} from "next/dist/build/webpack/config/blocks/images";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import {toast} from "react-toastify";

interface ImageUploaderProps {
    value: ImageListType;
    onChange: (imageList:any) => void;
    acceptType?: string[];
    name: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         value,
                                                         onChange,
                                                         acceptType = ["jpg", "jpeg", "png"],
                                                         name,
                                                     }) => {
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [newImageList, setNewImageList] = useState(value);

    const handleUpload = async (index: number) => {
        const image = value[index];
        if (!image?.file_url) return;

        console.log('handleUpload',image)

        setUploadingIndex(index);

        try {
            const formData = new FormData();
            // formData.append('command', 'uploadpic');
            formData.append('image', image.file_url);
            // formData.append('image_name', image.title || '');
            // formData.append('image_desc', image.description || '');

            const response = await services.Requests.sendImage('?command=uploadpic', formData);

            if (response?.data?.result === "ok") {

                const updatedImages = [{
                    ...response.data.data,
                    isUploaded: true
                }];
                console.log(updatedImages)
                onChange(updatedImages);
            } else {
                toast.error(response?.data?.desc || "مشکلی پیش آمد. دوباره تلاش کنید.");
            }
        } catch (error) {
            toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
            console.error("Upload failed:", error);
        } finally {
            setUploadingIndex(null);
        }
    };

    // const handleMetadataChange = (index: number, field: string, val: string) => {
    //     newImageList[index] = {
    //         ...value[index],
    //         ...newImageList[index],
    //         [field]: val
    //     }
    //     console.log(newImageList[index])
    // };

    return (
        <ImageUploading
            value={value}
            onChange={onChange}
            maxNumber={1}
            dataURLKey="file_url"
            acceptType={acceptType}
            multiple={false}
        >
            {({
                  imageList,
                  onImageUpload,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
              }) => (
                <div className="flex flex-col gap-3">
                    <div>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded border ${
                                isDragging ? "border-blue-500" : "border-gray-300"
                            }`}
                            {...dragProps}
                            onClick={onImageUpload}
                        >
                            {imageList.length > 0 ? 'تغییر تصویر' : 'انتخاب تصویر'}
                        </button>
                    </div>

                    {imageList.map((image, index) => (
                        <div key={index} className="w-full border border-gray-200 rounded-xl dark:border-gray-700 p-3">
                            <div className="mb-4">
                                <img
                                    src={image.file_url}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded"
                                />
                            </div>

                            <div className="space-y-2">
                                {/*<Input*/}
                                {/*    type="text"*/}
                                {/*    placeholder="عنوان تصویر"*/}
                                {/*    className="w-full p-2 border rounded"*/}
                                {/*    value={image.title || ''}*/}
                                {/*    onChange={(e) => handleMetadataChange(index, 'title', e.target.value)}*/}
                                {/*/>*/}

                                {/*<TextArea*/}
                                {/*    placeholder="توضیحات تصویر"*/}
                                {/*    className="w-full p-2 border rounded"*/}
                                {/*    value={image.description || ''}*/}
                                {/*    onChange={(val) => handleMetadataChange(index, 'description', val)}*/}
                                {/*/>*/}

                                <div className="flex gap-2">
                                    <Button
                                        className="px-3 py-1"
                                        onClick={() => handleUpload(index)}
                                        disabled={uploadingIndex === index}
                                    >
                                        {uploadingIndex === index ? 'در حال آپلود...' : 'آپلود تصویر'}
                                    </Button>

                                    <Button
                                        variant={"outline"}
                                        className="px-3 py-1 bg-red-500"
                                        onClick={() => onImageRemove(index)}
                                    >
                                        حذف
                                    </Button>
                                </div>

                                {/*{image.image_code && (*/}
                                {/*    <p className="text-sm text-green-600 mt-2">*/}
                                {/*        کد تصویر: {image.image_code}*/}
                                {/*    </p>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ImageUploading>
    );
};

export default ImageUploader;
