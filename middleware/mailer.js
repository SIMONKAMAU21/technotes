import nodemailer from "nodemailer";

export const sendEmail = async (email, passcode, subject) => {
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
    text: `Welcome! Your generated password to access your account is: ${passcode}\nPlease log in and change it as soon as possible.`,
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
