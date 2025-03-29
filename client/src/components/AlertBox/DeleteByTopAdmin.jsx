import { useState } from "react";

const DeleteByTopAdmin = ({ isOpen, onClose, onDelete }) => {
    // if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-lg font-semibold text-red-600 mb-4">
                    ⚠ Attention!
                </h2>
                <p className="text-gray-700 mb-4">Are you sure you want to delete this item?</p>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteByTopAdmin;
