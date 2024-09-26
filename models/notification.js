import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    notifications: { type: [String], required: true },
    addedAt: { type: Date, default: Date.now },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
