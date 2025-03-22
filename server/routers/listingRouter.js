import express from 'express';
import { createListing, deleteImage, deleteListItem, deleteReview, deleteShop, expireListing, getAllReviewsRates, getAllShops, getIsOpen, getListing, openShopVerify, reviewListing, SearchListings, updateListing, uploadImages } from '../controllers/listingController.js';

import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router
    .post('/create-listing', createListing)
    .post('/delete-list-item/:id', deleteListItem)
    .get('/get-listing/:id', getListing)
    .post('/update-listing/:id', updateListing)
    .get('/get', SearchListings)
    .post("/upload", upload.array("images", 6), uploadImages)
    .post("/delete", deleteImage)
    .post("/review-rate/:id", reviewListing)
    .get('/all-reviews-rates/:id', getAllReviewsRates)
    .delete('/delete-review/:id/:userId', deleteReview)
    .get('/shops', getAllShops)
    .delete('/delete-shop/:id', deleteShop)
    .get('/open-shop/:id', getIsOpen)
    .post('/open-shop/:id', openShopVerify)
    .get('/expire-listing/:id', expireListing)






export default router;