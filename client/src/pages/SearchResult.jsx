import { useEffect, useRef, useState } from "react";
import FilterSection from "../components/FilterSection.jsx";
import SearchSmallBar from "../components/SearchSmallBar.jsx";
import ShopBox from "../components/Shopbox.jsx";
import Loader from "../components/Loader.jsx";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFilter } from "react-icons/fa";


const defaultShops = [
    // { name: "Grocery Mart", city: "New York", address: "123 Main St", offer: "10% Off", type: "Grocery", image: "https://via.placeholder.com/150" },
    // { name: "Footwear Hub", city: "Los Angeles", address: "456 Elm St", offer: "5% Off", type: "Footwear", image: "https://via.placeholder.com/150" },
    // { name: "Clothing Store", city: "Chicago", address: "789 Oak St", offer: "15% Off", type: "Clothing", image: "https://via.placeholder.com/150" },
];

const SearchResult = () => {
    const [filteredShops, setFilteredShops] = useState(defaultShops);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        shop: '',
        city: '',
        shoptype: '',
        offer: true,
        discountOffer: ''
    });
    const [showFilter, setShowFilter] = useState(false);
    const [distance, setDistance] = useState([]);

    const [flag, setFlag] = useState(false);

    const filterRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const updateButtonWidth = () => {
            if (filterRef.current) {
                setShowFilter(filterRef.current.offsetWidth > 760);
                // console.log(buttonRef.current.offsetWidth)
            }
        };

        updateButtonWidth(); // Initial check
        window.addEventListener("resize", updateButtonWidth); // Update on resize

        // if (showFilter === true) setFlag(true);

        return () => window.removeEventListener("resize", updateButtonWidth);
    }, []);

    // const handleSearch = (city, shop) => {
    //     const results = defaultShops.filter(s =>
    //         (city ? s.city.toLowerCase().includes(city.toLowerCase()) : true) &&
    //         (shop ? s.name.toLowerCase().includes(shop.toLowerCase()) : true)
    //     );
    //     setFilteredShops(results);
    // };

    const handleFilter = (selectedOffers, selectedShops) => {
        // const results = defaultShops.filter(s =>
        //     (selectedOffers.length ? selectedOffers.includes(s.discountOffer) : true) &&
        //     (selectedShops.length ? selectedShops.includes(s.type) : true)
        // );
        // setSidebarData((prevData) => ({ ...prevData, discountOffer: selectedOffers, shoptype: selectedShops }));

        // setFilteredShops(results);
        // console.log("work", selectedOffers, selectedShops);
        // handleSubmit();
    };

    useEffect(() => {
        setLoading(true);

        const urlParams = new URLSearchParams(location.search);
        const shopFromUrl = urlParams.get('shop');
        const cityFromUrl = urlParams.get('city');
        const shoptypeFromUrl = urlParams.get('shoptype');
        const offerFromUrl = urlParams.get('offer');
        const discountOfferFromUrl = urlParams.get('discountOffer');

        if (shopFromUrl || cityFromUrl || shoptypeFromUrl || offerFromUrl) {
            setSidebarData({ shop: shopFromUrl || '', city: cityFromUrl || '', shoptype: shoptypeFromUrl || '', discountOffer: discountOfferFromUrl || '', offer: offerFromUrl === "true" ? true : false });
        }

        const fetchListings = async () => {
            try {
                setShowMore(false);
                const searchQuery = urlParams.toString();
                if (searchQuery) {
                    // console.log("work", searchQuery);
                    await axios.get(`http://localhost:5000/api/listing/get?${searchQuery}`).then(async (res) => {
                        if (res.data) {
                            // console.log(res.data);
                            setListings(res.data);
                            if (res.data.length > 8) {
                                setShowMore(true);
                            } else {
                                setShowMore(false);
                            }
                            setLoading(false);
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchListings();
        // console.log("working Najjam")
    }, [location.search]);


    const handleOnFilter = (e) => {
        e.preventDefault();
        setLoading(true);



        setFlag(false)
        if (sidebarData.discountOffer !== '' || sidebarData.shoptype !== '') {
            const urlParams = new URLSearchParams()
            urlParams.set('shoptype', sidebarData.shoptype);
            urlParams.set('offer', sidebarData.offer);
            urlParams.set('discountOffer', sidebarData.discountOffer);
            urlParams.set('shop', sidebarData.shop);
            urlParams.set('city', sidebarData.city);
            const searchQuery = urlParams.toString();
            setLoading(false);
            setSidebarData((prevData) => ({
                ...prevData,
                discountOffer: '',
                shoptype: '',
            }))
            navigate(`/search?${searchQuery}`);
        } else {

            setLoading(false)
        }


    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        try {
            await axios.get(`http://localhost:5000/api/listings/get?${searchQuery}`).then(async (res) => {
                if (res.data) {
                    setListings([...listings, ...res.data]);
                    if (res.data.length > 8) {
                        setShowMore(true);
                    } else {
                        setShowMore(false);
                    }
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div ref={filterRef} className="flex flex-col md:flex-row w-full h-full overflow-y-scroll no-scrollbar">
            {loading && <Loader />}

            {showFilter && <FilterSection handleOnFilter={handleOnFilter} showFilter={showFilter} setSidebarData={setSidebarData} setFlag={setFlag} flag={flag} />}
            {!showFilter && (

                <div className=" grid grid-cols-[1fr_4fr]  items-center gap-2 p-4">
                    <p className="text-white  bg-blue-600 cursor-pointer  rounded-[8px] flex flex-col md:flex-row items-center justify-center " onClick={() => setFlag(!flag)} ><FaFilter size={20} className="w-[40px] h-[40px] p-2" />Filter</p>
                    <SearchSmallBar setSidebarData={setSidebarData} listings={listings && listings.length > 0 ? listings : []} setLoading={setLoading} setDistance={setDistance} />
                </div>
            )}
            <div className="w-full md:w-3/4 p-4">
                {showFilter && <SearchSmallBar setSidebarData={setSidebarData} listings={listings && listings.length > 0 ? listings : []} setLoading={setLoading} setDistance={setDistance} />}
                {!showFilter && (

                    <div>
                        <FilterSection handleOnFilter={handleOnFilter} showFilter={showFilter} setSidebarData={setSidebarData} setFlag={setFlag} flag={flag} />
                    </div>


                )}

                <div className="flex flex-col max-w-4xl mx-auto gap-4 mt-4">
                    <p className="text-2xl text-center text-slate-700 font-bold"><u>Search Result</u> </p>
                    {listings && listings.length > 0 ? listings.map((shop, idx) => (
                        !shop.isExpired && <ShopBox listing={shop} distance={distance && distance.length > 0 ? distance[idx].distance : "distance- "} key={idx} />
                    )) : <p>No results found</p>}
                </div>

                {showMore && (
                    <button
                        onClick={onShowMoreClick}
                        className='text-green-700 hover:underline p-7 text-center w-full'
                    >
                        Show More
                    </button>
                )

                }
            </div>

        </div>
    );
};

export default SearchResult;
