import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message, image} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message || "",
            image: image || ""
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}

export const uploadChatImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "chat_images",
                width: 800,
                crop: "limit"
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
                }
                return res.status(200).json({ url: result.secure_url });
            }
        );
        stream.end(req.file.buffer);
    } catch (error) {
        return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
    }
};