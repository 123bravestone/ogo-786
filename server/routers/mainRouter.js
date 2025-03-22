import express from "express";
import { approveRequest, deleteRequest, getAllRequests, pricingRequest } from "../controllers/mainController.js";



const router = express.Router();

router
    .post('/pricing-request', pricingRequest)
    .get('/all-requests/:userId', getAllRequests)
    .put('/user-request/approve/:id/:userId', approveRequest)
    .delete('/user-request/delete/:id/:userId', deleteRequest)







export default router;