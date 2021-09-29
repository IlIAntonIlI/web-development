import sanitizeHtml from "sanitize-html";
const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "alvah.zulauf@ethereal.email",
      pass: "pRCpXwGy4dRD1hjZFA",
    },
  });

  let info = await transporter.sendMail({
    from: '"Alvah 👻" <alvah.zulauf@ethereal.email>', // sender address
    to: req.body.where, // list of receivers
    subject: "Hello ✔", // Subject line
    text: sanitizeHtml(req.body.letter), // plain text body
    html: sanitizeHtml(req.body.letter), // html body
  });
  res.status(200).json(info);
}
