const mongoose = require('mongoose');
const { Schema } = mongoose;
const Student = require('./Students'); 
const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  skillsRequired: {
    type: [String]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  eligibilityCriteria: {
    type: String
  },
  maxApplicants: {
    type: Number
  },
  currentApplicants: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'  // Assuming you have a Student schema
  }],
  status: {
    type: String,
    enum: ['open', 'closed','completed'],
    default: 'open'
  },
  postedby: {
    type: Schema.Types.ObjectId,
    ref: 'faculties', 
    required: true
  },
  studentsworking: [{
    studentId:{
      type: Schema.Types.ObjectId,
      ref: 'Student'  // Assuming you have a Student schema
    },
    status:{
      type: String,
      enum: ['complete', 'incomplete', 'withdraw'],
    },
    credits:{
      type: Number,
    },
    noofhours:{
      type: Number,
    },
  }],
  interndepartment:{
    type: String,
    required: true
  }
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
