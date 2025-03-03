import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For parent
    dob: { type: Date },
    address: { type: String },
    studentId : { type: String },
    backupId : { type: String },
    enrollmentDate: { type: Date, default: Date.now },
  });
  
  const Student = mongoose.model('Student', studentSchema);
  export default Student;
  