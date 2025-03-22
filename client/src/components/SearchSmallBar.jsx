import React, { use, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { TbCurrentLocation, TbCurrentLocationOff } from "react-icons/tb";


const shopNames = ["Clothing", "Supermarket", "Footware", "Grocery Mart", "Pharmacy", "Book", "Library", "Bakery", "Restaurant", "Cafe", "Fast Food", "Accessories", "Mobile", "Hair Salon", "Others"];

const SearchSmallBar = ({ setSidebarData, listings, setLoading, setDistance }) => {
    const [shop, setShop] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    // const [distance, setDistance] = useState([]);
    const [flag, setFlag] = useState(false);

    const navigate = useNavigate();

    // Filter and sort items based on search term
    const filteredItems = shopNames
        .filter((item) => item.toLowerCase().includes(shop.toLowerCase()))
        .sort();

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setSidebarData((prevData) => ({ ...prevData, shop: value }));
        setShop(value);
        setShowResults(value.length > 0); // Show results only when typing
    };

    // Handle item selection
    const handleSelect = (item) => {
        setShop(item);
        setShowResults(false); // Hide results after selection
    };

    // Handle form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('shop', shop);



        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    const getUserLocation = () => {
        setLoading(true);
        console.log("working1")

        if ("geolocation" in navigator) {
            // console.log("working2")
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    setUserLocation({ lat: userLat, lon: userLon });

                    // Calculate the distance
                    if (listings.length === 0) {
                        setLoading(false);
                        setFlag(false);
                    } else {
                        setFlag(true);
                    }

                    // console.log("working3")
                    for (let i = 0; i < listings.length; i++) {
                        const listingLat = listings[i].latitude;
                        const listingLon = listings[i].longitude;
                        const calculatedDistance = haversineDistance(userLat, userLon, listingLat, listingLon);
                        setDistance((prevDistances) => [...prevDistances, { listingId: listings[i].id, distance: calculatedDistance }]);

                    }
                    setLoading(false);
                },
                (error) => {
                    setLoading(false);
                    setFlag(false);
                    console.error("Error getting location:", error);
                    alert("Please enable location access.");
                }
            );
        } else {
            // setLoading(false);
            setFlag(false);
            alert("Geolocation is not supported by this browser.");
        }
    };
    // Haversine Formula to calculate distance
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (angle) => (angle * Math.PI) / 180;
        const R = 6371; // Radius of Earth in kilometers

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); // Distance in kilometers (rounded to 2 decimal places)
    };


    useEffect(() => {

        if (userLocation === null) {
            getUserLocation();
        }
    }, [!userLocation]);
    // useEffect(() => {
    // }, []);

    return (

        <div className="flex flex-col relative items-center justify-center bg-gray-100">


            <form onSubmit={handleSearchSubmit} className=' flex items-center justify-center  '>
                <div className=' bg-slate-100 border-2 border-[#04c5eb] px-1 py-1 sm:p-2 rounded-lg flex items-center '>

                    <div className='flex p-2 items-center cursor-pointer'>
                        {!flag ? (
                            <TbCurrentLocationOff size={24} onClick={getUserLocation} />
                        ) : (
                            <TbCurrentLocation size={24} onClick={getUserLocation} color="#04c5eb" />
                        )}
                        {/* <TbCurrentLocationOff size={24} onClick={getUserLocation} /> */}

                    </div>
                    <input
                        type="text"
                        placeholder="Search shop..."
                        value={shop}
                        onChange={handleChange}
                        className="border-r-2 border-blue-500 outline-none bg-transparent focus:outline-none lg:w-[35rem] md:w-[26rem] w-[10rem]  text-[20px] "
                    />
                    {/* <input
                        type="text"
                        placeholder="Search for an item..."
                        value={shop}
                        onChange={handleChange}
                        className="border-r-2 border-blue-500 outline-none p-2 bg-transparent focus:outline-none pl-10 lg:w-[35rem] md:w-[26rem] w-[20rem] text-[20px] "
                    /> */}

                    {/* Search Results - Show only if searchTerm exists */}
                    {showResults && filteredItems.length > 0 && (
                        <div className=" absolute z-10 top-[80%]   mt-2 w-80 bg-white shadow-lg rounded-lg ">
                            {filteredItems.map((item, index) => (
                                <p
                                    key={index}
                                    onClick={() => handleSelect(item)}
                                    className="p-3 border-b last:border-none hover:bg-gray-200 cursor-pointer"
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                    )}
                    <button type="submit" className="bg-blue-700 p-2 sm:p-3 rounded-lg mx-2">

                        <FaSearch className='text-slate-100 cursor-pointer ' />
                    </button>
                </div>
            </form>


        </div>

    );
};

export default SearchSmallBar;
