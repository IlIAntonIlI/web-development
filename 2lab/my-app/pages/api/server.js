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
    return res.json({
      id: new Date() + " rate limit" + req.headers["x-forwarded-for"],
      links: {
        about: error.about,
      },
      status: "429",
      code: error.code,
      title: "Rate limit exceeded",
      detail: "The user made the request more than three times a minute",
      source: {
        pointer: error.pointer,
        parametr: error.parametr,
      },
      meta: {
        data: {
          messuage:
            "Too many requests!\n Curently: " +
            JSON.stringify(error) +
            " | Maximum: 3 per minute",
          color: "red",
        },
      },
    });
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  for (let key in req.body) {
    if (!req.body[key]) {
      return res.json({
        id: new Date() + " empty fields" + req.headers["x-forwarded-for"],
        status: "500",
        title: "Fields must be not empty",
        detail: "User dont fill all fields",
        meta: {
          data: {
            messuage: "All fields must not be empty!",
            color: "red",
          },
        },
      });
    }
  }

  if (!validateEmail(req.body.where.trim())) {
    return res.json({
      id: new Date() + " uncorrect email" + req.headers["x-forwarded-for"],
      status: "500",
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
    let info = await transporter.sendMail(bodyToSend);
  } catch (error) {
    return res.json({
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
