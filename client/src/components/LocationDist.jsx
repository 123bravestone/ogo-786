import { useState } from "react";

const DistanceCalculator = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const fixedLocation = { lat: 28.6139, lon: 77.2090 }; // Example: New Delhi, India

    // Function to get user's location
    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    setUserLocation({ lat: userLat, lon: userLon });

                    // Calculate the distance
                    const calculatedDistance = haversineDistance(
                        fixedLocation.lat,
                        fixedLocation.lon,
                        userLat,
                        userLon
                    );
                    setDistance(calculatedDistance);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Please enable location access.");
                }
            );
        } else {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-bold mb-4">Distance Calculator</h1>
            <p className="mb-2">
                <strong>Fixed Location:</strong> New Delhi, India (28.6139, 77.2090)
            </p>
            <button
                onClick={getUserLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Get My Location & Calculate Distance
            </button>

            {userLocation && (
                <div className="mt-4 text-center">
                    <p>
                        <strong>Your Location:</strong> {userLocation.lat}, {userLocation.lon}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                        Distance: {distance} km
                    </p>
                </div>
            )}
        </div>
    );
};

export default DistanceCalculator;
