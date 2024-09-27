import mongoose from 'mongoose';

const studentUserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    roleai: { 
        type: String, 
        default: '' 
    },
    amount: { 
        type: Number, 
        get: (v) => parseFloat(v.toFixed(2))
    },
    servicefee: { 
        type: Number, 
        get: (v) => parseFloat(v.toFixed(2))
    },
    net: { 
        type: Number, 
        get: (v) => parseFloat(v.toFixed(2))
    },
    withdrawable: {
    type: Number, 
    get: (v) => parseFloat(v.toFixed(2))
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
    },
    line: { type: String },
    facebook: { type: String },
    imageUrl: { type: [String] },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true ,strict: false });


const StudentUser = mongoose.models.StudentUser || mongoose.model('StudentUser', studentUserSchema);
export default StudentUser;
