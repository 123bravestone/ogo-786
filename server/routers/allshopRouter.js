import express from 'express';
import { AddShopCode, createShops, getShopCode } from '../controllers/allshopController.js';


const router = express.Router();

router
    .post('/create-shops', createShops)
    .post('/add-shops-code', AddShopCode)
    .get('/get-shops-code/:id', getShopCode)




export default router;