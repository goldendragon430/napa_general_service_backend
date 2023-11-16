/* eslint-disable @typescript-eslint/no-var-requires */
const nodemailer = require("nodemailer");

const sendEmail = (from, to, subject ,file) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no-reply@napasociety.io",
      pass: "VJTB%*H<<HaY3jR%222",
    },
  });
  const mailOptions = {
    from,
    to,
    subject,
    html: file,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log("sendMail:err: ", err);
    }
    return console.log("sendMail:info: ", info);
  });
};

module.exports = { sendEmail };
