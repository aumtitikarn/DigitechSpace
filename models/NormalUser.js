// models/NormalUser.js
import mongoose, { Schema } from 'mongoose';

const normalUserSchema = new mongoose.Schema({
    name: { type: String},
    firstname: { type: String },
    lastname: { type: String },
    phonenumber: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    roleai: { type: String, default: '' },
    interests: { type: [String], default: [] },
    line: { type: String, required: false },
    facebook: { type: String, required: false },
    imageUrl: { type: [String] },
    notification:{ type: [String] },
    favorite:{ type: [String] },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // blogId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], // Array of blog ObjectId references
}, { timestamps: true });

const NormalUser = mongoose.models.NormalUser || mongoose.model('NormalUser', normalUserSchema);
export default NormalUser;
