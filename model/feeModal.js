import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'unpaid'], required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
  });
  
  const Fee = mongoose.model('Fee', feeSchema);
  export default Fee;
  