import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    grade: { type: Number, required: true },
    examType: { type: String, required: true }, // e.g., 'Midterm', 'Final'
    date: { type: Date, default: Date.now },
  });
  
  const Grade = mongoose.model('Grade', gradeSchema);
  export default Grade;
  