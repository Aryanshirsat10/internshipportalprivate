const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'role'
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      trim: true
    },
    role: {
      type: [String],
      required: true,
    },
    status:{
      type:String,
      required:true,
      default: 'Active',
      enum: ['Active','Inactive']
    }

  });
  
  const Users = mongoose.model('Users', userSchema);
  module.exports = Users;