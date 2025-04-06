import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileNum from '../components/MobileNum';
import OTPverify from '../components/OTPverify';
import UserName from '../components/UserName';
import { useDispatch, useSelector } from 'react-redux';
import SEO from '../components/SEO';
import { loginSet, logoutSet, userListingSet } from '../app/user/user2Slice';


export default function Authentication() {
  const [mobNum, setMobNum] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  // const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameT, setUsernameT] = useState(false);
  const [otpTrue, setOtpTrue] = useState(false);
  const [sendOTP, setSendOTP] = useState("");

  const navigate = useNavigate();
  // const { logoutUser } = useSelector((state) => state.user2);
  const dispatchEvent = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mobNum.length === 10) {

      try {
        // if (logoutUser && logoutUser.mobileNum === mobNum) {
        //   dispatchEvent(loginSet(logoutUser));
        //   dispatchEvent(logoutSet(null));
        //   setLoading(false)

        //   return navigate("/");
        // }
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/users/send-otp`, { mobileNum: parseInt(mobNum) }).then(async (response) => {
          if (response.data.otp && response.data.username === '') {

            // console.log(response.data.user)
            setOtpTrue(true);
            setSendOTP(response.data.otp);
            setError("");

          } else if (response.data.listing) {
            dispatchEvent(userListingSet(response.data.listing));
            dispatchEvent(loginSet(response.data.user));
            const listing = response.data.listing;
            navigate(`/listing/${listing._id}`, { replace: true });
          }
          else if (response.data.username) {

            setUsernameT(false);
            setOtpTrue(false);
            dispatchEvent(loginSet(response.data.user))
            // console.log(response.data.user)
            setError("");
            navigate("/", { replace: true });
          } else {
            setError("OTP not sent try again ");

          }


        });
        setLoading(false);
        // e.target.reset();

      } catch (error) {
        setLoading(false);
        setError(`Something went wrong! ${error}`);
        console.log("error", error);
      }
    } else {
      setLoading(false);
      setError("Please Enter 10 digit number");

      // console.log("Please Enter 10 digit number")
    }

  }

  const handleOTP = async (e) => {
    e.preventDefault();
    if (otp.length === 5) {
      setLoading(true);
      try {
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/users/verify-otp`, { mobileNum: parseInt(mobNum), otp: parseInt(otp) }).then(async (response) => {
          if (response.data.success) {
            // const ID = response.data.ID;
            // setUserId(response.data.ID);
            setUsernameT(true)
            setOtpTrue(false)
            setLoading(false);
            setError("");

            // if (user.username !== "") {
            //     // console.log(response.data)
            //     dispatchEvent(signInSuccess(user))

            //     if (response.data.listingID !== null) {

            //         return navigate(`/listing/${response.data.listingID}`, { replace: true });
            //     } else {

            //         return navigate("/", { replace: true });
            //     }

            // } else {

            //     // setUsernameT(false);
            //     // setOtpTrue(true);


            // }
          } else {
            setError("Invalid OTP");
          }
        });
        setLoading(false);
        // e.target.reset();
      } catch (error) {
        setLoading(false);
        setError(`Something went wrong! ${error}`);
      }
    } else {
      setLoading(false);
      setError("Please Enter 5 digit number");
    }
  }

  const handleName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/users/user-name`, { mobileNum: parseInt(mobNum), username: username }).then(async (response) => {
        if (response.data) {
          console.log(response.data)
          dispatchEvent(loginSet(response.data))

          return navigate("/", { replace: true });
          // await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/allshop/create-shops`, { userRef: userId }).then(async (response) => {
          //   if (response.data) {
          //     // return navigate("/");
          //   }
          // })
        } else {
          setError("Invalid Username");
        }
      });
      setLoading(false);
      // e.target.reset();
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div>
      <SEO
        title="Login | OfflineGO"
        description="Access your OfflineGO account for users find shops and shop owners to manage your shop listings and subscriptions. Secure and easy login for shop owners."
        keywords="OfflineGo login, shop owner login, access account, business dashboard, shop listing management"
        ogImage="https://offlinego.in/store.avif"
        url="https://offlinego.in/auth-user"
      />
      {otpTrue ? <OTPverify handleOTP={handleOTP} sendOTP={sendOTP} loading={loading} setOtp={setOtp} error={error} /> : usernameT ? <UserName handleName={handleName} loading={loading} setUsername={setUsername} error={error} /> : <MobileNum handleSubmit={handleSubmit} loading={loading} setMobNum={setMobNum} error={error} />}
    </div>
  )
}
