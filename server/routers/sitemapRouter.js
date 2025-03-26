import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import express from "express";
import Listing from "../models/Listing.js"; // Example: Your MongoDB Model

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const smStream = new SitemapStream({ hostname: "https://offlinego.in/" });
        const pipeline = smStream.pipe(createGzip());

        // Add static pages
        smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
        smStream.write({ url: "/about", changefreq: "monthly", priority: 0.8 });
        smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.8 });

        // Fetch dynamic listings from MongoDB
        const listings = await Listing.find();
        listings.forEach((listing) => {
            smStream.write({
                url: `/listing/${listing._id}`,
                changefreq: "weekly",
                priority: 0.9,
            });
        });

        smStream.end();

        const sitemap = await streamToPromise(pipeline);
        res.header("Content-Type", "application/xml");
        res.header("Content-Encoding", "gzip");
        res.send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

export default router;
