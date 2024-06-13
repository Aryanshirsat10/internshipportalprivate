const mongoose = require("mongoose");
const { Schema } = mongoose;

const collegeSchema = new Schema({
 name:{
    type: String,
 },
  emailId: {
    type: String,
    unique: true
},
password: {
    type: String,
    trim: true
},
});

module.exports = mongoose.model("faculties", collegeSchema, "faculties");