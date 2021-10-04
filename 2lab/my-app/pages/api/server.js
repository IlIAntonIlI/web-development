import sanitizeHtml from "sanitize-html";

const nodemailer = require("nodemailer");

const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

export default async function handler(req, res) {
  try {
    // 10 stands for the maximum amount of requests allowed during the defined interval
    // rateLimit now returns a promise, let's await for it! (◕‿◕✿)
    await rateLimit(2, req.headers["X-Forwarded-For"]);
  } catch (error) {
    res.status(429).json({
      sended: false,
      error:
        "Too many requests!\n Curently: " +
        JSON.stringify(error + 1) +
        " | Maximum: 3 per minute",
    }); // Still returning a basic 429, but we could do anything~
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "alvah.zulauf@ethereal.email",
      pass: "pRCpXwGy4dRD1hjZFA",
    },
  });

  const bodyToSend = {
    from: '"Alvah 👻" <alvah.zulauf@ethereal.email>',
    to: req.body.where,
    subject: "Hello ✔",
    text: req.body.letter,
    html: req.body.letter,
  };

  try {
    /*fetch("http://localhost:3000/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        bodyToSend.from = data.from;
        bodyToSend.to = data.to;
        bodyToSend.subject = data.subject;
        bodyToSend.text = data.text;
        bodyToSend.html = data.html;
      });*/
    await transporter.sendMail({
      from: bodyToSend.from, // sender address
      to: bodyToSend.to, // list of receivers
      subject: bodyToSend.subject, // Subject line
      text: bodyToSend.text, // plain text body
      html: bodyToSend.html, // html body
    });
    return res.status(200).json({ sended: true, messuage: "Mail sent" });
  } catch (error) {
    return res.status(500).json({ sended: false, error: "Failed sending!" });
  }
}
