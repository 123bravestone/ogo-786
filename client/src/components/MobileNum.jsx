import React from 'react'
import Loader from './Loader.jsx'

const MobileNum = ({ handleSubmit, loading, setMobNum, error }) => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      {loading && <Loader />}
      <h1 className='text-3xl text-center text-slate-700 font-semibold my-7' >
        Verify User
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <label htmlFor="number" className='text-gray-700'>Enter your mobile no.</label>
        <div className='border-2 border-blue-400 px-4 rounded-lg'>
          <span className='mr-2 text-black font-bold'>+91</span>
          <input className='outline-none text-[18px] sm:text-[20px] p-3 rounded-lg border-none ' type="number" placeholder='10 digit number' id="number" onChange={(e) => setMobNum(e.target.value)} autoComplete='off' required />
        </div>

        <button disabled={loading} type='submit' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95 cursor-pointer'>{loading ? "Loaging..." : "Send OTP"}</button>


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

export default MobileNum