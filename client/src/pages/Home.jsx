import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Image1 from '../assets/canvas_Image/1.png'
import Image2 from '../assets/canvas_Image/2.png'
import Image3 from '../assets/canvas_Image/3.png'
import SearchBar from '../components/SearchBar';
import ShopBox from '../components/Shopbox';
import axios from 'axios';
import Loader from '../components/Loader';
import { FaSearch } from 'react-icons/fa';
import { signInSuccess, userLocationSet } from '../app/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';


const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth’s radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


const Home = () => {

  // const [distance, setDistance] = useState([]);
  const [sortedShops, setSortedShops] = useState([]);
  // const [userLocation, setUserLocation] = useState(null);
  // const [location, setLocation] = useState(false);
  const [flag, setFlag] = useState(false);
  const { currentUser, userLocation } = useSelector(state => state.user);
  const dispatchEvent = useDispatch();



  const images = [
    Image1,
    Image2,
    Image3,
  ];


  const [currentIndex, setCurrentIndex] = useState(0);
  // const [offerListings, setOfferListings] = useState([]);
  const [loading, setLoading] = useState(false);









  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOfferListings = async () => {

      try {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/get?offer=true`).then(async (res) => {
          if (res.data) {
            // setOfferListings(res.data);
            setSortedShops(res.data);
            setLoading(false);
          }
          {
            currentUser &&
              await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/user/${currentUser._id}`).then((res) => {
                if (res.data) {
                  // setOfferListings(res.data);
                  // setSortedShops(res.data);
                  dispatchEvent(signInSuccess(res.data));
                  // console.log("isAdmin", res.data.username);
                  setLoading(false);
                }
              })
          }
        });



        // fetchRentListings();


      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    fetchOfferListings();
  }, []);

  const getUserLocation = () => {
    setLoading(true);


    // Ask user with an alert before requesting location
    const userConsent = window.confirm([
      "Allow access to your location?",
      "For a better experience, please allow access to your location.",
    ].join("\n"));
    if (!userConsent) {
      dispatchEvent(userLocationSet(null));
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {




      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          dispatchEvent(userLocationSet({ lat: userLat, lon: userLon }));
          // setUserLocation({ lat: userLat, lon: userLon });
          // Calculate the distance
          setFlag(true);


          setLoading(false);
        },
        (error) => {
          setLoading(false);
          setFlag(false);
          console.error("Error getting location:", error);
          alert("User denied the request for Geolocation.");
        }
      );
    } else {
      setLoading(false);
      setFlag(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (userLocation === null) {
      setTimeout(() => {
        getUserLocation();
      }, 2000);
    }
  }, []);
  // useEffect(() => {
  //   console.log("userLocation2", userLocation);
  // }, []);



  return (
    <div className='overflow-x-scroll no-scrollbar'>
      {/* Image Section */}
      {loading && <Loader />}
      <div className="relative">


        <div className=" bg-cover bg-center bg-no-repeat flex items-center justify-center">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out "
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images && images.map((img, index) => (

              <div
                key={index}

                className="w-full h-[full] bg-gray-100 flex overflow-hidden justify-center flex-shrink-0 ">
                <img
                  src={img}
                  alt="Food"
                  className='w-full h-full object-contain '
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevImage}
            className="absolute top-1/2 left-2 bg-black text-white p-1 rounded-[20px] h-[40px] md:h-[80] opacity-45 hover:opacity-100"
          >
            <FaArrowLeftLong size={14} />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 bg-black text-white p-1 rounded-[20px] h-[40px] md:h-[80] opacity-45 hover:opacity-100"
          >
            <FaArrowRightLong size={14} />
          </button>
        </div>

        {sortedShops && sortedShops.length > 0 && (
          <SearchBar sortedShops={sortedShops} setSortedShops={setSortedShops} getUserLocation={getUserLocation} flag={flag} />
        )}
      </div>

      {/* <ShopList /> */}

      <div className="flex flex-col gap-6 p-6 px-3 max-w-6xl mx-auto mt-[20px]">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />place to shop
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          This place is helping you to find a perfect shop
          <br />
          for you to buy product with best discount price.
        </div>

        {/* <ScratchCard /> */}
        {/* <DistanceCalculator /> */}
        <Link to="/search?offer=true" className='p-3 rounded-lg text-white bg-blue-500 font-bold hover:opacity-75 m-auto flex items-center'>
          <FaSearch className='inline-block mr-2' /> Let's Find Your Next Shop...
        </Link>



        {
          sortedShops && sortedShops.length > 0 && (


            <div className="">

              <h2 className="text-2xl my-3 font-semibold text-slate-600">Recent Offers</h2>
              <div className="flex w-full no-scrollbar">
                <div className="w-[65rem] lg:w-[90rem] flex flex-col gap-4">
                  {
                    sortedShops.map((listing, idx) => (
                      !listing.isExpired ? <ShopBox key={idx} listing={listing} /> : null
                    ))
                  }
                </div>
              </div>

              <div className="my-3">
                <Link className='text-sm font-semibold text-blue-800' to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>
            </div>
          )
        }







      </div>

    </div>


  )
}

export default Home