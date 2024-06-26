const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationForCertificateSchema = new Schema({
  internship: {
    type: Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  certificateIssued: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  }
});

const ApplicationForCertificate = mongoose.model('ApplicationForCertificate', applicationForCertificateSchema);

module.exports = ApplicationForCertificate;
