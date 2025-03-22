import mongoose from 'mongoose';

// const { Schema } = mongoose;
const shopSchema = new mongoose.Schema({


    allShops:[
        {
          shoptype:{
            type: String,
            required: false,
        },
        couponCode: {
            type: String,
            default: "",
            required: false,
          },
          expireCode: {
            type: Boolean,
            default: false,
          },
          success: {
            type: Boolean,
            default: false,
          },
        }
    ],
      userRef: {
        type: String,
        required: false,
      },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
}, { timestamps: true });

// there are 'User_signp' and in db there are created user_signups in plural form
const AllShop = mongoose.model('AllShop', shopSchema);
export default AllShop;