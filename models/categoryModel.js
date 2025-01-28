import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
        image: {
            type: String,
            default: "https://cdn3.iconfinder.com/data/icons/it-and-ui-mixed-filled-outlines/48/default_image-1024.png",
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("category", categorySchema);