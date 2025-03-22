import React, { use, useEffect } from 'react'
import Loader from './Loader'

const OTPverify = ({ handleOTP, loading, sendOTP, setOtp, error }) => {

  useEffect(() => {
    if (sendOTP) {
      alert("OfflineGO provided you a OTP! Your OTP is " + sendOTP);
    }
  }, [sendOTP])
  return (
    <div className='p-3 max-w-lg mx-auto'>
      {loading && <Loader />}
      <h1 className='text-3xl text-center text-slate-700 font-semibold my-7' >
        OTP Verification
      </h1>
      <p className='text-gray-500  text-center'>OTP sent to your mobile number</p>
      <form onSubmit={handleOTP} className='flex flex-col gap-4'>

        <label htmlFor="number" className='text-gray-700'>Enter OTP</label>
        <div className='border-2 border-blue-400 px-4 rounded-lg'>

          <input className='outline-none text-[20px] p-3 rounded-lg border-none ' type="number" placeholder='5 digit OTP' id="number" onChange={(e) => setOtp(e.target.value)} required />
        </div>

        <button disabled={loading} type='submit' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95 cursor-pointer'>{loading ? "Loaging..." : "OTP Verify"}</button>


      </form>
      {/* <div className='flex gap-2 mt-5'>
            <p>Have an account?</p>
            <Link to='/'>
              <span className='text-blue-700' >Sign in</span>
            </Link>
          </div> */}
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}

export default OTPverify