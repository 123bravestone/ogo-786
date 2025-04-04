

import User from "../models/userModel.js";
import Listing from "../models/listingModel.js";
import cloudinary from "../config/cloudStore.js";
import { sendSMS } from "../utils/sendSMS.js";


const randomNumber = () => {
  // five digit random number generator
  const min = 10000;
  const max = 99999;
  const num = Math.floor(Math.random() * (max - min + 1)) + min;

  return num;
};

// Create a new user (POST) /api/user/verify_phone
// export const createUser = async (req, res) => {

//   const otp = randomNumber();
//   try {
//     const { mobileNum } = req.body;


//     const existingUser = await User.findOne({ mobileNum });

//     if (existingUser) {
//       const user = await User.findOneAndUpdate({ mobileNum }, { $set: { otpCode: otp } }, { new: true });
//       return res.status(201).json({ success: true, message: "OTP sent successfully", otp: user.otpCode, _id: user._id });
//     } else {
//       //result for SMS OTP only register no. 7667650...
//       const SMSresult = await sendSMS(`+91${mobileNum}`, `OfflineGO, Your OTP is ${otp}. Don't share your OTP with anyone.`);

//       if (SMSresult) {
//         const newUser = await User.create({ mobileNum, otpCode: otp });
//         return res.status(201).json({ success: false, message: "OTP sent successfully", otp: newUser.otpCode, _id: newUser._id });

//       } else {
//         return res.status(201).json({ success: false, message: "OTP not sent try again", otp: null, _id: null });
//       }
//     }
//   } catch (error) {
//     res.status(402).json({ error: error.message });
//   }
// };
export const createUser = async (req, res) => {

  const otp = randomNumber();
  try {
    const { mobileNum } = req.body;

    const existingUser = await User.findOne({ mobileNum });
    if (existingUser) {
      const user = await User.findOneAndUpdate({ mobileNum }, { $set: { otpCode: otp } }, { new: true });
      return res.status(201).json({ message: "OTP sent successfully", otp: user.otpCode, _id: user._id });
    } else {
      const newUser = await User.create({ mobileNum, otpCode: otp });
      res.status(201).json({ message: "OTP sent successfully", otp: newUser.otpCode, _id: newUser._id });
    }
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

// Verify OTP (POST) /api/user/verify_otp
export const verifyOTP = async (req, res) => {
  try {
    const { _id, otp } = req.body;


    const user = await User.findOne({ _id, otpCode: otp });


    if (user) {
      const existListing = await Listing.findOne({ userRef: _id });
      if (existListing) {
        return res.status(201).json({ message: "You already have a listing", listingID: existListing._id, user: user });
      }
      return res.status(201).json({ message: "OTP verified successfully", listingID: null, user: user });
    } else {
      return res.status(201).json(false);
    }
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

// Username (POST) /api/user/username
export const userName = async (req, res) => {
  try {
    const { _id, username } = req.body;
    const user = await User.findOneAndUpdate({ _id }, { username, validUser: true }, { new: true });
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(201).json(false);
    }
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

// update Users /api/user/'update/:id'

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.file.path);

    // const { oldPublicId } = req.body;
    const publicID = await User.findOne({ _id: req.body._id }).select("publicId -_id");
    if (publicID.publicId !== "") {
      await cloudinary.uploader.destroy(publicID.publicId);
    }

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });


    const result = await cloudinary.uploader.upload(file.path, { folder: "user_profiles" });

    const user = await User.findOneAndUpdate({ _id: req.body._id }, {
      $set: {

        imageUrl: result.secure_url,
        publicId: result.public_id,
      }
    }, { new: true });


    res.status(201).json(user);
    // res.status(201).json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
};

export const updateUser = async (req, res) => {
  // console.log(req.params.id);
  // console.log(req.body);
  if (req.body._id !== req.params.id)
    return res.status(401).json("You can only update your own account")

  try {
    const updateDetail = await User.findOneAndUpdate({ _id: req.body._id }, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        // avatar: req.body.avatar,
        // publicId: req.body.publicId
      }
    }, { new: true })
    res.status(201).json(updateDetail);
  }
  catch (err) {
    res.status(402).json({ err: err.message });
  }
}


// Validate user [logIn, logOut] (POST) /api/user/log-out
export const userLogOut = async (req, res) => {
  try {
    const { _id } = req.body;

    await User.findOneAndUpdate(
      { _id },
      { validUser: false },
      { new: true }
    );
    return res.status(201).json(true);

  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

// Get User (GET) /api/user/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(402).json({ error: error.message });
  }
};

// Get User List items (GET) /api/user/list-items
export const getUserListings = async (req, res) => {


  if (req.params.id) {

    try {

      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);

    } catch (error) {
      res.status(402).json({ error: error.message });
    }
  } else {

    return res.status(401).json("You can only view your own listings!")
  }
}


// Get All users (GET) /api/user/all-users
export const getAllUsers = async (req, res) => {
  try {
    const topAdmin = await User.findOne({ _id: req.params.id, topAdmin: true });
    if (topAdmin) {
      const users = await User.find().sort({ createdAt: -1 }); // Get latest users first
      res.status(200).json(users);
    } else {
      return res.status(401).json("You can only view all users!");
    }
    // const users = await User.find().sort({ createdAt: -1 }); // Get latest users first
    // res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get All users (GET) /api/user/all-users
// export const getAllUsersWithDetails = async (req, res) => {
//   try {
//     const users = await User.find().select("username email publicId imageUrl").sort({ createdAt: -1 }); // Get latest users first
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// };