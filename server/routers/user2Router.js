import express from "express";
import multer from "multer";


import { getAllUsers, loginUserName, sendOTP, updateUser, uploadImage, verify2OTP } from "../controllers/user2Controller.js";


const upload = multer({ dest: "uploads/" });

const router = express.Router();

router


    .post("/send-otp", sendOTP)
    .post("/verify-otp", verify2OTP)
    .post("/user-name", loginUserName)
    .post("/update/:id", updateUser)

    //      .get('/:id', getUser)
    .post("/all-users", getAllUsers)



router.post("/upload", upload.single("image"), uploadImage);






export default router;