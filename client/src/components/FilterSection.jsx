import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const FilterSection = ({ handleOnFilter, showFilter, setFlag, flag, setSidebarData }) => {
    const [showOffers, setShowOffers] = useState(false);
    const [showShops, setShowShops] = useState(false);
    const [selectedOffers, setSelectedOffers] = useState('');
    const [selectedShops, setSelectedShops] = useState('');

    // const offers = ["10% Off", "5% Off", "15% Off"];
    // const discountOffers = ["10% Off", "5% Off", "15% Off", "20% Off"];
    const discountOffers = ["10% Off", "15% Off", "20% Off", "buy 1 get 1", "upto 50%", "upto 60%", "upto 70%", "upto 75%", "₹20 cashback on order above ₹250 ", "₹200 Off", "₹300 Off", "₹400 Off", "₹500 Off"];
    const shopTypes = ["Clothing", "Supermarket", "Footware", "Grocery Mart", "Pharmacy", "Book", "Library", "Bakery", "Restaurant", "Cafe", "Fast Food", "Accessories", "Mobile", "Hair Salon", "Others"];

    // useEffect(() => {
    //     console.log("showFilter", selectedOffers)
    // }, [selectedOffers]);

    const handleChange = (e) => {
        if (e.target.id === "discountOffer") {
            const value = e.target.value
            setSelectedOffers(value)
            setSidebarData((prevData) => ({ ...prevData, discountOffer: value.slice(0, 3) }))


        }
        if (e.target.id === "shoptype") {
            const value = e.target.value

            setSelectedShops(value);
            setSidebarData((prevData) => ({ ...prevData, shoptype: value }));
        }

    }

    const handleClearFilter = () => {
        setSelectedOffers('');
        setSelectedShops('');
        setSidebarData((prevData) => ({ ...prevData, discountOffer: selectedOffers, shoptype: selectedShops }))
    }

    return (
        // <div className={` top-0 left-0 w-full h-full bg-white z-50 ${showFilter ? "translate-x-0 fixed" : "-translate-x-full"}`}>
        <form onSubmit={handleOnFilter} className={`overflow-auto no-scrollbar w-full md:w-1/4 bg-gray-100 fixed md:relative md:block top-0 left-0 h-screen md:h-auto z-50 ${showFilter ? "translate-x-0" : flag ? "translate-x-0" : "-translate-x-full"} `}>

            <div className="flex items-center px-4 py-2 m-0 sticky top-0 bg-gray-50 justify-between ">
                <h2 className="text-2xl font-bold text-blue-600">Filter</h2>
                {!showFilter && (<RxCross2 onClick={() => setFlag(!flag)} className="text-blue-600 border-2 border-red-600  rounded-2xl text-2xl cursor-pointer" size={30} />

                )}

            </div>
            <div className="space-y-2 p-4 ">

                <div className="flex justify-between items-center">
                    <p onClick={() => setShowOffers(!showOffers)} className={`w-full  border-b-[1px]  text-lg border-b-blue-500 text-blue-600 my-2 cursor-pointer`}>All Offers </p>
                    {showOffers ? (
                        <FaAngleDown className="text-blue-600 " />
                    ) : (
                        <FaAngleRight className="text-blue-600 " />

                    )}
                </div>

                {/* <input type="checkbox"  /> */}
                {showOffers && discountOffers.map((offer, idx) => (
                    <label key={idx} className="block">
                        <input type="checkbox" id="discountOffer" onChange={handleChange} value={offer} checked={selectedOffers === offer} /> {offer}
                    </label>
                ))}




                <div className="flex justify-between items-center">
                    <p onClick={() => setShowShops(!showShops)} className={`w-full  border-b-[1px]  text-lg border-b-blue-500 text-blue-600 my-2 cursor-pointer`}>All Shops </p>
                    {showShops ? (
                        <FaAngleDown className="text-blue-600 " />
                    ) : (
                        <FaAngleRight className="text-blue-600 " />

                    )}
                </div>


                {showShops && shopTypes.map((shop, idx) => (
                    <label key={idx} className="block">
                        <input type="checkbox" id="shoptype" onChange={handleChange} value={shop} checked={selectedShops === shop} /> {shop}
                    </label>
                ))}
            </div>


            <div className=" flex flex-row items-center justify-around sticky bottom-0 bg-gray-50 gap-4 p-4">
                <button type="button" onClick={handleClearFilter} className="w-full p-2 bg-gray-500 text-white rounded-md mt-2 cursor-pointer">
                    Clear Filter
                </button>
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md mt-2 cursor-pointer">
                    Apply Filter
                </button>
            </div>

        </form>
    );
};

export default FilterSection;
