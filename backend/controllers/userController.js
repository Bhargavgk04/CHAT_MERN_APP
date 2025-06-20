import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Multer memory storage for direct buffer upload
const storage = multer.memoryStorage();
export const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export const uploadProfilePhoto = async (req, res) => {
    if (!req.file) {
        console.error("No file uploaded. req.file:", req.file);
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        console.log("Uploading to Cloudinary. File info:", {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET ? "***" : undefined
        });
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "profile_photos",
                width: 300,
                height: 300,
                crop: "fill"
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
                }
                console.log("Cloudinary upload result:", result);
                return res.status(200).json({ url: result.secure_url });
            }
        );
        stream.end(req.file.buffer);
    } catch (error) {
        console.error("Unexpected error during Cloudinary upload:", error);
        return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const profilePhoto = "https://github.com/shadcn.png";

        const userName = username.trim();

        await User.create({
            fullName,
            username: userName,
            password: hashedPassword,
            profilePhoto: profilePhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullName, username, profilePhoto, gender } = req.body;
        if (!fullName || !username || !gender) {
            return res.status(400).json({ message: "All fields except profilePhoto are required" });
        }
        const updateData = { fullName, username, gender };
        if (typeof profilePhoto === 'string' && profilePhoto.trim() !== '') {
            updateData.profilePhoto = profilePhoto;
        }
        // Check if username is taken by another user
        const existingUser = await User.findOne({ username, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}