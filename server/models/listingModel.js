
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        shopname: {
            type: String,
            required: true,
        },
        shoptype: {
            type: String,
            required: true,
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
        whatsAppNo: {
            type: Number,
            default: 0,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        // coordinates: {
        //     type: [Number], // [longitude, latitude]
        //     index: "2dsphere", // Creates GeoSpatial Index
        // },
        // latitude: {
        //     type: String,
        //     required: true,
        // },
        // longitude: {
        //     type: String,
        //     required: true,
        // },
        discountOffer: {
            type: String,
            required: false,
        },
        closeTime: {
            type: Number,
            required: true,
        },
        openTime: {
            type: Number,
            required: true,
        },
        ctime: {
            type: String,
            required: true,
        },
        otime: {
            type: String,
            required: true,
        },

        // parking:{
        //     type: Boolean,
        //     required: true,
        // },
        // type: {
        //     type: String,
        //     required: true,
        // },
        offer: {
            type: Boolean,
            required: false,

        },
        closeReason: {
            type: String,
            default: "",
        },
        isOpen: {
            type: Boolean,
            default: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },
        reviews: {
            type: Array,
            default: [],
            // required: true,
        },
        customers: {
            type: Array,
            default: [],
            // required: true,
        },
        planType: {
            type: String,
            default: "",
        },
        listingTime: {
            type: Date,
            default: Date.now,
        },

    }, { timestamps: true }
)
// Add 2dsphere index for geo queries
listingSchema.index({ location: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;



