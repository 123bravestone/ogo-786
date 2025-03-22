import { FaSearch } from "react-icons/fa"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TbCurrentLocation, TbCurrentLocationOff } from "react-icons/tb";


const cities = ["Patna", "Delhi", "Lucknow", "Muzaffarpur", "Bhopal"];
// const shopNames = ["Grocery Mart", "Footwear Hub", "Clothing Store", "Tech Haven", "Organic Market"];

// Function to calculate distance using Haversine formula
// const getDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Earth’s radius in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
// };

export default function SearchBar({ sortedShops, setSortedShops, getDistance, userLocation, getUserLocation, flag }) {


    // const [userLocation, setUserLocation] = useState(null);
    // const [sortedShops, setSortedShops] = useState(offerListings);

    // const [flag, setFlag] = useState(false);

    const navigate = useNavigate();

    const [city, setCity] = useState("");
    const [shop, setShop] = useState("");
    const [citySuggestions, setCitySuggestions] = useState(false);
    const [shopSuggestions, setShopSuggestions] = useState(false);


    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (city || shop) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('shop', shop);
            urlParams.set('city', city);



            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`);

        }

    }



    const filteredCities = cities
        .filter((item) => item.toLowerCase().includes(city.toLowerCase()))
        .sort();


    const filteredShops2 = sortedShops
        .filter((item) => item.shopname.toLowerCase().includes(shop.toLowerCase()))
        .sort();

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);
        setCitySuggestions(value.length > 0);
    };

    const handleShopChange = (e) => {
        const value = e.target.value;
        setShop(value);
        setShopSuggestions(value.length > 0);
    };
    // useEffect(() => {
    //     console.log("listing", offerListings);

    // }, []);

    // const getUserLocation = () => {
    //     setLoading(true);
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const userLat = position.coords.latitude;
    //                 const userLon = position.coords.longitude;
    //                 setUserLocation({ lat: userLat, lon: userLon });
    //                 // Calculate the distance
    //                 setFlag(true);

    //                 for (let i = 0; i < offerListings.length; i++) {
    //                     const listingLat = offerListings[i].latitude;
    //                     const listingLon = offerListings[i].longitude;
    //                     const calculatedDistance = haversineDistance(userLat, userLon, listingLat, listingLon);
    //                     setDistance((prevDistances) => [...prevDistances, { listingId: offerListings[i].id, distance: calculatedDistance }]);
    //                 }
    //                 setLoading(false);
    //             },
    //             (error) => {
    //                 setLoading(false);
    //                 setFlag(false);
    //                 console.error("Error getting location:", error);
    //                 alert("Please enable location access.");
    //             }
    //         );
    //     } else {
    //         setLoading(false);
    //         setFlag(false);
    //         alert("Geolocation is not supported by this browser.");
    //     }
    // };
    // const getUserLocation = () => {
    //     setLoading(true);
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const userLat = position.coords.latitude;
    //                 const userLon = position.coords.longitude;
    //                 setUserLocation({ lat: userLat, lon: userLon });
    //                 // Calculate the distance
    //                 setFlag(true);


    //                 setLoading(false);
    //             },
    //             (error) => {
    //                 setLoading(false);
    //                 setFlag(false);
    //                 console.error("Error getting location:", error);
    //                 alert("Please enable location access.");
    //             }
    //         );
    //     } else {
    //         setLoading(false);
    //         setFlag(false);
    //         alert("Geolocation is not supported by this browser.");
    //     }
    // };
    // Haversine Formula to calculate distance
    // const haversineDistance = (lat1, lon1, lat2, lon2) => {
    //     const toRad = (angle) => (angle * Math.PI) / 180;
    //     const R = 6371; // Radius of Earth in kilometers

    //     const dLat = toRad(lat2 - lat1);
    //     const dLon = toRad(lon2 - lon1);
    //     const a =
    //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return (R * c).toFixed(2); // Distance in kilometers (rounded to 2 decimal places)
    // };

    // useEffect(() => {
    //     setSortedShops(offerListings)
    //     if (userLocation === null) {
    //         getUserLocation();
    //     }
    // }, [!userLocation]);

    useEffect(() => {
        if (userLocation) {
            const sorted = [...sortedShops].sort((a, b) => {
                const distanceA = getDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude);
                const distanceB = getDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude);
                return distanceA - distanceB;
            });
            setSortedShops(sorted);
        }
    }, [userLocation]);





    return (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 w-full ">

            <form onSubmit={handleSearchSubmit} className=' flex items-center justify-center gap-4  mx-2 sm:m-0'>
                <div className=' bg-slate-100 border-2 border-blue-500 px-2 sm:px-3 sm:py-2 py-1 rounded-lg flex items-center'>
                    <div className='flex p-1 items-center cursor-pointer'>
                        {!flag ? (
                            <TbCurrentLocationOff size={24} onClick={getUserLocation} />
                        ) : (
                            <TbCurrentLocation size={24} onClick={getUserLocation} color="#04c5eb" />
                        )}


                    </div>

                    {/* <select name="address" onChange={(e) => setAddress(e.target.value)} id="address" className="bg-transparent focus:outline-none w-20 lg:w-40">
                        <option value="">Location</option>
                        <option value="patna">Patna</option>
                        <option value="bhagalpur">Bhagalpur</option>
                        <option value="muzaffarpur">Muzaffarpur</option>
                        <option value="gaya">Gaya</option>
                        <option value="vaishali">Vaishali</option>
                    </select> */}
                    {/* City Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter City"
                            value={city}
                            onChange={handleCityChange}
                            className="border-r-2 border-blue-500 outline-none text-[12px] sm:text-[18px] px-2 py-1 sm:py-2 w-full"

                        />
                        {citySuggestions && filteredCities.length > 0 && (
                            <div className=" absolute z-10 top-[80%]   mt-2 w-full bg-white max-h-40 overflow-y-auto shadow-lg rounded-lg ">
                                {filteredCities.map((c, idx) => (
                                    <p key={idx} onClick={() => {
                                        setCity(c);
                                        setCitySuggestions(false);
                                    }} className="p-2 hover:bg-gray-200 cursor-pointer text-[12px] sm:text-[18px]">{c}</p>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Shop Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Shop Name"
                            value={shop}
                            onChange={handleShopChange}
                            className="bg-transparent focus:outline-none text-[12px] sm:text-[18px] pl-10 lg:w-[35rem] md:w-[20rem] w-[10rem]"

                        />
                        {shopSuggestions && filteredShops2.length > 0 && (
                            <div className=" absolute z-10 top-[80%]   mt-2 w-full bg-white max-h-40 overflow-y-auto shadow-lg rounded-lg ">
                                {filteredShops2.map((listing, idx) => (
                                    <p key={idx} onClick={() => {
                                        setShop(listing.shopname);
                                        setShopSuggestions(false);
                                    }} className="p-2 hover:bg-gray-200 cursor-pointer text-[12px] sm:text-[18px]">{listing.shopname}</p>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* <input

                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}

                        placeholder='Search shop...' className='bg-transparent focus:outline-none pl-10 lg:w-[35rem] md:w-[20rem] w-[10rem]'
                    /> */}
                    <button type="submit" className="bg-blue-700 px-3 py-2 sm:p-3 rounded-lg ">

                        <FaSearch className='text-slate-100 cursor-pointer ' />
                    </button>



                </div>
            </form>

        </div>
    )
}
