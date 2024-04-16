const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    weather: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true,
        validate: {
            validator: (v) => validator.isURL(v),
            message: "Link is not valid"
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user",
            default: []
        }],
        required: true,
    },
    createdAt: {
        required: true,
        type: Date
    }
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);