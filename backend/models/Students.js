const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Define your user schema fields here
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: Number,
  },
  skills: {
    type: [String]
  },
  resumeUrl: {
    type: String
  },
  gender:{
    type:String
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // This regex validates 10-digit phone numbers
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  cgpa:{
    type:Number,
    min: 0.0, // minimum value
    max: 10.0
  },
  internshipApplications: [{
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship'
    },
    status: {
      type: String,
      enum: ['applied', 'accepted', 'rejected','complete','incomplete','withdraw'],
    }
  }],
});

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;