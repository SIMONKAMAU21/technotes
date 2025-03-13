import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  teacherId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Teacher role
  createdAt: { type: Date, default: Date.now },
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
