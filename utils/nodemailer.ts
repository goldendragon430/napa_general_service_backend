const nodemailer = require("nodemailer");

const sendEmail = (email, file) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "no-reply@napasociety.io",
      pass: "VJTB%*H<<HaY3jR%222",
    },
  });
  const mailOptions = {
    from: "NAPA Society <verify@napasociety.io>",
    to: email,
    subject: "Confirm Email",
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
