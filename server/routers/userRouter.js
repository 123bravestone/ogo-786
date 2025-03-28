import express from "express";
import multer from "multer";


import {
     createUser, verifyOTP, userName, userLogOut, updateUser, getUserListings, uploadImage,
     getAllUsers,
     getUser
} from '../controllers/userController.js';


const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
     .post("/verify_phone", createUser)
     .post("/verify_otp", verifyOTP)
     .post("/username", userName)
     .post("/update/:id", updateUser)
     .post("/log-out", userLogOut)
     .get('/:id', getUser)
     .get("/list-items/:id", getUserListings)
     .get("/all-users/:id", getAllUsers)


router.post("/upload", upload.single("image"), uploadImage);






export default router;