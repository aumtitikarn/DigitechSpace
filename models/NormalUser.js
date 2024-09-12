// models/NormalUser.js
import mongoose, { Schema } from 'mongoose';

const normalUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roleai: { type: String, default: '' },
    interests: { type: [String], default: [] },
    line: { type: String, required: true },
    facebook: { type: String, required: true },
    imageUrl: { type: [String], required: true },
    // blogId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], // Array of blog ObjectId references
    favblog: [{
        blogId: { type: mongoose.Types.ObjectId, required: true },
        imageUrl: { type: [String], required: true },
        topic: { type: String, required: true }
    }] // Array to store favorite blog details
}, { timestamps: true });

const NormalUser = mongoose.models.NormalUser || mongoose.model('NormalUser', normalUserSchema);
export default NormalUser;
