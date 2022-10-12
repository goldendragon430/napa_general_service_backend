const nodemailer = require("nodemailer");

const sendEmail = (email, file) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hammadyounas813@gmail.com",
      pass: "eazcbydlfjeycjyh",
    },
  });
  const mailOptions = {
    from: "Napa Society <verify@napasociety.io>",
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
