import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Teacher role
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Class = mongoose.model('Class', classSchema);
  export default Class;
  