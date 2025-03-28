import { useState } from "react";
import axios from "axios";

const LocationBox = ({ setFormData, formData }) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get User's Current Location
    const getCurrentLocation = () => {
        setError("");
        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toFixed(6));
                setLongitude(position.coords.longitude.toFixed(6));
                setLoading(false);
                setFormData({
                    ...formData, latitude: position.coords.latitude.toFixed(6), longitude: position.coords.longitude.toFixed(6), address: "",
                });
                setAddress("");
            },
            (error) => {
                setError("Please enable location access.");
                setLoading(false);
            }
        );
    };

    // Fetch Address using LocationIQ API
    const fetchAddress = async () => {
        if (!latitude || !longitude) return;

        setLoading(true);
        setError("");

        try {
            const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY; // Ensure API Key is stored in .env file
            const response = await axios.get(
                `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
            );
            setFormData({
                ...formData, address: response.data.display_name
            });
            setAddress(response.data.display_name);
        } catch (err) {
            setError("Failed to fetch address. Check API key or network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Location Finder</h2>

            {/* Latitude Input */}
            <input
                type="number"
                className="w-full p-2 border border-blue-500 outline-none rounded mb-2"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => {
                    setLatitude(e.target.value);
                    setFormData({ ...formData, latitude: e.target.value, address: "" })
                }}
                required
            />

            {/* Longitude Input */}
            <input
                type="number"
                className="w-full p-2 border border-blue-500 outline-none rounded mb-2"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => {
                    setLongitude(e.target.value);
                    setFormData({ ...formData, longitude: e.target.value, address: "" })
                }}
                required
            />

            {/* Get Current Location Button */}
            <button
                type="button"
                className="w-full p-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600 transition"
                onClick={getCurrentLocation}
                disabled={loading}
            >
                {loading ? "Getting Location..." : "Get Current Location"}
            </button>

            {/* Address Input */}
            <input
                type="text"
                className="w-full p-2 border border-blue-500 outline-none rounded mb-2"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => {

                    setAddress(e.target.value);
                    setFormData({ ...formData, address: e.target.value })
                }
                }
                required
            />

            {/* Add Address Button (Disabled if Lat/Lon is Empty) */}
            <button
                type="button"
                className={`w-full p-2 text-white rounded ${latitude && longitude
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                    } transition`}
                onClick={fetchAddress}
                disabled={!latitude || !longitude}
            >
                {loading ? "Fetching Address..." : "Add Address"}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default LocationBox;
