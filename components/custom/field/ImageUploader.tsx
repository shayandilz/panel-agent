"use client";

import React, {useState} from "react";
import ImageUploading, {ImageListType} from "react-images-uploading";
import services from "@/core/service";

interface ImageUploaderProps {
    value: ImageListType;
    onChange: (imageList: ImageListType) => void;
    maxNumber?: number;
    acceptType?: string[];
    name: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         value,
                                                         onChange,
                                                         maxNumber = 1,
                                                         acceptType = ["jpg", "jpeg", "png"],
                                                         name,
                                                     }) => {
    const [imageIsLoading, setImageIsLoading] = useState(false);
    const uploadImage = async (selectedImage) => {
        setImageIsLoading(true)
        let imageFormData = new FormData()
        imageFormData.append('command', 'uploadpic')
        imageFormData.append('image', selectedImage)
        // imageFormData.append('image_name', 'test')
        // imageFormData.append('image_desc', 'test')
        // imageFormData.append('name', 'test')
        const response = await services.Requests.sendImage('', imageFormData)
        if (response?.data?.result === "ok") {
            // setFormData({...formData, image_code: response.data?.data?.image_code})
            // setSelectedImage(null)
            setImageIsLoading(false)

            // {
            //     "image_code": "1745333082EbOh6vUs",
            //     "file_url": "https://api.rahnamayefarda.ir/filefolder/uploadimg/2025/04/22/1745333082EbOh6vUs.jpg",
            //     "file_t_url": "https://api.rahnamayefarda.ir/filefolder/uploadimg/2025/04/22/t1745333082EbOh6vUs.jpg"
            // }
        } else {
            throw new Error(response?.data?.desc || "مشکلی پیش آمد.");
            setImageIsLoading(false)
        }
    }

    return (

        <ImageUploading
            multiple
            value={value}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="file_url"
            acceptType={acceptType}
        >

            {({
                  imageList,
                  onImageUpload = () => {
                      console.log('onImageUpload')
                  },
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
              }) => (
                <div className="flex flex-col gap-3">
                    <div>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded border ${isDragging ? "border-blue-500" : "border-gray-300"}`}
                            style={isDragging ? {color: "red"} : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            انتخاب یا کشیدن تصویر
                        </button>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 rounded border border-red-300 text-red-600"
                            onClick={onImageRemoveAll}
                        >
                            حذف همه تصاویر
                        </button>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {imageList.map((image, index) => (
                            <div key={index} className="relative flex flex-col items-center">
                                <img src={image.file_url} alt="" width="100" className="rounded"/>
                                <div className="flex gap-2 mt-2">
                                    <button type="button" onClick={() => onImageUpdate(index)}
                                            className="text-blue-500">ویرایش
                                    </button>
                                    <button type="button" onClick={() => onImageRemove(index)}
                                            className="text-red-500">حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ImageUploading>
    );
};

export default ImageUploader;
