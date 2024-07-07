const mongoose = require("mongoose");

const urlShchema = new mongoose.Schema(
    {
        shortId: { type: String, required: true, unique: true },
        redirectURL: { type: String, required: true },
        visitHistory: [{ timestamp: { type: String } }],
    },
    { timestamps: true }
);

const URL = mongoose.model("url", urlShchema);

module.exports = URL;
