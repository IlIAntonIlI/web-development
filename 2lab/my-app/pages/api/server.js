import sanitizeHtml from "sanitize-html";

const nodemailer = require("nodemailer");

const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

export default async function handler(req, res) {
  try {
    // 10 stands for the maximum amount of requests allowed during the defined interval
    // rateLimit now returns a promise, let's await for it! (◕‿◕✿)
    await rateLimit(3, req.headers["client-ip"]);
  } catch (error) {
    res.status(429).json(error); // Still returning a basic 429, but we could do anything~
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "alvah.zulauf@ethereal.email",
      pass: "pRCpXwGy4dRD1hjZFA",
    },
  });

  await transporter.sendMail({
    from: '"Alvah 👻" <alvah.zulauf@ethereal.email>', // sender address
    to: req.body.where, // list of receivers
    subject: "Hello ✔", // Subject line
    text: sanitizeHtml(req.body.letter), // plain text body
    html: sanitizeHtml(req.body.letter), // html body
  });
  res.status(200).json({});
}
