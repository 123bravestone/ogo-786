import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const FilterSection = ({ handleOnFilter, showFilter, setFlag, flag, setSidebarData }) => {
    const [showOffers, setShowOffers] = useState(false);
    const [showShops, setShowShops] = useState(false);
    const [selectedDis, setSelectedDis] = useState(0);
    const [selectedShops, setSelectedShops] = useState('');

    // const offers = ["10% Off", "5% Off", "15% Off"];
    // const discountOffers = ["10% Off", "5% Off", "15% Off", "20% Off"];
    const distance = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shopTypes = ["Clothing", "Supermarket", "Footware", "Grocery Mart", "Pharmacy", "Book", "Library", "Bakery", "Restaurant", "Cafe", "Fast Food", "Accessories", "Mobile", "Hair Salon", "Others"];

    // useEffect(() => {
    //     console.log("showFilter", selectedOffers)
    // }, [selectedOffers]);

    const handleChange = (e) => {
        if (e.target.id === "distance") {
            const value = parseInt(e.target.value);
            setSelectedDis(value);

            setSidebarData((prevData) => ({ ...prevData, distance: value }))


        }
        if (e.target.id === "shoptype") {
            const value = e.target.value

            setSelectedShops(value);
            setSidebarData((prevData) => ({ ...prevData, shoptype: value }));
        }

    }

    const handleClearFilter = () => {
        setSelectedDis(0);
        setSelectedShops('');
        setSidebarData((prevData) => ({ ...prevData, distance: 5, shoptype: selectedShops }))
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
                    <p onClick={() => setShowOffers(!showOffers)} className={`w-full  border-b-[1px]  text-lg border-b-blue-500 text-blue-600 my-2 cursor-pointer`}>User Distance </p>
                    {showOffers ? (
                        <FaAngleDown className="text-blue-600 " />
                    ) : (
                        <FaAngleRight className="text-blue-600 " />

                    )}
                </div>

                {/* <input type="checkbox"  /> */}
                {showOffers && distance.map((dis, idx) => (
                    <label key={idx} className="block">
                        <input type="checkbox" id="distance" onChange={handleChange} value={dis} checked={selectedDis === dis} /> {dis} km
                    </label>
                ))}




                <div className="flex justify-between items-center">
                    <p onClick={() => setShowShops(!showShops)} className={`w-full  border-b-[1px]  text-lg border-b-blue-500 text-blue-600 my-2 cursor-pointer`}>Shop Type </p>
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
