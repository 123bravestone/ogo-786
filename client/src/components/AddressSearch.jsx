import React, { useState } from "react";

const AddressSearch = ({ setFormData, formData }) => {
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState("");

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6); // Keep 6 decimal places
                const lng = position.coords.longitude.toFixed(6);

                setCoordinates({ lat, lng });

                // Fetch location name from LocationIQ API
                fetch(
                    `https://us1.locationiq.com/v1/reverse.php?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`
                )
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.display_name) {
                            setFormData({
                                ...formData, address: data.display_name,
                                latitude: lat, longitude: lng
                            });
                            // setFormData({ ...formData, latitude: lat, longitude: lng });
                        } else {
                            setFormData({ ...formData, address: data.display_name });
                        }
                    })
                    .catch(() => setError("Failed to fetch location"));
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Please allow location access.");
                }
                setError("Location access denied.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Higher GPS accuracy
        );
    };

    return (
        <div className="flex flex-col items-center justify-center  ">
            <div className="w-full max-w-md shadow-lg rounded-md">
                {/* Search Box (Disabled, shows found location) */}
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    id="address"
                    value={formData.address}
                    placeholder="Your location will appear here..."
                    className="w-full p-3 border rounded-md shadow-sm text-gray-700 outline-none bg-gray-100"
                    required
                    readOnly
                />

                {/* Get Current Location Button */}
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Get Current Location
                </button>

                {/* Show Coordinates */}
                {coordinates && (
                    <div className="mt-4 p-3 bg-gray-200 rounded-md text-center">
                        <p className="text-gray-700">
                            <strong>Latitude:</strong> {coordinates.lat}
                        </p>
                        <p className="text-gray-700">
                            <strong>Longitude:</strong> {coordinates.lng}
                        </p>
                    </div>
                )}

                {/* Show Error Message */}
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default AddressSearch;
