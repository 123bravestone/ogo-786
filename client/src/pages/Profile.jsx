import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { signInSuccess } from '../app/user/userSlice.js'
import axios from "axios"
import ProfileUser from "../components/Profile2.jsx";

const Profile = () => {

  const { currentUser, imageOld } = useSelector((state) => state.user);
  const dispatchEvent = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  const [userListing, setUserListing] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [flag, setFlag] = useState(false);


  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");
  const [deleteElement, setDeletElement] = useState(false)


  const handleChange = (e) => {
    setFormData({
      ...formData,
      _id: currentUser._id,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log(error);
    e.preventDefault();
    setLoading(true);
    try {

      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/update/${currentUser._id}`,
        formData
      ).then(async (response) => {
        if (response.data) {
          dispatchEvent(signInSuccess(response.data))
          setLoading(false);
          setError("");
          setUpdateSuccess(true);
        } else {
          console.log("Error Update Najjam")
          setError("Error: Update not perform")
          setLoading(false);
        }
      })



    } catch (error) {
      setError("Error: Update not perform")
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {

      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/user/log-out`, {
        _id: currentUser._id
      }).then(async (res) => {
        if (res.data) {
          dispatchEvent(signInSuccess())
          navigate("/auth-user", { replace: true });
        } else {
          setError("Something went wrong! User still Login")
        }

      })




    } catch (error) {
      setError("Something went wrong! Try again")

    }
  };

  useEffect(() => {
    handleShowListing();
  }, [])
  const handleShowListing = async () => {
    try {

      await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/user/list-items/${currentUser._id}`).then(async (res) => {
        if (res.data) {
          setUserListing(res.data);
          setShowListingError(false);
          setFlag(true);
        } else {
          setFlag(true);
        }
      });


    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listindId) => {
    try {
      setDeletElement(true)
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/listing/delete-list-item/${listindId}`, { _id: currentUser._id }).then(async (res) => {
        if (res.data) {
          setDeletElement(false)
          setUserListing((prev) =>
            prev.filter((listing) => listing._id !== listindId)
          );
        }
      })


    } catch (error) {
      setDeletElement(false)
      setError(error.message)
      // console.log(error.message);

    }
  };

  // useEffect(() => {
  //   console.log("work", typeof currentUser.topAdmin)

  // }, [])


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <ProfileUser />
        <label htmlFor="username" className="text-gray-700">UserID:</label>
        <p className="border p-3 rounded-lg">#{currentUser._id}</p>

        <label htmlFor="username" className="text-gray-700">Username</label>
        <input
          className="border p-3 rounded-lg"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
        />
        <label htmlFor="email" className="text-gray-700">Email</label>
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="email"
          defaultValue={currentUser.username.toLowerCase() + currentUser.email.toLowerCase()}
          // defaultValue={currentUser.username + currentUser.email}
          id="email"
          onChange={handleChange}
        />
        <label htmlFor="mobileNum" className="text-gray-700">Mobile Number</label>
        <p
          className="border p-3 rounded-lg"
        >(+91) - {currentUser.mobileNum}</p>


        <button
          disabled={loading}
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95 cursor-pointer "

        >
          {loading ? "Loading" : "Update Profile"}
        </button>
      </form>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {" "}
        {updateSuccess ? "Profile Updated Successfully!" : ""}
      </p>

      {/* Admin Section for Open Digital Shops */}
      {currentUser && currentUser.topAdmin &&
        <div className="flex flex-row items-center justify-between  gap-2  rounded-lg">

          <Link to="/admins-details" className=" bg-blue-700 p-3 rounded-lg text-white    w-full font-semibold   text-center">Admins Detail

          </Link>
          <Link to={`/users-details/${currentUser._id}`} className=" bg-blue-700 p-3 rounded-lg text-white    w-full font-semibold   text-center">
            Users Detail

          </Link>
          <Link to={`/users-request/${currentUser._id}`} className=" bg-blue-700 p-3 rounded-lg text-white    w-full font-semibold   text-center">
            user Request

          </Link>

        </div>
      }
      {currentUser &&
        currentUser.isAdmin && (


          userListing.length === 0 &&
          <div className="bg-slate-200 p-3 mt-2 rounded-lg">
            <p className="text-slate-600 font-bold">Open Digital Shops </p>
            <p className="mt-8 text-slate-500 text-sm">
              Here you can listing their property over this website by uploading all
              the related details of their property:
            </p>
            <Link to="/create-listing">
              <p className=" bg-blue-600 p-3 rounded-lg text-white   mt-2 w-full font-semibold   text-center">
                Create Listing
              </p>
            </Link>
          </div>

        )
      }
      <>

        {/* List your shop Images */}
        {currentUser && userListing && userListing.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-4 text-2xl font-semibold">
              Your Shop Listing
            </h1>

            {userListing.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex flex-col justify-center lg:flex-row lg:justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0].url}
                    className="max-h-36 max-w-36  object-contain rounded-lg"
                    alt="listingImage"
                  />
                </Link>

                <Link to={`/listing/${listing._id}`}>
                  <p className="text-slate-700 w-40 font-semibold flex-1 text-center hover:underline truncate">
                    {listing.shopname}
                  </p>
                </Link>

                {deleteElement ? (
                  <p className="flex text-sm text-gray-500 ">Deleting....</p>) : (
                  <div className="flex flex-row lg:flex-col gap-5 items-start ">
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="bg-green-100 hover:bg-green-500 border py-1 px-3 rounded-lg text-green-700 hover:text-white">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className=" bg-red-100 hover:bg-red-600 border py-1 px-3 rounded-lg text-red-700 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>

      {/* // : ( */}

      {/* ""
        // <Link to="/user-coupons"><li className="bg-green-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-95 cursor-pointer ">Your Shoping Coupens</li></Link> */}
      {/* // ) */}

      {/* <p className="mt-8 text-slate-600">User can delete their account here:</p> */}
      <div className="flex justify-between mt-5">
        {/* <span
              onClick={handleDeleteUser}
              className="bg-red-700 p-3 rounded-lg text-white font-semibold cursor-pointer hover:opacity-65"
            >
              Delete account
            </span> */}
        <span
          onClick={handleSignOut}
          className="bg-red-200 border hover:bg-red-400 p-3 rounded-lg text-red-700 font-semibold cursor-pointer "
        >
          Sign out
        </span>
      </div>

    </div>
  );
}

export default Profile