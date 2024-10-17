import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  imageUrl: {
    type: [String], 
    required: true, 
  },
  projectname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  iduser: {
    type: String,
    required: true,
  },
  receive: [String],
  permission: { 
    type: Boolean, 
    default: false 
  },
  rathing: {
    type: Number,
    default: 0.0,
    get: (v) => parseFloat(v.toFixed(1)), 
  },
  sold: {
    type: Number,
    default: 0 
  },
  review: {
    type: Number,
    default: 0 
  },
  category: {
    type: String,
    enum: [
      'document',
      'model',
      'website',
      'mobileapp',
      'datasets',
      'ai',
      'iot',
      'program',
      'photo',
      'other',
    ],
    required: true,
  },
  filesUrl: {
    type: [String], 
    required: true, 
  },
  status: {
    type: String,
    enum: ['submitted', 'pending', 'reviewing', 'approved', 'rejected'],
    default: 'pending'
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
