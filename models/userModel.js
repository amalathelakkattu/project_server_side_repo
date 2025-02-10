import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        //required: true,
        maxLength: 50,
    },
    role: {
        type: String,
        enum: ["admin", "seller","user"],
        default: "user",
    },
    profiePic: {
        type: String,
        default: "https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

export const User = mongoose.model("User", userSchema);