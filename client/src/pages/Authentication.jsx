import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileNum from '../components/MobileNum';
import OTPverify from '../components/OTPverify';
import UserName from '../components/UserName';
import { useDispatch } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../app/user/userSlice';


export default function Authentication() {
  const [mobNum, setMobNum] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flag, setFlag] = useState(false);
  const [otpTrue, setOtpTrue] = useState(false);
  const [sendOTP, setSendOTP] = useState("");

  const navigate = useNavigate();
  const dispatchEvent = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mobNum.length === 10) {
      try {
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/verify_phone`, { mobileNum: mobNum }).then(async (response) => {
          setFlag(true);
          setUserId(response.data._id);
          setSendOTP(response.data.otp);


        });
        setError("");
        setLoading(false);
        e.target.reset();
        // navigate("/otp");

      } catch (error) {
        setLoading(false);
        setError(`Something went wrong! ${error}`);
        console.log(error);
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
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/verify_otp`, { _id: userId, otp: otp }).then(async (response) => {
          if (response.data) {
            if (response.data.username !== "") {
              // console.log(response.data)
              dispatchEvent(signInSuccess(response.data))
              return navigate("/");
            } else {

              setFlag(false);
              setOtpTrue(true);
              setLoading(false);
              setError("");
            }
          } else {
            setError("Invalid OTP");
          }
        });
        setLoading(false);
        e.target.reset();
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
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/username`, { _id: userId, username: username }).then(async (response) => {
        if (response.data) {
          dispatchEvent(signInSuccess(response.data))

          return navigate("/");
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
      e.target.reset();
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div>
      {flag ? <OTPverify handleOTP={handleOTP} sendOTP={sendOTP} loading={loading} setOtp={setOtp} error={error} /> : !flag && otpTrue ? <UserName handleName={handleName} loading={loading} setUsername={setUsername} error={error} /> : <MobileNum handleSubmit={handleSubmit} loading={loading} setMobNum={setMobNum} error={error} />}
    </div>
  )
}
