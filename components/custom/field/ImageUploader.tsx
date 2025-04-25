"use client";

import React, {useState} from "react";
import ImageUploading, {ImageListType} from "react-images-uploading";
import services from "@/core/service";
import {images} from "next/dist/build/webpack/config/blocks/images";

interface ImageUploaderProps {
    value: ImageListType;
    onChange: (imageList) => void;
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
    const [newImageList, setNewImageList] = useState([]);

    const handleUpload = async (index: number) => {
        const image = value[index];
        if (!image.file) return;

        setUploadingIndex(index);

        try {
            const formData = new FormData();
            formData.append('command', 'uploadpic');
            formData.append('image', image.file);
            formData.append('image_name', image.title || '');
            formData.append('image_desc', image.description || '');

            const response = await services.Requests.sendImage('', formData);

            if (response?.data?.result === "ok") {
                const updatedImages = [{
                    ...image,
                    ...response.data.data,
                    isUploaded: true
                }];
                onChange(updatedImages);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleMetadataChange = (index: number, field: string, value: string) => {
        // const updatedImages = value.length > 0 ? [...value] : [];
        // if (updatedImages[0]) {
        let newImage = {
            ...newImageList[index],
            [field]: value
        }
        setNewImageList({
            ...newImageList,
            [index]: newImage
        })
        console.log(newImageList)
        // onChange(updatedImages);
        // }
    };

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
                        <div key={index} className="border p-4 rounded-lg">
                            <div className="mb-4">
                                <img
                                    src={image.file_url}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded"
                                />
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="عنوان تصویر"
                                    className="w-full p-2 border rounded"
                                    value={image.title || ''}
                                    onChange={(e) => handleMetadataChange(index, 'title', e.target.value)}
                                />

                                <textarea
                                    placeholder="توضیحات تصویر"
                                    className="w-full p-2 border rounded"
                                    value={image.description || ''}
                                    onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                        onClick={() => handleUpload(index)}
                                        disabled={uploadingIndex === index}
                                    >
                                        {uploadingIndex === index ? 'در حال آپلود...' : 'آپلود تصویر'}
                                    </button>

                                    <button
                                        type="button"
                                        className="px-3 py-1 text-red-500 border border-red-300 rounded"
                                        onClick={() => onImageRemove(index)}
                                    >
                                        حذف
                                    </button>
                                </div>

                                {image.image_code && (
                                    <p className="text-sm text-green-600 mt-2">
                                        کد تصویر: {image.image_code}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ImageUploading>
    );
};

export default ImageUploader;
