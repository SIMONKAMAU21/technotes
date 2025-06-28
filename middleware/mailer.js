import nodemailer from "nodemailer";
import { sendSuccess } from "../helpers/helperFunctions.js";

export const sendEmail = async (email, subject,content,isHtml = false) => {
  const ownEmail = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ownEmail,
      pass: password,
    },
  });
  const mailOptions = {
    from: ownEmail,
    to: email,
    subject: `${subject}`,
    [isHtml ? "html" : "text"]: content, // Dynamically decide whether to use text or HTML
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return sendSuccess(
        `Email sent to ${email} successfully`,
        info.response
      );
    }
  });
};
