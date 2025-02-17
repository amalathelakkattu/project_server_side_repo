import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
            unique: true,
        },
        description: {
            type: String,
            required: true,
            minLength: 20,
            maxLength: 300,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        ratings: {
            type: Number,
            default: 4
        },
        numReviews: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: "https://cdn3.iconfinder.com/data/icons/it-and-ui-mixed-filled-outlines/48/default_image-1024.png",
        },
        category: { type: mongoose.Types.ObjectId,ref: "Category" },
        seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);