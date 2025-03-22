
import AllShop from "../models/allshopModel.js";


// Create Shops for user /create-shops
export const createShops = async (req, res) => {

    try {
        const { userRef } = req.body;


        const usershop = await AllShop.create({ userRef: userRef });
        res.status(201).json(usershop);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// get shop code /get-shops-code
export const getShopCode = async (req, res) => {
    try {
        const shop = await AllShop.findOne({ userRef: req.params.id });
        res.status(201).json(shop.allShops);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}

// Add Shop Code /add-shops-code
export const AddShopCode = async (req, res) => {

    try {
        const { userRef, allShop } = req.body;

        // const len = allShop.length

        // for(let i = 0; i < allShop.length; i++){
        //     console.log(allShop[i])
        // }
        const shop = await AllShop.findOneAndUpdate({ userRef: userRef }, { allShops: allShop }, { new: true });
        // const existingShop = await AllShop.findOneAndUpdate({ userRef }, { allShops: allShop }, { new: true });
        res.status(201).json(shop.allShops);
    } catch (error) {
        res.status(402).json({ error: error.message });
    }
}