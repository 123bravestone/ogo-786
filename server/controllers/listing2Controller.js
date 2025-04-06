import Listing from "../models/listingModel.js";
import cloudinary from "../config/cloudStore.js";
import haversine from 'haversine-distance';

// import multer from "multer";
import Request from "../models/mainModel.js";
import User from "../models/userModel.js";
import { readFromTempListing, readFromTempUser, saveToTempListing, saveToTempUser } from "../storage/tempStorage.js";
import { read } from "fs";



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

// Create a new listing (POST) /api/listing/create-listing
export const createListing = async (req, res) => {
    let listings = readFromTempListing();
    let users = readFromTempUser();

    try {
        const userIndex = users.findIndex((u) => u._id === req.body.userRef);

        if (userIndex === -1) {
            const user = await User.findOneAndUpdate({ _id: req.body.userRef }, { isAdmin: true }, { new: true });
            users.push(user);
            saveToTempUser(users);
        } else {
            users[userIndex].isAdmin = true;
            // users.push(users[userIndex]);

            saveToTempUser(users);
        }

        const listing = await Listing.create({
            ...req.body
        });

        if (listing) {
            saveToTempListing([]);
            const allShops = await Listing.find();
            listings.push(allShops)
            saveToTempListing(listings)
            const newUserIndex = users.findIndex((u) => u._id === req.body.userRef);
            return res.status(201).json({ message: "Listing has been created successfully!", listing: listing, user: users[newUserIndex] });
        }



    } catch (err) {
        res.status(402).json({ error: err.message });
    }
}

// Update user Listing (post) /api/listings/update-listing/:id
export const updateListing = async (req, res) => {

    let listings = readFromTempListing();
    if (listings.length === 0) {
        const allShops = await Listing.find();
        saveToTempListing(allShops);
        listings = readFromTempListing();
    }

    try {
        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }

        if (req.body.userRef !== listings[listingIndex].userRef) {
            return res.status(401).json({ error: "You can only update your own listing!" });
        } else {
            for (let i = 0; i < listings[listingIndex].imageUrls.length; i++) {
                await cloudinary.uploader.destroy(listings[listingIndex].imageUrls[i].publicId);
            }
        }

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

// Helper to calculate distance (meters)
function getDistanceInKm(coord1, coord2) {
    const distanceInMeters = haversine(coord1, coord2);
    return distanceInMeters / 1000;
}

// Get User List items (GET) /api/listing/get
export const SearchListings = async (req, res) => {

    let listings = readFromTempListing();
    // let allListings = [];

    if (listings.length === 0) {
        const shopLists = await Listing.find();
        if (shopLists) {
            listings = shopLists;
            saveToTempListing(listings);
            listings = readFromTempListing();
        } else {
            return res.status(401).json("No listing found!")
        }

    }


    try {
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // console.log("work3", req.query);

        const { lat, lon, dist } = req.query || {};


        if (lat && lon) {
            const userCoord = { latitude: lat, longitude: lon };

            //     const sessionKey = `${lat},${lng}`;
            // const shownShopIds = userSessionMap.get(sessionKey) || [];

            // Filter by 5km and direction
            const filtered = listings.filter((shop) => {
                if (!shop.location.coordinates[1] || !shop.location.coordinates[0]) return false;

                const shopCoord = { latitude: shop.location.coordinates[1], longitude: shop.location.coordinates[0] };
                const distance = getDistanceInKm(userCoord, shopCoord);
                // const isEastOrWest = shop.longitude > userCoord.longitude || shop.longitude < userCoord.longitude;

                // return dist <= 5 && !shownShopIds.includes(shop.shopId);
                return distance <= dist;
            });

            //   const nextTen = filtered.slice(startIndex, startIndex + limit);
            //   const updatedShopIds = [...shownShopIds, ...nextTen.map((s) => s.shopId)];
            //   userSessionMap.set(sessionKey, updatedShopIds); 



            const nextTex = searchListing(filtered);

            return res.status(200).json(nextTex);
        } else {
            const nextTen = searchListing(listings);
            return res.status(200).json(nextTen);
        }


        function searchListing(allListings) {
            let offer = req.query.offer || false;
            // if (offer === undefined || offer === 'false') {
            //     offer = { $in: [false, true] }

            // }
            // filter from query
            // let discountOffer = req.query.discountOffer || '';
            let shoptype = req.query.shoptype || '';


            // search from query
            const shop = req.query.shop || ''; // Get the search term from the query parameters
            const city = req.query.city || ''; // Get the address from the query parameters


            if (shop !== '' || city !== '') {

                if (shop !== '' && city !== '') {
                    allListings = allListings.filter((listing) => listing.shopname === shop && listing.address === city);
                } else {

                    allListings = allListings.filter((listing) => listing.shopname === shop || listing.address === city);
                }
                if (offer !== false || shoptype !== '') {
                    if (offer !== false && shoptype !== '') {
                        allListings = allListings.filter((listing) => listing.offer === offer && listing.shoptype === shoptype);
                    } else {
                        allListings = allListings.filter((listing) => listing.offer === offer || listing.shoptype === shoptype);
                    }
                }



            } else if (offer !== false || shoptype !== '') {
                if (offer !== false && shoptype !== '') {
                    allListings = allListings.filter((listing) => listing.offer === offer && listing.shoptype === shoptype);
                } else {
                    allListings = allListings.filter((listing) => listing.offer === offer || listing.shoptype === shoptype);
                }
            }

            // return allListings.slice(startIndex, startIndex + limit);
            return allListings;
        }


    } catch (error) {
        // next(error);
        res.status(402).json({ error: error.message });
    }
}

// Deleted By user - Shop List Item from database
export const deleteListItem = async (req, res) => {

    let listings = readFromTempListing();
    let users = readFromTempUser();
    const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
    if (listingIndex === -1) {
        return res.status(404).json({ error: "Listing not found!" });
    } else {
        for (let i = 0; i < listings[listingIndex].imageUrls.length; i++) {
            await cloudinary.uploader.destroy(listings[listingIndex].imageUrls[i].publicId);
        }

    }

    if (req.body._id !== listings[listingIndex].userRef) {
        return res.status(401).json({ error: "You can only delete your own listings!" });
    }


    try {
        await Listing.findByIdAndDelete(req.params.id).then(async () => {
            await User.findOneAndUpdate({ _id: listings[listingIndex].userRef }, { isAdmin: false }, { new: true }).then(async () => {
                const userIndex = users.findIndex(user => user._id === listings[listingIndex].userRef);
                users[userIndex].isAdmin = false;
                saveToTempUser(users);
                // Remove the deleted listing from the array
                listings.splice(listingIndex, 1);
                saveToTempListing(listings);
            });


        });

        res.status(201).json('Linting has been deleted successfully')
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Get all shops by topAdmin items (get) /api/listing/shops
export const getAllShops = async (req, res) => {
    try {
        let listings = readFromTempListing();
        if (listings.length === 0) {
            const allShops = await Listing.find({});
            saveToTempListing(allShops);
            listings = readFromTempListing();
        }
        res.status(200).json(listings);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Delete Shop by topAdmin (get) /api/listing/delete/:id
export const deleteShop = async (req, res) => {
    let listings = readFromTempListing();
    if (listings.length === 0) {
        const allShops = await Listing.find({});
        saveToTempListing(allShops);
        listings = readFromTempListing();
    }
    try {
        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        // Remove Shop from temporary array
        listings.splice(listingIndex, 1);
        saveToTempListing(listings);

        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shop" });
    }
}




// Get user individual listing (GET) /api/listing/get-listing/:id
export const getListing = async (req, res) => {
    let listings = readFromTempListing();

    try {
        if (listings.length === 0) {
            const allShops = await Listing.find({});
            saveToTempListing(allShops);
            listings = readFromTempListing();
        }
        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        res.status(200).json(listings[listingIndex]);

    } catch (error) {
        // next(error);
        res.status(402).json({ error: error.message });
    }
}

// Get Shop is Open (get) /api/listing/is-open/:id
export const getIsOpen = async (req, res) => {
    let listings = readFromTempListing();
    try {
        if (listings.length === 0) {
            const allShops = await Listing.find({});
            saveToTempListing(allShops);
            listings = readFromTempListing();
        }
        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        // listings[listingIndex].isOpen = !listings[listingIndex].isOpen;
        saveToTempListing(listings);
        res.status(200).json({ isOpen: listings[listingIndex].isOpen, closeReason: listings[listingIndex].closeReason });
    } catch (error) {

    }
}


// Open Shop verify (post) /api/listing/open-verify/:id
export const openShopVerify = async (req, res) => {
    let listings = readFromTempListing();

    try {
        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        listings[listingIndex].isOpen = !listings[listingIndex].isOpen;

        if (req.body.closeReason) listings[listingIndex].closeReason = req.body.closeReason
        saveToTempListing(listings);
        res.status(200).json({ isOpen: listings[listingIndex].isOpen, closeReason: listings[listingIndex].closeReason });
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}
// Users Reviews Post /api/listings/review-rate/:id
export const reviewListing = async (req, res) => {

    let listings = readFromTempListing();

    if (listings.length === 0) {
        const allShops = await Listing.find({});
        saveToTempListing(allShops);
        listings = readFromTempListing();
    }



    try {

        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        const existingReview = listings[listingIndex].reviews.find(review => review.userId === req.body.userId);
        if (existingReview) {
            return res.status(401).json({ error: "Sorry for the inconvenience!", message: "You have already submitted a review!" });
        }


        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $push: { reviews: req.body } },
            { new: true }
        );
        if (updateListing) {
            listings[listingIndex].reviews = updateListing.reviews;
            saveToTempListing(listings);
        }
        res.status(200).json(updateListing.reviews);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// All user Review (get) /api/listings/all-reviews-rates/:id

export const getAllReviewsRates = async (req, res) => {

    let listings = readFromTempListing();
    if (listings.length === 0) {
        const allShops = await Listing.find({});
        saveToTempListing(allShops);
        listings = readFromTempListing();
    }
    try {

        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }


        res.status(200).json(listings[listingIndex].reviews);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Delete User Review (get) /api/listing/delete-review/:id
export const deleteReview = async (req, res) => {
    let listings = readFromTempListing();
    if (listings.length === 0) {
        const allShops = await Listing.find({});
        saveToTempListing(allShops);
        listings = readFromTempListing();
    }

    try {

        const listingIndex = listings.findIndex(listing => listing._id === req.params.id);
        if (listingIndex === -1) {
            return res.status(404).json({ error: "Listing not found!" });
        }

        const reviewIndex = listings[listingIndex].reviews.findIndex(review => review.userId === req.params.userId);
        if (reviewIndex === -1) {
            return res.status(404).json({ error: "Review not found!" });
        }

        // Remove Review from MongoDB database collection
        const updateListing = await Listing.findOneAndUpdate({ _id: req.params.id }, { $pull: { reviews: { userId: req.params.userId } } }, { new: true });

        if (updateListing) {

            const updatedReviews = listings[listingIndex].reviews.filter(review => review.userId !== req.params.userId);


            listings[listingIndex].reviews = updatedReviews;
            saveToTempListing(listings);
            return res.status(200).json(updatedReviews);
        }

    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}


