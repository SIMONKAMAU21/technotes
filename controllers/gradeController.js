import { hashPassword, sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Grade from "../model/gradeModal.js";
import Student from "../model/studentModal.js";
import Subject from "../model/subjectModal.js";

export const addGrade = async (req, res) => {
    const { studentId, subjectId, grade, examType, date } =
        req.body;
    try {
        const studentExists = await Student.findOne({ _id: studentId }).lean().exec();
        if (!studentExists) {
            return sendBadRequest(res, "Student does not exists");
        }
        const subjectExists = await Subject.findOne({ _id: subjectId }).lean().exec();
        if (!subjectExists) {
            return sendBadRequest(res, "subject does not exists");
        }
        const gradeExists = await Subject.find({subjectId:req.body.studentId,studentId:req.body.studentId,examType:req.body.examType }).lean().exec();
        if (gradeExists) {
            return sendBadRequest(res, "grade  exists");
        }
        const newGrade = new Grade({
            studentId,
            subjectId,
            grade,
            examType,
            date : date || new Date(),
        });

        // Save grade to the database
        await newGrade.save();

        sendCreated(res, "grade added successfully", newGrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const deleteGrade = async (req, res) => {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
        sendNotFound(res, "grade not found");
    }
    if (grade) {
        await grade.deleteOne();
        sendDeleteSuccess(res, "grade deleted succefully");
    } else {
        res.status(500).json({ message: "Server error" });
    }
};


export const getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.find({}).sort({ name: -1 });

        if (!grades || grades.length === 0) {
            return sendNotFound(res, "No grades found");
        } else {
            return res.status(200).json(grades);
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const getGradeById = async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id)
        if (grade) {
            res.status(200).send(grade)
        } else {
            sendNotFound(res, "no grade with the id is found")
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const getGradeByStudentId = async (req, res) => {
    try {
        const grades = await Grade.find({studentId: req.params.studentId,subjectId:req.params.subjectId}).lean().exec()
        if (grades.length > 0) {
            res.status(200).send(grades)
        } else {
            sendNotFound(res, "no grade found for the provided student id or subject id")
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Server error" });
    }
}


