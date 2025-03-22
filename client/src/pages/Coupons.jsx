import { useEffect, useState } from 'react'

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userCodeSet } from '../app/user/userSlice';

import Image1 from "../assets/ShopImages/clothingStore.jpeg"
import Image2 from "../assets/ShopImages/supermarket.jpeg"
import Image3 from "../assets/ShopImages/footwareStore.jpeg"
import Image4 from "../assets/ShopImages/groceryStore.jpeg"
import Image5 from "../assets/ShopImages/pharmacy.jpeg"
import Image6 from "../assets/ShopImages/bookStore.jpeg"
import Image7 from "../assets/ShopImages/library.jpeg"
import Image8 from "../assets/ShopImages/bakeryStore.jpeg"
import Image9 from "../assets/ShopImages/restaurant.jpeg"
import Image10 from "../assets/ShopImages/cafeStore.jpeg"
import Image11 from "../assets/ShopImages/fastfoodStore.jpeg"
import Image12 from "../assets/ShopImages/gadjetStore.jpeg"
import Image13 from "../assets/ShopImages/mobileStore.jpeg"
import Image14 from "../assets/ShopImages/hairSalon.jpeg"
import Image15 from "../assets/ShopImages/other.jpeg"


const Coupons = () => {

  const arrShop = ["Clothing Store", "Supermarket", "Footware Store", "Grocery Mart", "Pharmacy", "Book Store", "Library", "Bakery", "Restaurant", "Cafe", "Fast Food", "Accessories Store", "Mobile Store", "Hair Salon", "Others"];
  // const arrShop = ["Grocery Mart", "Footwear Hub", "Clothing Store", "Tech Haven", "Organic Market", "Supermarket", "Pharmacy", "Hair Salon", "Cafe", "Book Store", "Restaurant", "Library", "Bakery", "Fast Food", , "Footware Store", "Accessories Store", "Mobile Store", "Electronics", "Laptop Store", "Furniture Store", "High-Tech", "Others"];

  const arrImage = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9, Image10, Image11, Image12, Image13, Image14, Image15];




  // const arrShop = ["Grocery", "Supermarket", "Pharmacy", "Clothes", "Footware", "Accessories", "Mobile", "Electronics", "Laptop", "Furniture", "high-tech", "Others"];

  const dispatchEvent = useDispatch();
  const { userCode } = useSelector((state) => state.user);

  const [shops, setShops] = useState([]);

  const { currentUser } = useSelector((state) => state.user);





  // useEffect(() => {
  //   const handlerandom = async () => {
  //     if (shops.length > 0) {

  //       // console.log("work", lenShop)
  //       await axios.post('http://localhost:5000/api/allshop/add-shops-code', { allShop: shops, userRef: currentUser._id }).then(async (res) => {
  //         if (res.data) {
  //           // console.log(res.data)
  //           dispatchEvent(userCodeSet(res.data))
  //           // setUserCode(res.data)
  //           setShops([])

  //         }
  //       })
  //     }
  //   }
  //   handlerandom()

  // }, [shops.length > 0]);

  // useEffect(() => {
  //   const fetchData = async () => {

  //     // console.log("working", shops.length, lenShop, arrShop.length)
  //     await axios.get(`http://localhost:5000/api/allshop/get-shops-code/${currentUser._id}`).then(async (res) => {
  //       if (res.data.length > 0 && res.data.length === arrShop.length) {
  //         dispatchEvent(userCodeSet(res.data))
  //         // console.log("work", lenShop)
  //         // dispatchEvent(lengthShop(0))
  //         // setUserCode(res.data)
  //         // setShops([])

  //       } else {
  //         if (shops.length === 0) {
  //           dispatchEvent(userCodeSet([]))
  //           for (let i = 0; i < arrShop.length; i++) {


  //             const randomCoupon = Math.floor(Math.random() * 1000);
  //             setShops(prevShops => [...prevShops, { shoptype: arrShop[i], couponCode: arrShop[i].slice(0, 2) + randomCoupon.toString(), expireCode: false, success: false }]);
  //           }

  //         }
  //       }
  //     })

  //   }
  //   fetchData();

  // }, []);

  return (
    <div className=' max-w-7xl mx-auto p-3  flex flex-col  gap-8 my-10  '>
      <h2 className="text-2xl my-3 font-bold text-slate-600 text-center "><u>Your Coupons</u></h2>

      <div className='flex items-center justify-center gap-2 bg-blue-600 p-3  rounded-[30px] w-[300px]'>
        <p className='text-white font-bold text-[20px] '>
          Referral code:
        </p>
        <p className='text-white font-bold text-[20px] '>{currentUser._id.slice(-6).toString().toUpperCase()}</p>
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-center gap-6 overflow-x-scroll no-scrollbar">
        {
          userCode && userCode.map((userC, index) => (
            <div key={index} className="bg-gray-100 relative shadow-md rounded-[30px] hover:shadow-lg transition-shadow overflow-hidden ">
              <img
                src={arrImage[index]}
                alt="listingImg"
                className=" h-[280px] sm:h-[300px] w-full object-cover hover:scale-105 transition-scale duration-300"
              />
              <div className="absolute right-0 bottom-0 z-10 bg-gray-100 w-[30%] h-[30%] flex items-center justify-center rounded-tl-[50%]  ">
                <p className=" text-blue-500 m-3 text-[24px] font-bold ">
                  {userC.couponCode.toString().toUpperCase()}

                  {/* {listing.type === 'rent' && '/ month'} */}
                </p>
              </div>
              <div className="p-3">

                <p className=" text-slate-800 m-3 text-[16px] font-bold ">
                  {userC.shoptype} Discount Code:

                  {/* {listing.type === 'rent' && '/ month'} */}
                </p>
              </div>
            </div>
          ))
        }
      </div>


    </div>
  )
}

export default Coupons