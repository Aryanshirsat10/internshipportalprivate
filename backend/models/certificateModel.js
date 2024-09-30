const mongoose = require('mongoose');
const { Schema } = mongoose;
const certificateSchema = new Schema({
    studentName: {
      type: String,
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    facultyName: {
        type: String,
        required: true
      },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    internshipTitle: {
        type: String,
        required: true
    },
    icKjsceInternshipCell:{
      type: String,
      required: true
    }
  });
  
  const Certificate = mongoose.model('Certificate', certificateSchema);
  module.exports = Certificate;