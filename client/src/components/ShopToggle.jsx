import React, { useEffect, useState } from "react";
import axios from "axios";

const ShopToggle = ({ listingId }) => {
    const [isOpen, setIsOpen] = useState(true); // Default shop status: Open
    const [selectedReason, setSelectedReason] = useState(""); // Selected closing reason

    const [showReasons, setShowReasons] = useState(false); // Show reason list only on clicking "Close"

    // List of reasons for closing
    const closeReasons = [
        "बीस मिनट बाद खोलेंगे",
        "व्यक्तिगत कारणों से कुछ समय के लिए बंद है।",
        "लंच ब्रेक चल रहा है",
        "त्योहार या विशेष अवकाश है।",
        "दुकान का मेंटेनेंस कार्य चल रहा है।",
        "जरूरी काम से बाहर गए हैं",
        "छुट्टी का दिन है।",
        "बिजली नहीं है।",
    ];

    useEffect(() => {
        const fetchIsOpen = async () => {
            try {
                await axios.get(`http://localhost:5000/api/listing/open-shop/${listingId}`).then(async (response) => {
                    setIsOpen(response.data.isOpen);
                    if (!response.data.isOpen) {
                        setSelectedReason(response.data.closeReason);
                    } else {
                        setSelectedReason("");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchIsOpen();

    }, []);

    // Toggle shop status
    const toggleShop = async () => {

        try {
            await axios.post(`http://localhost:5000/api/listing/open-shop/${listingId}`, { closeReason: selectedReason }).then(async (response) => {
                setIsOpen(response.data.isOpen);
                if (!response.data.isOpen) {
                    setSelectedReason(response.data.closeReason);
                    setShowReasons(true); // Hide reason list after selecting

                } else {
                    setSelectedReason("");
                }
            })
        }
        catch (err) {
            console.log(err);
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        }

        if (isOpen) {
            setSelectedReason(""); // Reset reason when reopening
            // setShowReasons(true); // Hide reason list after selecting
        }
        // setIsOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col items-center justify-center  ">
            <div className="relative">
                {/* Shop Status */}
                <h2 className="text-[16px] font-semibold text-gray-700  text-center">
                    {isOpen ? "Shop is Open" : "Shop is Closed"}
                </h2>



                {/* Toggle Switch */}
                <div
                    className={`relative w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 mx-auto ${isOpen ? "bg-green-500" : "bg-red-500"
                        }`}
                    onClick={toggleShop}
                >
                    {/* Moving Circle */}
                    <div
                        className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-all duration-300 ${isOpen ? "translate-x-10" : "translate-x-0"
                            }`}
                    ></div>

                    {/* Labels */}
                    <span
                        className={`absolute left-2 text-white text-[12px] font-bold transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Open
                    </span>
                    <span
                        className={`absolute right-2 text-white text-[12px] font-bold transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        Close
                    </span>

                </div>
                {/* Selected Reason (Appears Left of Toggle) */}
                {!isOpen && selectedReason && (
                    <p className="text-red-500 font-semibold px-3 py-1 rounded-md text-sm shadow-md">
                        {selectedReason}
                    </p>
                )}

                {/* Show Reasons if Shop is Closed */}
                {!isOpen && (
                    <div className="mt-4 relative">
                        {/* Show button to select reason */}
                        {showReasons && (
                            // Reason List
                            <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg p-3 z-10">
                                <h3 className="text-gray-700 font-medium mb-2 text-center">
                                    Select Closing Reason
                                </h3>
                                <div className="space-y-2">
                                    {closeReasons.map((reason, index) => (
                                        <button
                                            key={index}
                                            className={`block w-full p-2 border rounded-md transition-all duration-300 ${selectedReason === reason
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                            onClick={() => {
                                                setSelectedReason(reason);
                                                setShowReasons(false); // Hide reason list after selection
                                            }}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopToggle;
