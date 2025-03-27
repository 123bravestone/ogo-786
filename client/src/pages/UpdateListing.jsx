import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddressSearch from "../components/AddressSearch";
import ImageUpload from "../components/uploadImages";
import Loader from "../components/Loader";




export default function UpdateListing() {


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
        // type: "sale",
        offer: true,
        // furnished: false,
        // parking: false,
        userRef: ""
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [flag, setFlag] = useState(false)

    const [loading, setLoading] = useState(false);
    const [filePercent, setFilePercent] = useState(0);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();

    // const [searchTerm, setSearchTerm] = useState("");
    // const [showResults, setShowResults] = useState(false);
    const [shopResult, setshopResults] = useState(false);
    const [discountResult, setdiscountResults] = useState(false);

    // const [phone, setPhone] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const filteredShopTypes = shopTypes
        .filter((item) => item.toLowerCase().includes(formData.shoptype.toLowerCase()))
        .sort();

    const filteredDiscountTypes = discountTypes
        .filter((item) => item.toLowerCase().includes(formData.discountOffer.toLowerCase()))
        .sort();


    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/get-listing/${listingId}`).then(async (res) => {
                if (res.data) {
                    setFormData(res.data);
                }
            })
            // const res = await fetch(`/api/listing/get/${listingId}`)
            // const data = await res.json();

            // if (data.success === false) {
            //     console.log(data.message);
            //     return;
            // }
            // setFormData(data);
        };

        fetchListing();

    }, []);
    // useEffect(() => {

    //     // console.log("work", formData.description)
    //     // console.log("work", formData.whatsAppNo)
    //     console.log("work", formData.whatsAppNo > 8)

    // }, [formData]);



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
            // if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');


            setLoading(true);
            setError(false);
            setFlag(false)

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/listing/update-listing/${params.listingId}`, { ...formData, userRef: currentUser._id }).then(async (res) => {
                if (res.data) {
                    navigate(`/listing/${res.data._id}`, { replace: true });
                }
            })
            // const res = await fetch(`/api/listing/update/${params.listingId}`, {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": 'application/json',
            //     },
            //     body: JSON.stringify({
            //         ...formData,
            //         userRef: currentUser._id,
            //     }),
            // });

            // const data = await res.json();
            // if (data.success === false) {
            //     setError(data.message);
            // }
            setLoading(false);

            // navigate(`/listing/${data._id}`)


        } catch (err) {
            setError(err.message);
            setFlag(true);
            setLoading(false);
        }
    }




    return (
        <>
            <main className="p-3 max-w-4xl mx-auto">
                {loading && <Loader />}
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

                        {/* <input
                            type="text"
                            placeholder="Shop type"
                            className="border p-3 rounded-lg"
                            id="shoptype"
                            maxLength={62}
                            minLength={10}
                            onChange={handleChange}
                            value={formData.shoptype}
                            required
                        /> */}
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
                                className={`absolute transition-all left-4  duration-300 ${formData.whatsAppNo > 0 ? "top-1 text-[10px]  text-slate-700 font-semibold" : "top-4  text-[15px] text-gray-500"
                                    }`}
                            >
                                Enter Business WhatsApp Number
                            </label>

                            {/* Input Field */}
                            <div className="flex items-center rounded-[10px]  border-2 border-blue-500 p-3">
                                {formData.whatsAppNo > 0 ? < span className="text-gray-600  font-semibold mr-2">+91</span> : ""}
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
                                    <p className="p-3 text-gray-600">No items found</p>
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
                                        <p className="p-3 text-gray-600">No items found</p>
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
                        <ImageUpload setUploading={setUploading} setFormData={setFormData} formData={formData} />

                        {/* <p className="font-semibold">
                            Images:
                            <span className="font-normal text-gray-600 ml-2">
                                The first image will be the cover (max 6 and less than 3MB)
                            </span>
                        </p>
                        <div className="flex relative border-2 border-dashed rounded-[20px] bg-gray-100 gap-4 h-[200px] cursor-pointer">

                            <div className="flex flex-col items-center m-auto">
                                <FaCloudUploadAlt size={50} className=" text-2xl text-gray-700" />
                                <div className="w-full h-full absolute top-2 left-1/4 ">
                                    <input
                                        onChange={(e) =>
                                            setFiles(Array.from(e.target.files))
                                        }
                                        type="file"
                                        className={`p-3  text-black
                                font-semibold text-center rounded-[10px] cursor-pointer`}
                                        id="images"
                                        accept="image/+"
                                        multiple
                                    />
                                </div>
                                <p className="text-gray-700 text-2xl font-semibold">{uploading ? "Uploading..." : "Upload"}</p>
                            </div>



                        </div>

                        {uploading && <p className="text-green-700 text-sm">{`Upload is ${filePercent}% done`}</p>}

                        <p className="text-red-700 text-sm">
                            {imageUploadError && imageUploadError}
                        </p>
                        {formData.imageUrls.length > 0 &&
                            formData.imageUrls.map((url, index) => (
                                <div
                                    key={url}
                                    className="flex justify-between p-3 border border-gray-200 rounded-2xl items-center"
                                >
                                    <img
                                        src={url}
                                        alt="listing image"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="text-red-700 text-sm font-semibold uppercase p-3 hover:opacity-55"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))} */}



                        <button
                            type="submit"
                            // protect un-necessary click use "disable={loading || uploading}"
                            disabled={loading || uploading}
                            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-90 cursor-pointer"
                        >
                            {loading ? 'Updateing...' : 'Update List'}
                        </button>

                        {error && flag && <p className="text-red-700 text-sm">{error}</p>}
                    </div>
                </form>
            </main >
        </>
    );
}
