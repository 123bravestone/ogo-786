import User from "../models/userModel.js";
import { readFromTempUser, saveToTempUser, saveToTempListing, readFromTempListing, readFromUserUpdate, saveToUserUpdate } from "../storage/tempStorage.js";
import cloudinary from "../config/cloudStore.js";
import Listing from "../models/listingModel.js";



// Generate Random OTP
const generateOTP = () => {
    // five digit random number generator
    const min = 10000;
    const max = 99999;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;

    return num;
};


// Send OTP
export const sendOTP = async (req, res) => {

    try {
        const { mobileNum } = req.body;
        const otp = generateOTP();
        // const ID = new Date();


        let users = readFromTempUser();
        if (users.length === 0) {
            const allUsers = await User.find().sort({ createdAt: -1 }); // Get latest users first
            saveToTempUser(allUsers);
            users = readFromTempUser();
        }
        let listings = readFromTempListing();

        const userIndex = users.findIndex((u) => u.mobileNum === mobileNum);
        // console.log("userIndex");

        // find user from temporary database
        if (userIndex !== -1) {
            // console.log("userIndex2", userIndex);


            if (users[userIndex].isAdmin === true) {
                const listingIndex = listings.findIndex((l) => l.userRef === users[userIndex]._id);
                if (listingIndex !== -1) {
                    return res.status(201).json({ message: "You already have a listing", user: users[userIndex], listing: listings[listingIndex] });
                } else {
                    const lisging = await Listing.findOne({ userRef: users[userIndex]._id });
                    if (lisging) {
                        return res.status(201).json({ message: "You already have a listing", user: users[userIndex], listing: lisging });
                    }
                }
                console.log("users[userIndex]");
            }
            users[userIndex].otp = otp;
            saveToTempUser(users);
            return res.status(200).json({ message: "User already exists", otp: otp, user: users[userIndex], username: users[userIndex].username });
        }

        // find user from MongoDB database
        const existingUser = await User.findOne({ mobileNum: mobileNum });
        if (existingUser) {
            if (existingUser.isAdmin === true) {
                const listingIndex = listings.findIndex((l) => l.userRef === existingUser._id);
                if (listingIndex !== -1) {
                    return res.status(201).json({ message: "You already have a listing", user: existingUser, listing: listings[listingIndex] });
                } else {
                    const lisging = await Listing.findOne({ userRef: existingUser._id });
                    if (lisging) {
                        return res.status(201).json({ message: "You already have a listing", user: existingUser, listing: lisging });
                    }
                }
            }
            return res.status(200).json({ message: "User already exists", otp: null, user: existingUser, username: existingUser.username });
        }
        else {
            // local storage Schema
            users.push({
                _id: '',
                username: '',
                mobileNum,
                otp,
                email: '@gmail.com',
                // validUser: false,
                shopsId: [],
                isAdmin: false,
                topAdmin: false,
                imageUrl: '',
                publicId: ''

            });
            saveToTempUser(users);
            res.status(200).json({ message: "OTP Sent", user: null, otp, username: '' });

        }


        //     const listingIndex = listings.findIndex((l) => l.userRef === existingUser._id);
        // if (listingIndex !== -1) {
        //     return res.status(201).json({ message: "You already have a listing", user: existingUser, listingID: listings[listingIndex]._id });
        // }

    } catch (error) {
        res.status(402).json({ error: error.message });
    }

};

// Verify OTP
export const verify2OTP = async (req, res) => {
    const { mobileNum, otp } = req.body;

    let users = readFromTempUser();
    try {
        const userIndex = users.findIndex((u) => u.mobileNum === mobileNum && u.otp === otp);
        // console.log('working2', users[userIndex])
        if (userIndex !== -1) {
            const user = users[userIndex];
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        }
        else {
            return res.status(200).json({ success: false, message: "Invalid OTP", ID: null });
        }


    } catch (error) {
        res.status(402).json({ message: error.message });
    }
};

// Username (POST) /api/user/username
export const loginUserName = async (req, res) => {
    let users = readFromTempUser();
    try {
        const { mobileNum, username } = req.body;

        const userIndex = users.findIndex((u) => u.mobileNum === mobileNum);
        // console.log("users2", userIndex);
        users[userIndex].username = username;
        // console.log("working", users[userIndex]);
        // res.status(201).json(users[userIndex]);
        // users.splice(userIndex, 0);
        // saveToTempUser(users[userIndex]);

        // console.log("users3");
        // Move data to MongoDB if more than 90 users
        // if (users.length >= 2) {
        //     await User.insertMany(users);
        //     saveToTempUser([]);
        // }
        const newUser = await User.create({ mobileNum, username });
        // console.log(newUser);
        users[userIndex]._id = newUser._id;
        saveToTempUser(users);
        if (users.length >= 1000) {

            // Remove the first user from the array
            users.splice(0, 1);
            saveToTempUser(users);

        }
        return res.status(201).json(newUser);


    } catch (error) {
        res.status(402).json({ error: error.message });
    }
};

// Upload user Image

export const uploadImage = async (req, res) => {
    try {
        // console.log(req.body._id);
        // console.log(req.file.path);

        // const { oldPublicId } = req.body;
        let users = readFromTempUser();
        if (users.length === 0) {
            const allUsers = await User.find().sort({ createdAt: -1 }); // Get latest users first
            saveToTempUser(allUsers);
            users = readFromTempUser();

        }
        let userUpdate = readFromUserUpdate();
        const userIndex = users.findIndex((u) => u._id === req.body._id);
        const updateIndex = userUpdate.findIndex((u) => u._id === req.body._id);

        if (userIndex === -1) {
            const user = await User.findOne({ _id: req.body._id });


            if (user.publicId !== "") {
                await cloudinary.uploader.destroy(user.publicId);
            }

            const file = req.file;
            if (!file) return res.status(400).json({ error: "No file uploaded" });

            const result = await cloudinary.uploader.upload(file.path, { folder: "user_profiles" });

            user.imageUrl = result.secure_url;
            user.publicId = result.public_id;
            // console.log("user", user);
            // console.log("userUpdate", users[1]);

            if (updateIndex !== -1) {
                userUpdate[updateIndex].imageUrl = result.secure_url;
                userUpdate[updateIndex].publicId = result.public_id;
                saveToUserUpdate(userUpdate);
            } else {
                userUpdate.push(user);
                saveToUserUpdate(userUpdate);
            }

            users.push(user);
            saveToTempUser(users);
            res.status(201).json(user);
        } else {

            if (users[userIndex].publicId !== "") {
                await cloudinary.uploader.destroy(users[userIndex].publicId);
            }
            const file = req.file;
            if (!file) return res.status(400).json({ error: "No file uploaded" });

            const result = await cloudinary.uploader.upload(file.path, { folder: "user_profiles" });

            users[userIndex].imageUrl = result.secure_url;
            users[userIndex].publicId = result.public_id;
            if (updateIndex !== -1) {
                userUpdate[updateIndex].imageUrl = result.secure_url;
                userUpdate[updateIndex].publicId = result.public_id;
                saveToUserUpdate(userUpdate);
            } else {
                userUpdate.push(users[userIndex]);
                saveToUserUpdate(userUpdate);
            }

            saveToTempUser(users);
            console.log("working6");
            res.status(201).json(users[userIndex]);
        }

        if (userUpdate.length >= 9) {
            for (const user of userUpdate) {

                await User.findOneAndUpdate({ _id: user._id },
                    user, { upsert: true }
                )
                // await User.findOneAndUpdate({ ID: user.ID }, {
                //     $set: {
                //         username: user.username,
                //         mobileNum: user.mobileNum,
                //         otp: user.otp,
                //         email: user.email,
                //         // validUser: user.validUser,
                //         isAdmin: user.isAdmin,
                //         topAdmin: user.topAdmin,
                //         imageUrl: user.imageUrl,
                //         publicId: user.publicId
                //     }
                // }, { new: true })
            }
            saveToUserUpdate([]);
            return res.json({ message: "All users updated in MongoDB" });
        }

        // res.status(201).json({ imageUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
    }
};


// Update username and email  post /api/user/'update/:id'
export const updateUser = async (req, res) => {
    let users = readFromTempUser();
    if (users.length === 0) {
        const allUsers = await User.find().sort({ createdAt: -1 }); // Get latest users first
        saveToTempUser(allUsers);
        users = readFromTempUser();
    }
    let userUpdate = readFromUserUpdate();
    try {
        const updateIndex = userUpdate.findIndex((u) => u._id === req.params.id);
        const userIndex = users.findIndex((u) => u._id === req.params.id);
        if (userIndex === -1) {
            const user = await User.findOne({ _id: req.params.id });
            user.username = req.body.username;
            user.email = req.body.email;

            if (updateIndex !== -1) {
                userUpdate[updateIndex].username = req.body.username;
                userUpdate[updateIndex].email = req.body.email;
                saveToUserUpdate(userUpdate);
            } else {
                userUpdate.push(user);
                saveToUserUpdate(userUpdate);
            }
            users.push(user);
            saveToTempUser(users);
            res.status(201).json(user);
        } else {
            users[userIndex].username = req.body.username;
            users[userIndex].email = req.body.email;
            if (updateIndex !== -1) {
                userUpdate[updateIndex].username = req.body.username;
                userUpdate[updateIndex].email = req.body.email;
                saveToUserUpdate(userUpdate);
            } else {
                userUpdate.push(users[userIndex]);
                saveToUserUpdate(userUpdate);
            }
            saveToTempUser(users);
            res.status(201).json(users[userIndex]);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All users (post) /api/user/all-users
export const getAllUsers = async (req, res) => {

    let users = readFromTempUser();

    if (users.length === 0) {
        const allUsers = await User.find().sort({ createdAt: -1 }); // Get latest users first
        saveToTempUser(allUsers);
        users = readFromTempUser();
    }

    try {
        if (req.body.topAdmin === true) {
            return res.status(200).json(users);
        }
        else {
            return res.status(401).json("You can't view all users!");
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};