// models/NormalUser.js
import mongoose,{Schema} from 'mongoose';

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
}, { timestamps: true });

const NormalUser = mongoose.models.NormalUser || mongoose.model('NormalUser', normalUserSchema);
export default NormalUser;
