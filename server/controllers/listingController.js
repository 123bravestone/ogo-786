import Listing from "../models/listingModel.js";
import cloudinary from "../config/cloudStore.js";

import multer from "multer";
import Request from "../models/mainModel.js";
import User from "../models/userModel.js";
const upload = multer({ dest: "uploads/" });
// Multer config: Accept only images < 20MB
const storage = multer.memoryStorage();
// const upload = multer({
//     storage,
//     limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
//     fileFilter: (req, file, cb) => {
//         if (!file.mimetype.startsWith("image/")) {
//             return cb(new Error("Only image files are allowed!"), false);
//         }
//         cb(null, true);
//     }
// }).array("images", 6);

export const uploadImages = async (req, res) => {
    // console.log("working", req.files);



    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
    }

    try {
        const uploadResults = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { folder: "listing_images" });

                return { url: result.secure_url, publicId: result.public_id };
            })
        );


        res.json({ message: "Images uploaded successfully!", images: uploadResults });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed." });
    }

};
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ error: "Public ID is required." });
        }

        await cloudinary.uploader.destroy(publicId);
        res.json({ message: "Image deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete image." });
    }
};

// 📌 Delete Images
// export const deleteImages = async (req, res) => {
//   try {
//     const { imageId } = req.params;
//     const imageEntry = await Image.findById(imageId);

//     if (!imageEntry) {
//       return res.status(404).json({ error: "Images not found." });
//     }

//     await Promise.all(imageEntry.publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
//     await Image.findByIdAndDelete(imageId);

//     res.json({ message: "Images deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete images." });
//   }
// };

// Create a new listing (POST) /api/listing/create-listing
export const createListing = async (req, res) => {
    try {
        const requestFind = await Request.findOneAndUpdate({ userId: req.body.userRef }, { approvedTime: Date.now() }, { new: true });
        if (requestFind && requestFind.status === "approved") {
            const listing = await Listing.create({
                ...req.body, planType: requestFind.planType,
            });
            return res.status(201).json(listing);
        } else {
            return res.status(404).json({ error: "Listing not Created" });
        }




    } catch (err) {
        res.status(402).json({ error: err.message });
    }
}

// Deleting List Item from database
export const deleteListItem = async (req, res) => {


    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
    } else {
        for (let i = 0; i < listing.imageUrls.length; i++) {
            await cloudinary.uploader.destroy(listing.imageUrls[i].publicId);
        }
    }
    if (req.body._id !== listing.userRef) {
        return res.status(401).json({ error: "You can only delete your own listings!" });

    }

    try {
        await Listing.findByIdAndDelete(req.params.id).then(async () => {
            await Request.findOneAndUpdate({ userId: listing.userRef }, { isExpired: true, status: "pending", planType: "Expired", pricing: "00.00" }).then(async () => {
                await User.findOneAndUpdate({ _id: listing.userRef }, { isAdmin: false }, { new: true });
            });

        });

        res.status(201).json('Linting has been deleted successfully')
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Update user Listing (post) /api/listing/update-listing/:id
export const updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
        // return next(errorHandler(404, "Listing not found!"));
    }

    if (req.body.userRef !== listing.userRef) {
        return res.status(401).json({ error: "You can only update your own listing!" });
        // return next(errorHandler(401, "You can only update your own listing!"));
    } else {
        for (let i = 0; i < listing.imageUrls.length; i++) {
            await cloudinary.uploader.destroy(listing.imageUrls[i].publicId);
        }
    }

    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updateListing);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Get user individual listing (GET) /api/listing/get-listing/:id
export const getListing = async (req, res) => {

    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing);

    } catch (error) {
        // next(error);
        res.status(402).json({ error: error.message });
    }
}

// Get User List items (GET) /api/listing/get
export const SearchListings = async (req, res) => {
    // console.log("working", req.query)

    try {
        const limit = parseInt(req.query.limit) || 50;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }

        }


        let discountOffer = req.query.discountOffer || '';
        let shoptype = req.query.shoptype || '';
        // if (shoptype === undefined || shoptype === '') {
        //     shoptype = { $in: ["Grocery", "Footwear", "Clothes", "Tech", "Organic Market"] }
        // }

        const shop = req.query.shop || ''; // Get the search term from the query parameters
        const city = req.query.city || ''; // Get the address from the query parameters
        // sort by latest first listing "createdAt"
        // const sort = req.query.sort || 'createdAt';
        // //  createdAt descending order "desc"
        // const order = req.query.order || 'desc';
        // console.log("work3", req.query.offer);


        const listing = await Listing.find({ shopname: { $regex: shop, $options: 'i' }, address: { $regex: city, $options: 'i' }, discountOffer: { $regex: discountOffer, $options: 'i' }, shoptype: { $regex: shoptype, $options: 'i' }, offer: offer, isExpired: false }).limit(limit).skip(startIndex);
        // const listing = await Listing.find({ shopname: { $regex: shop, $options: 'i' } })
        // const listing = await Listing.find({ shopname: { $regex: shop, $options: 'i' }, address: { $regex: city, $options: 'i' }, offer: offer, shoptype: shoptype }).limit(limit).skip(startIndex);



        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing);

    } catch (error) {
        // next(error);
        res.status(402).json({ error: error.message });
    }
}


// Users Reviews Post /api/listing/review/:id
export const reviewListing = async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
        // return next(errorHandler(404, 'Listing not found!'))
    }
    const existingReview = listing.reviews.find(review => review.userId === req.body.userId);
    if (existingReview) {
        return res.status(401).json({ error: "Sorry for the inconvenience!", message: "You have already submitted a review!" });
    }



    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $push: { reviews: req.body } },
            { new: true }
        );
        res.status(200).json(updateListing.reviews);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// All user Review (get) /api/listing/all-reviews-rates/:id

export const getAllReviewsRates = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing.reviews);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Delete User Review (get) /api/listing/delete-review/:id
export const deleteReview = async (req, res) => {

    try {
        // console.log(req.params.id, req.params.reviewId);
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        const review = listing.reviews.find(review => review.userId === req.params.userId);
        if (!review) {
            console.log("Review not found!");
            return res.status(404).json({ error: "Review not found!" });
            // return next(errorHandler(404, 'Review not found!'))
        }
        const updatedReviews = listing.reviews.filter(review => review.userId !== req.params.userId);
        listing.reviews = updatedReviews;
        await listing.save();
        res.status(200).json(updatedReviews);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Get all shops items (get) /api/listing/shops
export const getAllShops = async (req, res) => {
    try {
        const listing = await Listing.find();
        res.status(200).json(listing);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Delete Shop (get) /api/listing/delete/:id
export const deleteShop = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shop" });
    }
}

// Get Shop is Open (get) /api/listing/open-shop/:id
export const getIsOpen = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json({ isOpen: listing.isOpen, closeReason: listing.closeReason });
    } catch (error) {

    }
}

// Shop Is Open (get) /api/listing/open-shop/:id
export const openShopVerify = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        listing.isOpen = !listing.isOpen;
        if (req.body.closeReason) listing.closeReason = req.body.closeReason
        await listing.save();
        res.status(200).json({ isOpen: listing.isOpen, closeReason: listing.closeReason });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Expire Shop listing Update (get) /api/listing/expire-listing/:id
export const expireListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
            // return next(errorHandler(404, 'Listing not found!'))
        }
        await Request.findOneAndUpdate({ userId: listing.userRef }, { isExpired: true, status: "pending", planType: "Expired", pricing: "00.00" });
        listing.isExpired = !listing.isExpired;
        await listing.save();
        res.status(200).json({ isExpired: listing.isExpired });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}