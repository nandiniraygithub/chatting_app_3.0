import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // Corrected from 'objectId'
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId, // Corrected from 'objectId'
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true } // Corrected 'timestamp' to 'timestamps' and placed it outside the fields.
);

export default mongoose.model("Message", messageSchema);
