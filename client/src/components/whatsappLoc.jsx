import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaRegCommentDots, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const WhatsAppButton = ({ listingID, phoneNumber, latitude, longitude, home }) => {

    const [showIconOnly, setShowIconOnly] = useState(false);
    const buttonRef = useRef(null);
    // const phoneNumber = "+917667650665"; // Replace with actual phone number
    const message = "Hello! I would like to inquire about your services."; // Default message

    const openWhatsApp = () => {
        const numberW = '+91' + phoneNumber;
        const url = `https://wa.me/${numberW}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const openGoogleMaps = () => {
        if (!latitude || !longitude) {
            alert("Location coordinates are missing!");
            return;
        }
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, "_blank");
    };

    useEffect(() => {
        const updateButtonWidth = () => {
            if (buttonRef.current) {
                setShowIconOnly(buttonRef.current.offsetWidth < 200);
                // console.log(buttonRef.current.offsetWidth)
            }
        };

        updateButtonWidth(); // Initial check
        window.addEventListener("resize", updateButtonWidth); // Update on resize

        return () => window.removeEventListener("resize", updateButtonWidth);
    }, []);
    return (
        <div className="flex flex-row items-center justify-center gap-2 mt-2">
            {home ? (
                <Link to={`/listing/review&rate/${listingID}`}
                    ref={buttonRef}
                    className="bg-blue-500 hover:bg-blue-600  text-white px-6 py-2 rounded-lg text-[16px] md:text-[14px] font-semibold flex items-center gap-2">{showIconOnly ? <FaRegCommentDots size={20} /> : <><FaRegCommentDots size={24} />
                        User reviews</>}</Link>


            ) : (
                <button
                    ref={buttonRef}
                    onClick={openGoogleMaps}
                    className="bg-blue-500 hover:bg-blue-600  text-white px-6 py-2 rounded-lg text-[16px] md:text-[14px] font-semibold flex items-center gap-2  shadow-md transition-all"
                >
                    {showIconOnly ? <FaMapMarkerAlt size={20} /> : <><FaMapMarkerAlt size={24} />
                        View Map Location</>}
                </button>
            )}
            <button
                ref={buttonRef}

                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600  text-white px-6 py-2 rounded-lg text-[16px] md:text-[14px] font-semibold flex items-center gap-2 md:gap-0"
            >
                {showIconOnly ? <FaWhatsapp size={20} /> : <><FaWhatsapp size={24} />
                    Chat on WhatsApp</>}
            </button>


        </div>
    );
};

export default WhatsAppButton;
