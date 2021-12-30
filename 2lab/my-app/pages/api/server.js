import sanitizeHtml from "sanitize-html";
import { validateEmail } from "../index";
import newError from "./error";
const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

const header = "x-forwarded-for";
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  auth: {
    user: process.env.USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
export default function handler(req, res) {
  const clientIP =
    (req.headers[header] || "").split(",")?.pop()?.trim() ||
    req.socket.remoteAddress;
  rateLimit(1, clientIP)
    .then(() => {
      if (!validateEmail(req.body.where.trim())) {
        throw newError("Uncorrect email", 400);
      }
    })
    .then(() => {
      let text =
        "Email: " + req.body.where + "<br/>" + "Message:" + req.body.letter;
      const clearHtml = sanitizeHtml(text);

      const bodyToSend = {
        from: process.env.USERNAME,
        to: process.env.MAIL_TO,
        subject: "Subject",
        html: clearHtml,
      };
      transporter.sendMail(bodyToSend);
    })
    .then(() => {
      return res.status(200).json({
        messuage: "Mail sent",
        ok: true,
      });
    })
    .catch((error) => {
      if (typeof error === "number") {
        var resultError = new newError(
          `Too many requests!\n Curently: ${error} | Maximum: 1 per minute`,
          429
        );
      } else {
        var resultError = error;
      }
      return res.status(resultError?.status || 400).json({
        messuage: resultError?.messuage || "Connecting to mailer failed",
        ok: false,
      });
    });
}
