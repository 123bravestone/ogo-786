import mongoose from 'mongoose';

// const { Schema } = mongoose;
const userSchema = new mongoose.Schema({

  username: {
    type: String,
    default: "",
    // unique: true,
  },
  email: {
    type: String,
    default: "@gmail.com",
  },
  // password:{
  //     type:String,
  //     required: true,

  // },
  mobileNum: {
    type: Number,
    required: true,
    unique: true,

  },
  otp: {
    type: Number,
    required: false,
  },
  // verified: {
  //     type: Boolean,
  //     default: false,
  // },
  validUser: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  topAdmin: {
    type: Boolean,
    default: false,
  },
  shopsId: {
    type: Array,
    default: [],
  },
  // userLocation: {
  //   type: String,
  //   default: "",
  // },
  // expireDate: {
  //   type: Boolean,
  //   default: false,
  // },
  // success: {
  //   type: Boolean,
  //   default: false,
  // },
  imageUrl: {
    type: String,
    default: ""
  },
  publicId: {
    type: String,
    default: "",
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,

  // },
}, { timestamps: true });

// there are 'User_signp' and in db there are created user_signups in plural form
const User = mongoose.model('User', userSchema);
export default User;