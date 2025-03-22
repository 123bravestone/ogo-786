import { useState, useEffect } from "react";

// Default Shops Data (Latitude & Longitude)
const defaultShops = [
    { id: 1, name: "Grocery Store", lat: 28.7041, lon: 77.1025, address: "Delhi" },
    { id: 2, name: "Clothing Shop", lat: 19.076, lon: 72.8777, address: "Mumbai" },
    { id: 3, name: "Footwear Store", lat: 22.5726, lon: 88.3639, address: "Kolkata" },
    { id: 4, name: "Electronics Hub", lat: 13.0827, lon: 80.2707, address: "Chennai" },
];

// Function to calculate distance using Haversine formula
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

const ShopList = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [sortedShops, setSortedShops] = useState(defaultShops);

    // Function to get user location
    const fetchUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Sort shops when user location is available
    useEffect(() => {
        if (userLocation) {
            const sorted = [...defaultShops].sort((a, b) => {
                const distanceA = getDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
                const distanceB = getDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
                return distanceA - distanceB;
            });
            setSortedShops(sorted);
        }
    }, [userLocation]);

    return (
        <div className=" bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Nearest Shops</h1>

            {/* Fetch Location Button */}
            <button
                onClick={fetchUserLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
            >
                Get My Location
            </button>

            {/* Shop Listing */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedShops.map((shop) => (
                    <div key={shop.id} className="bg-white p-4 shadow rounded-lg">
                        <h2 className="text-lg font-semibold">{shop.name}</h2>
                        <p className="text-gray-600">{shop.address}</p>
                        {userLocation && (
                            <p className="text-sm text-gray-500">
                                Distance: {getDistance(userLocation.lat, userLocation.lon, shop.lat, shop.lon).toFixed(2)} km
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopList;
