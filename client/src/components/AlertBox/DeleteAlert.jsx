import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteAlert = ({ shopName, listingId, onCancel, setDeletElement, setError, setUserListing, userID }) => {
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();


    const handleDeleteConfirm = async (listindId) => {
        try {
            setDeletElement(true)
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/listing/delete-list-item/${listindId}`, { _id: userID }).then(async (res) => {
                if (res.data) {
                    setDeletElement(false)
                    setUserListing((prev) =>
                        prev.filter((listing) => listing._id !== listindId)
                    );
                }
            })

            navigate("/", { replace: true });
        } catch (error) {
            setDeletElement(false)
            setError(error.message)
            // console.log(error.message);

        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur  bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold text-red-600 mb-2">Confirm Deletion</h2>
                <p className="text-red-600 mb-4">
                    You can not create a new listing after deleting <strong className="font-semibold text-gray-600"><br />'{shopName}'</strong>
                    <span className="text-gray-600"> Please enter the shop name below to confirm.</span>
                </p>

                <input
                    type="text"
                    className="border-2 border-red-400 outline-none p-2 w-full rounded"
                    placeholder="Enter shop name to confirm"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className={`px-4 py-2 text-white rounded ${inputValue === shopName ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={inputValue !== shopName}
                        onClick={() => handleDeleteConfirm(listingId)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;
