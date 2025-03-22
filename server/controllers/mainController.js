import Listing from "../models/listingModel.js";
import Request from "../models/mainModel.js";
import User from "../models/userModel.js";


// Create a pricing request (POST) /api/main/new-request
export const pricingRequest = async (req, res) => {


    try {
        const existRequest = await Request.findOne({ userId: req.body.userId });
        if (existRequest) return res.status(201).json({ message: "You have already submitted a request!" });
        else {

            await Request.create(req.body);
            res.status(201).json({ message: "Request created successfully" });
        }
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Get all requests (GET) /api/main/all-requests
export const getAllRequests = async (req, res) => {
    const userId = req.params.userId;
    try {
        const mainAdmin = await User.findOne({ _id: userId, topAdmin: true });

        if (mainAdmin) {

            const main = await Request.find({});

            res.status(200).json(main);
        } else {
            res.status(200).json({});
        }
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
};

// Approve a request (PUT) /api/main/user-request/approve/:id
export const approveRequest = async (req, res) => {
    // console.log("working", req.params.userId)
    try {
        const mainAdmin = await User.findOne({ _id: req.params.userId, topAdmin: true });
        if (mainAdmin) {
            const updatedRequest = await Request.findByIdAndUpdate(
                { _id: req.params.id, status: "pending" },
                { status: "approved" },
                { new: true }
            );
            await User.findOneAndUpdate({ _id: updatedRequest.userId }, { isAdmin: true }, { new: true })
            const listing = await Listing.findOne({ userRef: updatedRequest.userId })
            if (listing) {
                await Request.findOneAndUpdate({ userId: listing.userRef }, { approvedTime: Date.now() });
                listing.isExpired = false;
                listing.planType = updatedRequest.planType;
                listing.approvedTime = Date.now();
                await listing.save();
            }


            res.json(updatedRequest);
        } else {
            res.status(401).json({ message: "You are not authorized to approve this request" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete a request (DELETE) /api/main/user-request/delete/:id
export const deleteRequest = async (req, res) => {
    try {
        const mainAdmin = await User.findOne({ _id: req.params.userId, topAdmin: true });
        if (mainAdmin) {
            const deletedRequest = await Request.findByIdAndDelete({ _id: req.params.id });

            await User.findOneAndUpdate({ _id: deletedRequest.userId }, { isAdmin: false }, { new: true })
            res.json({ message: "Request deleted successfully" });
        } else {
            res.status(401).json({ message: "You are not authorized to delete this request" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
