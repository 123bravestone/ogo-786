import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddressSearch from "../components/AddressSearch";
import ImageUpload from "../components/uploadImages";



export default function CreateListing() {

    const shopTypes = ["Clothing", "Supermarket", "Footware", "Grocery Mart", "Pharmacy", "Book", "Library", "Bakery", "Restaurant", "Cafe", "Fast Food", "Accessories", "Mobile", "Hair Salon", "Others"];

    const discountTypes = ["10% Off", "15% Off", "20% Off", "buy 1 get 1", "upto 50%", "upto 60%", "upto 70%", "upto 75%", "₹20 cashback on order above ₹250 ", "₹200 Off", "₹300 Off", "₹400 Off", "₹500 Off"];



    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        shopname: "",
        description: "",
        address: "",
        latitude: 0,
        longitude: 0,
        whatsAppNo: "",
        shoptype: "",
        discountOffer: "",
        closeTime: 9,
        openTime: 9,
        ctime: "PM",
        otime: "AM",
        offer: true,
        userRef: ""
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();

    const [shopResult, setshopResults] = useState(false);
    const [discountResult, setdiscountResults] = useState(false);

    const [isFocused, setIsFocused] = useState(false);


    // Filter and sort items based on search term
    const filteredShopTypes = shopTypes
        .filter((item) => item.toLowerCase().includes(formData.shoptype.toLowerCase()))
        .sort();

    const filteredDiscountTypes = discountTypes
        .filter((item) => item.toLowerCase().includes(formData.discountOffer.toLowerCase()))
        .sort();









    const handleChange = (e) => {


        // console.log("working", formData.imageUrls);
        // Handle input change

        if (e.target.id === 'shoptype') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
            const value = e.target.value;
            setshopResults(value.length > 0); // Show results only when typing
        }
        else if (e.target.id === 'discountOffer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
            const value = e.target.value;
            setdiscountResults(value.length > 0); // Show results only when typing
        } else if (e.target.id === 'whatsAppNo') {

            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) {
                setFormData({
                    ...formData,
                    [e.target.id]: value
                })
            }
        } else if (e.target.id === "openTime" || e.target.id === "closeTime") {
            const value = e.target.value;

            // Allow only numbers
            if (!/^\d*$/.test(value)) return;

            // Convert value to number
            const numValue = Number(value);

            // Restrict input to 2 digits
            if (value.length > 2) return;


            if (value === "" || (numValue >= 1 && numValue <= 12)) {
                setFormData({
                    ...formData,
                    [e.target.id]: numValue
                })
                if (formData.closeTime < 13 && formData.openTime < 13) {

                    setError(""); // Clear error if input is valid
                }
            } else {
                setError("Please enter a number between 1 and 12");
            }
        } else if (e.target.id === "ctime" || e.target.id === "otime") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }



        if (e.target.type === 'number' || (e.target.type === 'text' && e.target.id !== 'shoptype' && e.target.id !== "whatsAppNo") || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })

        }



        if (e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // if we don't have any image don't submit form
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image');

            // regular price less than discount price give error and some time this is string or number, use "+" fixed in number
            // 


            setLoading(true);
            setError(false);
            setFlag(false)

            await axios.post('http://localhost:5000/api/listing/create-listing', { ...formData, userRef: currentUser._id }).then(async (res) => {
                if (res.data) {
                    navigate(`/listing/${res.data._id}`)
                    // console.log("working")
                }
            });

            setLoading(false);

        } catch (err) {
            setError(err.message);
            setFlag(true);
            setLoading(false);
        }
    }




    return (
        <>
            <main className="p-3 max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-center my-7">
                    Create a Listing
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1">

                        <div className="relative ">
                            {/* Label (moves up when focused or has value) */}
                            <label
                                className={`absolute transition-all left-4  duration-300 ${isFocused && formData.shopname || formData.shopname.length > 0 && formData.shopname ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500 -z-10"
                                    }`}
                            >
                                Shop name
                            </label>
                            <input
                                type="text"
                                className="outline-none border-2 border-blue-500 w-full p-3 rounded-lg"
                                id="shopname"
                                maxLength={62}
                                minLength={10}
                                onChange={handleChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                value={formData.shopname}
                                required
                            />
                        </div>


                        {/* End SearchBox2 */}


                        <div className="relative ">
                            {/* Label (moves up when focused or has value) */}
                            <label
                                className={`absolute transition-all left-4  duration-300 ${isFocused && formData.description || formData.description.length > 0 && formData.description ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500 -z-10"
                                    }`}
                            >
                                Description
                            </label>
                            <textarea
                                type="textarea"
                                className="outline-none border-2 border-blue-500 w-full p-3 rounded-lg"
                                id="description"
                                onChange={handleChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                value={formData.description}
                                required
                            />

                        </div>


                        <div className="relative w-80">
                            {/* Label (moves up when focused or has value) */}
                            <label
                                className={`absolute transition-all left-4  duration-300 ${isFocused && formData.whatsAppNo || formData.whatsAppNo.length > 0 && formData.whatsAppNo ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500"
                                    }`}
                            >
                                Enter Business WhatsApp Number
                            </label>

                            {/* Input Field */}
                            <div className="flex items-center rounded-[10px]  border-2 border-blue-500 p-3">
                                {formData.whatsAppNo.length > 0 ? < span className="text-gray-600  font-semibold mr-2">+91</span> : ""}
                                <input
                                    type="text"
                                    value={formData.whatsAppNo}
                                    id="whatsAppNo"
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full font-semibold outline-none border-none bg-transparent z-10"
                                    maxLength="10"
                                    inputMode="numeric"
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            {/* Colored underline based on number length */}
                            <div
                                className={`h-1 w-full mt-1 transition-all duration-300 rounded-full ${formData.whatsAppNo.length === 10 ? "bg-green-500" : "bg-orange-400"
                                    }`}
                            ></div>
                        </div>

                        <div className="flex gap-6 flex-wrap">
                            <div className="flex gap-2">
                                <input type="checkbox" id="offer" className="w-5"
                                    onChange={handleChange}
                                    checked={formData.offer} />
                                <span>Offer</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">



                            <div className=" relative w-full ">
                                {/* Label (moves up when focused or has value) */}
                                <label
                                    className={`absolute transition-all left-4  duration-300 ${isFocused && formData.shoptype || formData.shoptype.length > 0 && formData.shoptype ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500 -z-10"
                                        }`}
                                >
                                    Shop type
                                </label>

                                <input
                                    type="text"
                                    // value={searchTerm}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    id="shoptype"
                                    value={formData.shoptype}
                                    className="border p-3 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    maxLength={16}
                                    autoComplete="off"

                                />

                                {/* Search Results - Show only if searchTerm exists */}
                                {shopResult && filteredShopTypes.length > 0 ? (
                                    <div className=" absolute z-10 top-[80%]   mt-2 w-80 bg-white shadow-lg rounded-lg ">
                                        {filteredShopTypes.map((item, index) => (
                                            <p
                                                key={index}
                                                onClick={() => {
                                                    setFormData({ ...formData, shoptype: item });
                                                    setshopResults(false);
                                                }}
                                                className="p-3 border-b last:border-none hover:bg-gray-200 cursor-pointer"
                                            >
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                ) : filteredShopTypes.length === 0 && shopResult ? (
                                    <p className="p-3 text-gray-600">Perfect </p>
                                ) : ""}

                            </div>

                            {formData.offer &&

                                <div className=" relative w-full ">
                                    <label
                                        className={`absolute transition-all left-4  duration-300 ${isFocused && formData.discountOffer || formData.discountOffer.length > 0 && formData.discountOffer ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500 -z-10"
                                            }`}
                                    >
                                        Recommended offers
                                    </label>

                                    <input
                                        type="text"
                                        id="discountOffer"
                                        min="5"
                                        // value={searchTerm}
                                        onChange={handleChange}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        value={formData.discountOffer}
                                        className="border p-3 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        maxLength={32}
                                        autoComplete="off"

                                    />

                                    {/* Search Results - Show only if searchTerm exists */}
                                    {discountResult && filteredDiscountTypes.length > 0 ? (
                                        <div className=" absolute z-10 top-[80%]   mt-2 w-80 bg-white shadow-lg rounded-lg ">
                                            {filteredDiscountTypes.map((item, index) => (
                                                <p
                                                    key={index}
                                                    onClick={() => {
                                                        setFormData({ ...formData, discountOffer: item });
                                                        setdiscountResults(false);
                                                    }
                                                    }
                                                    className="p-3 border-b last:border-none hover:bg-gray-200 cursor-pointer"
                                                >
                                                    {item}
                                                </p>
                                            ))}
                                        </div>
                                    ) : filteredDiscountTypes.length === 0 && discountResult ? (
                                        <p className="p-3 text-gray-600">Good offer</p>
                                    ) : ""}

                                </div>



                            }

                            {formData.closeTime.length > 0 || formData.openTime.length > 0 && error ? <p className="text-red-700 text-sm">{error}</p> : ""}

                            <div className="flex flex-row items-center gap-2">
                                <input
                                    type="text"
                                    id="openTime"

                                    onChange={handleChange}
                                    value={formData.openTime}
                                    required
                                    maxLength="2" // Prevents input beyond 2 digits
                                    className="p-3 outline-none border-2 border-blue-500 w-20 rounded-lg"
                                />
                                <p>Open Time</p>
                                <select className="p-3 border border-gray-800 rounded-lg" id="otime" onChange={handleChange} value={formData.otime}>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>

                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    id="closeTime"
                                    onChange={handleChange}
                                    value={formData.closeTime}
                                    required
                                    maxLength="2" // Prevents input beyond 2 digits
                                    className="p-3 outline-none border-2 border-blue-500 w-20  rounded-lg"
                                />
                                <p>Close Time</p>
                                <select className="p-3 border border-gray-800 rounded-lg" id="ctime" onChange={handleChange} value={formData.ctime}>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>

                            </div>
                            {error && formData.closeTime && formData.closeTime.length > 1 && <p className="text-red-700 text-sm">{error}</p>}

                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-4">
                        <AddressSearch setFormData={setFormData} formData={formData} />
                        <ImageUpload setUploading={setUploading} setFormData={setFormData} formData={formData} creating={true} />


                        <button
                            type="submit"
                            // protect un-necessary click use "disable={loading || uploading}"
                            disabled={loading || uploading}
                            className={`p-3 ${loading || uploading ? "bg-blue-300" : "bg-blue-600"} text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-90`}
                        >
                            {loading ? 'Creating...' : 'Create List'}
                        </button>

                        {error && flag && <p className="text-red-700 text-sm">{error}</p>}
                    </div>
                </form>
            </main >
        </>
    );
}
