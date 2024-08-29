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
  receive: [String],
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
  files: [
    {
      filename: String,
      path: String,
    },
  ],
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
