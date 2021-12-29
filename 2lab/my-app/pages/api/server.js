import sanitizeHtml from "sanitize-html";
import { validateEmail } from "../index";
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
  try {
    rateLimit(1, clientIP);
  } catch (error) {
    return res.status(429).json({
      id: new Date() + " rate limit" + req.headers[header],
      links: {
        about: error.about,
      },
      status: "429",
      code: error.code,
      title: "Rate limit exceeded",
      detail: "The user made the request more than one time a minute",
      source: {
        pointer: error.pointer,
        parametr: error.parametr,
        error: error,
      },
      meta: {
        data: {
          messuage:
            "Too many requests!\n Curently: " +
            JSON.stringify(error) +
            " | Maximum: 1 per minute",
          color: "red",
        },
      },
    });
  }

  if (!validateEmail(req.body.where.trim())) {
    return res.status(400).json({
      id: new Date() + " uncorrect email" + req.headers[header],
      status: "400",
      title: "Uncorrect email",
      detail: "User enter uncorrect email",
      meta: {
        data: {
          messuage: "Enter correct email, please.",
          color: "red",
        },
      },
    });
  }
  let text =
    "Email: " + req.body.where + "<br/>" + "Message:" + req.body.letter;
  const clearHtml = sanitizeHtml(text);

  const bodyToSend = {
    from: process.env.USERNAME,
    to: process.env.MAIL_TO,
    subject: "Subject",
    html: clearHtml,
  };

  try {
    let info = transporter.sendMail(bodyToSend);
  } catch (error) {
    return res.status(500).json({
      id:
        new Date() +
        " failed connection to mailer" +
        req.headers["x-forwarded-for"],
      links: {
        about: error.about,
      },
      status: "500",
      code: error.code,
      title: "Connect to mailer failed",
      detail: "User's internet unstable or server of mailer not available now",
      source: {
        error: error,
        pointer: error.pointer,
        parametr: error.parametr,
      },
      meta: {
        data: {
          messuage: "Connecting to mailer failed",
          color: "red",
        },
      },
    });
  }

  return res.json({
    status: "200",
    meta: {
      data: {
        messuage: "Mail sent",
        color: "green",
      },
    },
  });
}
