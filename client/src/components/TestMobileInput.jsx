import React, { useState } from "react";

const PhoneInput = () => {
    const [phone, setPhone] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Handle input change (allow only numbers & max 10 digits)
    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        if (value.length <= 10) {
            setPhone(value);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100 p-4">
            <div className="relative w-80">
                {/* Label (moves up when focused or has value) */}
                <label
                    className={`absolute transition-all duration-300 ${isFocused || phone.length > 0 ? "-top-[26px] -left-0 text-[15px]  text-blue-500 font-semibold" : "top-3  text-[15px] left-[40px] text-gray-500"
                        }`}
                >
                    Enter Mobile Number
                </label>

                {/* Input Field */}
                <div className="flex items-center rounded-[10px]  border-2">
                    <span className="text-gray-600  font-semibold px-2">+91</span>
                    <input
                        type="text"
                        value={phone}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full p-2 text-lg outline-none border-none bg-transparent z-10"
                        maxLength="10"
                        inputMode="numeric"
                    />
                </div>

                {/* Colored underline based on number length */}
                <div
                    className={`h-1 w-full mt-1 transition-all duration-300 rounded-full ${phone.length === 10 ? "bg-green-500" : "bg-orange-400"
                        }`}
                ></div>
            </div>
        </div>
    );
};

export default PhoneInput;
