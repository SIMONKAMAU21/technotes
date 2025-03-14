import mongoose from 'mongoose';
import { type } from 'os';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo:{type:String},
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'teacher', 'parent', 'student'], 
    required: true 
  },
  phone: { type: String },
  address: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexing for faster query performance on email
const User = mongoose.model("User",userSchema)
export default User;