import mongoose from 'mongoose';

const studentUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleai: { 
        type: String, 
        default: '' 
    },
    interests: { type: [String], default: [] },
    SellInfo: {
        fullname: { type: String },
        phonenumber: { type: String },
        nationalid: { type: String },
        namebank: { type: String },
        numberbankacc: { type: String },
        housenum: { type: String },
        subdistrict: { type: String },
        district: { type: String },
        province: { type: String },
        postalnumber: { type: String }
    }
}, { timestamps: true });


const StudentUser = mongoose.models.StudentUser || mongoose.model('StudentUser', studentUserSchema);
export default StudentUser;
