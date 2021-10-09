import sanitizeHtml from "sanitize-html";
import { validateEmail } from "../index";
const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(3, req.headers["x-forwarded-for"]);
  } catch (error) {
    return res.status(429).json({
      sended: false,
      messuage:
        "Too many requests!\n Curently: " +
        JSON.stringify(error) +
        " | Maximum: 3 per minute",
      color: "red",
    });
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "alvah.zulauf@ethereal.email",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  for (let key in req.body) {
    if (!req.body[key]) {
      return res
        .status(500)
        .json({ message: "All fields must not be empty!" });
    }
  }

  if (!validateEmail(trim(req.body.from)) || !validateEmail(trim(req.body.where))) {
    return res.status(500).json({ message: "Enter correct email, please." });
  }

  const clearHtml = sanitizeHtml(req.body.letter);
  if (!clearHtml) {
    return res.status(500).json({ message: "Enter safe information!" });
  }

  const bodyToSend = {
    from: req.body.from,
    to: req.body.where,
    subject: "Subject",
    text: req.body.letter,
    html: clearHtml,
  };

  try {
    let info = await transporter.sendMail(bodyToSend);
  } catch (error) {
    return res.status(500).json({
      sended: false,
      messuage: "Connecting to mailer failed",
      color: "red",
    });
  }

  return res
    .status(200)
    .json({ sended: true, messuage: "Mail sent", color: "green" });
}
