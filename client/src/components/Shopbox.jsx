
import { use, useEffect, useState } from "react";
import { FaArrowRightLong, FaClock, FaLocationDot, FaMapPin, FaShop } from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";

import WhatsAppButton from "./whatsappLoc";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth’s radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const ShopBox = ({ listing }) => {

    const [flag, setFlag] = useState(false);
    const { userLocation } = useSelector((state) => state.user2);

    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % listing.imageUrls.length);
        setTimeout(() => {
            setFlag(true);
        }, 5000);
    };

    useEffect(() => {
        // console.log("flag", listing.coordinates)
        if (flag) {
            setFlag(false);
            setCurrentImage(0);
        }
        // console.log("work", listing)
    }, [flag]);



    return (
        <div className=" bg-white shadow-lg rounded-[20px] overflow-hidden flex flex-col md:flex-row ">
            {/* Image Section */}
            <div className="relative bg-center bg-cover bg-no-repeat overflow-hidden w-full md:w-[300px] h-[300px]  md:h-[250px] ">
                <p className="absolute top-0 left-0 bg-black text-white text-[12px] opacity-75 p-2 rounded-tl-[20px] rounded-br-[16px] z-10">{listing.imageUrls.length - currentImage}/ {listing.imageUrls.length}</p>
                <Link to={`/listing/${listing._id}`}>
                    <div
                        className="flex w-full h-full transition-transform duration-700 ease-in-out "
                        style={{ transform: `translateX(-${currentImage * 100}%)` }}
                    >
                        {listing.imageUrls.length > 0 && (
                            listing.imageUrls.map((image, index) => (
                                <div
                                    key={index}

                                    className="w-full h-[full] flex overflow-hidden justify-center flex-shrink-0 ">
                                    <img key={index} src={image.url} alt="Listing Image" loading='lazy' className="w-full h-full object-cover rounded-[20px]" />
                                </div>
                            ))
                        )}
                        {/* <img src={listing.images[currentImage]} alt="listingImg" className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg" /> */}
                    </div>
                </Link>
                {listing.imageUrls.length > 1 && (
                    <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-0 bg-black text-white p-2 rounded-l-[20px] opacity-75 hover:opacity-100"
                    >
                        <FaArrowRightLong size={20} />
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-row justify-between">
                    <h2 className="text-lg font-bold text-gray-800">{listing.shopname}</h2>
                    <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">{listing.shoptype} <FaShop size={20} color="blue" /></p>
                </div>
                <div className="flex flex-row justify-between gap-2 my-2">
                    <p className="text-sm font-semibold flex items-center gap-2 text-gray-600"> <FaLocationDot size={20} color="blue" /> {listing.address}</p>
                    <p className="text-sm font-semibold text-gray-600 flex items-start gap-1"><FaMapPin size={20} color="blue" /> {userLocation && getDistance(userLocation.lat, userLocation.lon, listing.location.coordinates[1], listing.location.coordinates[0]).toFixed(2)}km <span>{userLocation && listing.location.coordinates[0] > userLocation.lon ? "east" : "west"}</span></p>
                </div >
                <div className="flex flex-row justify-between gap-2 ">

                    <p className=" text-gray-500 text-sm">
                        {listing.description}
                    </p>

                </div>
                {listing.isOpen ? (
                    <p className="mt-2 flex items-center gap-2 text-green-600 font-semibold  "><FaClock size={20} color="blue" /> Open: {" "}{listing.openTime} {listing.otime} - {listing.closeTime} {listing.ctime}</p>
                ) : (
                    <p className="mt-2 flex items-center gap-2 text-red-600 font-semibold  "><FaClock size={20} color="red" /> Closed </p>
                )}
                <div className="flex justify-end items-start h-full">
                    <WhatsAppButton listingID={listing._id} phoneNumber={listing.whatsAppNo} latitude={listing.latitude} longitude={listing.longitude} home={true} />
                </div>
                {listing.offer && (
                    <div className="flex mt-2">
                        <p

                            className="bg-blue-500  text-white px-2 py-1 rounded-lg text-[16px] md:text-[14px] font-semibold flex items-center gap-2"><BiSolidDiscount size={30} />{listing.discountOffer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopBox;