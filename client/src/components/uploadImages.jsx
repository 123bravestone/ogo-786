import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import Loader from "./Loader";

const ImageUpload = ({ setUploading, setFormData, formData, creating }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        let validFiles = [];

        if (files.length > 6) {
            setError("You can only upload up to 6 images.");
            return;
        }

        for (let file of files) {
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed.");
                return;
            }

            if (file.size > 20 * 1024 * 1024) {
                setError("Each image must be less than 20MB.");
                return;
            }

            validFiles.push(file);
        }

        setError("");
        setSelectedImages(validFiles);
    };
    // useEffect(() => {
    //     console.log("images", formData.imageUrls);
    // }, [])

    const handleUpload = async () => {
        if (selectedImages.length === 0) {
            setError("Please select at least one image.");
            return;
        }

        setError("");
        setUploadProgress(0);

        const imagesData = new FormData();
        selectedImages.forEach((image) => {
            imagesData.append("images", image);
        });

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/listing/upload`, imagesData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                    setFlag(true);
                    setUploading(true);

                },
            });

            const allImages = response.data.images;
            // console.log("all images", allImages);
            Promise.all(allImages).then((images) => {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrls: images.map((image) => { return { url: image.url, publicId: image.publicId } }),
                }));
            })

            // setUploadedImages(response.data.images);
            setFlag(false);
            setUploading(false)
            setSelectedImages([]);
            setUploadProgress(0);
        } catch (error) {
            setFlag(false);
            setUploading(false)
            setError(error.response?.data?.error || "Upload failed. Please try again.");
        }
    };

    const handleDelete = async (publicId, index) => {
        try {
            setLoading(true)
            await axios.post(`${import.meta.env.VITE_APP_API_URL} / api / listing / delete `, { publicId });
            // setUploadedImages((prevImages) => prevImages.filter((img) => img.publicId !== publicId));
            // console.log("deleted", index, publicId);

            setFormData((prevFormData) => ({
                ...prevFormData,
                imageUrls: prevFormData.imageUrls.filter((img, i) => i !== index),
            }))
            setLoading(false)
        } catch (error) {
            setError("Failed to delete image.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            {loading && <Loader />}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Images (Max: 6, Less than 20MB)</h2>

            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="block cursor-pointer border-2 border-dashed border-gray-400 p-6 text-center rounded-lg bg-gray-50 hover:border-blue-500">
                Click to select images (Max: 6)
            </label>

            {selectedImages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedImages.map((img, index) => (
                        <img key={index} src={URL.createObjectURL(img)} alt="Preview Image" loading='lazy' className="w-24 h-24 object-cover rounded-md" />
                    ))}
                </div>
            )}

            {flag && !error ? (
                <p className="text-gray-500 text-sm mt-2">Uploading...</p>) : (
                <button type="button" onClick={handleUpload} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={selectedImages.length === 0}>
                    Upload Images
                </button>

            )}

            {uploadProgress > 0 && (
                <div className="mt-2 w-full bg-gray-200 rounded-md">
                    <div className="bg-green-500 text-xs text-center text-white p-1 rounded-md" style={{ width: `${uploadProgress} % ` }}>
                        {uploadProgress}%
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">: {error}</p>}

            <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.imageUrls.map((img, index) => (
                    <div key={index} className="relative">
                        <img src={img.url} alt="Uploaded" loading='lazy' className="w-24 h-24 object-cover rounded-md" />
                        {
                            creating && (
                                <button type="button" onClick={() => handleDelete(img.publicId, index)} className="absolute top-0 right-0 bg-red-300 hover:bg-red-600 text-gray-500 cursor-pointer hover:text-white p-1 rounded-[20px]">
                                    <MdDeleteForever size={20} />
                                </button>
                            )


                        }
                    </div>
                ))}
                {/* {uploadedImages.map((img, index) => (
                    <div key={index} className="relative">
                        <img src={img.url} alt="Uploaded" className="w-24 h-24 object-cover rounded-md" />
                        <button onClick={() => handleDelete(img.publicId)} className="absolute top-0 right-0 bg-red-300 hover:bg-red-600 text-gray-500 hover:text-white p-1 rounded-[20px]">
                            <MdDeleteForever size={20} />
                        </button>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default ImageUpload;
