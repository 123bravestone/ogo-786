import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationView = ({ latitude, longitude }) => {
  // Function to open Google Maps with Lat & Long
  const openGoogleMaps = () => {
    if (!latitude || !longitude) {
      alert("Location coordinates are missing!");
      return;
    }
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* View Map Button */}
      <button
        type="button"
        onClick={openGoogleMaps}
        className="bg-blue-500 hover:bg-blue-600  text-white px-6 py-3 rounded-lg text-[16px] font-semibold flex items-center gap-2  shadow-md transition-all"
      >
        <FaMapMarkerAlt size={24} />

        View Map Location
      </button>
    </div>
  );
};

export default LocationView;
