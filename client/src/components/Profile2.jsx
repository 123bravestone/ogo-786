import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../app/user/userSlice";


const ProfileUser = () => {
    // const [imageUrl, setImageUrl] = useState("");
    // const [publicId, setPublicId] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [borderColor, setBorderColor] = useState("border-gray-300"); // Default border color
    const [successMessage, setSuccessMessage] = useState("");

    const { currentUser } = useSelector((state) => state.user);
    const dispatchEvent = useDispatch();


    // Handle Image Upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
            setError("File size must be less than 4MB.");
            return;
        }


        setError("");
        setSuccessMessage(""); // Reset success message
        setBorderColor("border-yellow-500"); // Change
        const formData = new FormData();
        formData.append("_id", currentUser._id);
        formData.append("image", file);
        // formData.append("oldPublicId", currentUser.publicId);

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {

                    setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                },
            });

            dispatchEvent(signInSuccess(response.data))

            // setImageUrl(response.data.imageUrl);
            // setPublicId(response.data.publicId);
            // setUploadProgress(100);

            setSuccessMessage("Image uploaded successfully!"); // Show success message
            setBorderColor("border-green-500"); // Change border to green on success
        } catch (error) {
            setError("Image upload failed. Try again.");

            setBorderColor("border-red-500");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            {/* Profile Image Box */}
            <label className="relative cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div
                    className={`w - 24 h - 24 rounded - full border - 4 ${ borderColor } flex items - center justify - center overflow - hidden transition - all duration - 300`}
                    onClick={() => setBorderColor("border-yellow-500")} // Change border to yellow on click
                >
                    {currentUser.imageUrl ? (
                        <img src={currentUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-sm">Upload</span>
                    )}
                </div>
            </label>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
                <div className="w-24 h-1 bg-gray-300 rounded">

                    <div className="h-full bg-green-500 rounded" style={{ width: `${ uploadProgress } % ` }}><span className="text-xs text-green-500">upload{" "}{uploadProgress}%</span></div>
                </div>
            )}

            {/* Success Message */}
            {successMessage && <p className="text-green-500 text-xs">{successMessage}</p>}

            {/* Error Message */}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
};

export default ProfileUser;
