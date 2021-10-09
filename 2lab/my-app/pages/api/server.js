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

  try {
    await transporter.sendMail({
      from: sendInfo.from, // sender address
      to: sendInfo.to, // list of receivers
      subject: sendInfo.subject, // Subject line
      text: sendInfo.text, // plain text body
      html: "", // html body
    });
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
