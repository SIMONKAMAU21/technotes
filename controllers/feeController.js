import { hashPassword, sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Fee from "../model/feeModal.js";
import Student from "../model/studentModal.js";

export const addFee = async (req, res) => {
    const { studentId, amount, status, dueDate, paidDate } =
        req.body;
    try {
        const studentExists = await Student.findOne({ _id: studentId }).populate('studentId','name').lean().exec();
        if (!studentExists) {
            return sendBadRequest(res, "Student does not exists");
        }
        const normalizedStatus = status.trim().toLowerCase() || "unpaid"

        // Determine due date: 7 days from the current date
        const calculatedDueDate = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        // only set the paidDate if the status is paid
        const calculatePaidDate = normalizedStatus === "unpaid" ? null : paidDate || new Date();

        const fee = new Fee({
            studentId,
            amount,
            status: normalizedStatus,
            dueDate: calculatedDueDate,
            paidDate: calculatePaidDate,
        });

        // Save fee to the database
        await fee.save();

        sendCreated(res, "fee added successfully", fee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const deleteFee = async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
        sendNotFound(res, "fee not found");
    }
    if (fee) {
        await fee.deleteOne();
        sendDeleteSuccess(res, "fee deleted succefully");
    } else {
        res.status(500).json({ message: "Server error" });
    }
};


export const getAllfees = async (req, res) => {
    try {
        const fees = await Fee.find({}).populate('studentId','name').sort({ name: -1 });

        if (!fees || fees.length === 0) {
            return sendNotFound(res, "No fees found");
        } else {
            return res.status(200).json(fees);
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const getfeeById = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id)
        if (fee) {
            res.status(200).send(fee)
        } else {
            sendNotFound(res, "no fee with the id is found")
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const getfeeByStudentId = async (req, res) => {
    try {
        const fees = await Fee.find({studentId: req.params.studentId}).lean().exec()
        if (fees.length > 0) {
            res.status(200).send(fees)
        } else {
            sendNotFound(res, "no fee fount for the provided student id")
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Server error" });
    }
}


