import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import {
  FaHouseUser,
  FaMapMarkerAlt,
  FaClock,
} from 'react-icons/fa';
import { BiSolidOffer } from "react-icons/bi";
import axios from 'axios';
import WhatsAppButton from '../components/whatsappLoc';
import Loader from '../components/Loader';
import ShopToggle from '../components/ShopToggle';



export default function Listing() {

  SwiperCore.use([Navigation]);

  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [remainingDays, setRemainingDays] = useState(null);
  const [remainingMonths, setRemainingMonths] = useState(null);

  // const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);


  const fetchExpiredDate = async (listing) => {
    try {
      const startDate = new Date(listing.listingTime);
      const today = new Date();

      // Calculate expiration date
      let expirationDate;
      if (listing.planType === "1 month") {
        expirationDate = new Date(startDate);
        expirationDate.setMonth(startDate.getMonth() + 1); // Add 1 month
      } else if (listing.planType === "6 months") {
        expirationDate = new Date(startDate);
        expirationDate.setMonth(startDate.getMonth() + 6); // Add 6 months
      } else if (listing.planType === "1 year") {
        expirationDate = new Date(startDate);
        expirationDate.setFullYear(startDate.getFullYear() + 1); // Add 1 year
      }

      // Calculate remaining time
      const remainingTime = expirationDate - today;
      const daysLeft = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.floor(daysLeft / 30);

      setRemainingDays(daysLeft > 0 ? daysLeft : null);
      setRemainingMonths(monthsLeft > 0 ? monthsLeft : null);

      // console.log("remainingDays", daysLeft);
      if (listing.isExpired === false && daysLeft <= 0) {
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/expire-listing/${listing._id}`)
      }
      // console.log("remainingDays1");
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {

    // console.log("wirkjlkdajfsl");
    const fetchListing = async () => {
      try {

        setLoading(true);
        await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/get-listing/${params.listingId}`).then(async (res) => {
          if (res.data) {
            setListing(res.data);
            // console.log(res.data.userRef === currentUser._id);
            // console.log(res.data);
            if (currentUser._id === res.data.userRef) {
              fetchExpiredDate(res.data);
            }
          }
          else {
            console.log("Error");
            return;
          }
        })
        setLoading(false);

        setError(false);

      } catch (error) {
        setError(true);
        setLoading(false);

      }
    };
    // fetchListing();
    fetchListing();


  }, [params.listingId]);








  return (
    <main>
      {/* {loading && <p className='text-center my-7 text-2xl'>Loding...</p> && <p className='text-center my-7 text-2xl'>Something went wrong!</p>} */}
      {loading && <Loader />} {/* Show loader if API is loading */}

      {listing &&
        (
          <div>

            <Swiper navigation>
              {listing.imageUrls.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className=' h-[250px] md:h-[550px] lg:h-[550px]' style={{ background: `url(${image.url}) center center/cover no-repeat` }}></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {currentUser?._id === listing.userRef && (
              listing.isExpired === false && remainingDays !== null ? (
                <p className="text-white bg-blue-500 font-semibold p-2 text-center ">
                  {remainingMonths > 0
                    ? `${remainingMonths} months and ${remainingDays % 30} days left`
                    : `${remainingDays} days left`}
                </p>
              ) : (
                <p className="text-white font-bold bg-red-500 p-2 text-center">No Plan Exist</p>
              )
            )}

            <div className='flex flex-col max-w-4xl mx-auto p-3 '>

              <div className="flex items-center justify-between">
                <p className='flex  items-center gap-2 text-slate-700 font-semibold text-[20px]'>
                  <FaHouseUser size={24} color='blue' />
                  {listing.shopname}
                </p>
                {currentUser?._id === listing.userRef ? (
                  <div className="flex items-center justify-baseline gap-2">
                    {/* <span className="bg-green-100 text-green-600 font-bold text-sm px-4 py-1 rounded-md">Owner</span> */}
                    <ShopToggle listingId={listing._id} />
                  </div>


                ) : (
                  <div className="flex flex-col items-center justify-baseline gap-2">
                    {/* <span className="bg-green-100 text-green-600 font-bold text-sm px-4 py-1 rounded-md">Owner</span> */}
                    {listing.isOpen ? <>
                      <p className="bg-green-100 text-green-600 font-bold text-sm px-4 py-1 rounded-md">Shop is Open</p>
                    </> : <>
                      <p className=" text-red-600 font-bold text-sm px-4 py-1 rounded-md">Shop is Closed</p>
                      <p className="text-white bg-red-600   font-bold text-sm px-4 py-1 rounded-md">{listing.closeReason}</p>
                    </>}
                  </div>
                )}
              </div>
              <p className='flex font-semibold items-center mt-6  text-slate-600 text-[16px] sm:text-2xl'>Discount Offer</p>
              <p className='flex gap-2 items-center text-white bg-blue-500 py-2 px-4 rounded-md text-[16px] sm:text-2xl font-bold'>
                <BiSolidOffer className='text-white' size={24} />
                {' '}
                {listing.offer
                  ? listing.discountOffer.toLocaleString('en-US')
                  : "No discount"}
              </p>

              <p className='flex items-center mt-6 gap-2 bg-slate-200 py-2 px-4 rounded-md text-slate-600  text-lg'>
                <FaHouseUser className='text-blue-600' />
                {listing.shoptype}
              </p>
              <p className='flex items-center mt-6 gap-2 bg-slate-200 py-2 px-4 rounded-md text-slate-600  text-lg'>
                <FaMapMarkerAlt className='text-blue-600' />
                {listing.address}
              </p>

              {/* <div className='flex gap-4'>
                <p className='bg-slate-200 w-full max-w-[100px] text-blue-600 font-bold text-center p-1 rounded-md'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-slate-200 text-green-600 w-full max-w-[200px] font-bold text-center p-1 rounded-md'>
                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div> */}
              <div className='bg-slate-200 py-4 px-4 font-semibold  text-slate-500'>
                <p className=' font-semibold text-blue-600 text-lg bg-slate-200  rounded-md mb-2'>About This Shop </p>
                {listing.description}
              </div>
              <ul className=' text-green-900 front-semibold text-sm flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2'>

                <li className='flex text-[20px] items-center gap-2 whitespace-nowrap text-green-600 '>
                  <FaClock className='text-lg' />
                  Opening Time:-{" "}
                  {listing.openTime} : 00 {listing.otime}
                </li>
                <li className='flex text-[20px] items-center gap-2 whitespace-nowrap text-red-600 '>
                  <FaClock className='text-lg ' />
                  Closing Time:-{" "}
                  {listing.closeTime} : 00 {listing.ctime}
                </li>
                {/* <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaParking className='text-lg' />
                    {listing.parking ? 'Parking spot' : 'No parking'}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap bg-slate-200 py-1 px-2 rounded-md'>
                    <FaChair className='text-lg' />
                    {listing.furnished ? 'Furnished' : 'Not furnished'}
                  </li> */}
              </ul>

              <div className="flex items-center gap-4 mt-4">
                {/* <p className='bg-green-500 font-semibold text-white p-3 capitalize rounded-lg cursor-pointer'>
                  View on Google Maps
                </p> */}

                {/* View Map Button Component */}

                {/* <Link to="/" className='bg-emerald-700 text-white p-3 capitalize rounded-lg font-semibold'>
                  Contact Seller
                </Link> */}
                <WhatsAppButton latitude={listing.latitude} longitude={listing.longitude} phoneNumber={listing.whatsAppNo} />
              </div>

              {currentUser && currentUser._id === listing.userRef && (
                <div className="flex items-center justify-center bg-blue-200 rounded-[20px] gap-4 mt-4">
                  <p className="my-2 text-[16px] text-slate-600 ">For any queries you can contact us:<strong className=" text-[16px] font-semibold"> +91 7667650665</strong></p>
                </div>
              )}

              {/* {currentUser && (
                  listing.useRef !== currentUser._id && !contact && (
                    <button onClick={() => setContact(true)} className='bg-slate-700 text-white p-3 capitalize font-semibold tracking-widest rounded-lg'>
                      Message Landlord
                    </button>
                    
                  )
                )}
                { contact && (
                  <Contact listing={listing}/>
                )} */}
            </div>
          </div>


        )}
    </main>
  )
}
