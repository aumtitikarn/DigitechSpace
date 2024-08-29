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
  author: {
    type: String,
    required: true,
  },
  receive: [String],
  permission: { 
    type: Boolean, 
    default: false 
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
      'photo/art',
      'other',
    ],
    required: true,
  },
  filesUrl: {
    type: [String], 
    required: true, 
  },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
