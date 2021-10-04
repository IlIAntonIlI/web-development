const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(2, req.headers["x-forwarded-for"]);
  } catch (error) {
    return res.status(429).json({
      sended: false,
      error:
        "Too many requests!\n Curently: " +
        JSON.stringify(error + 1) +
        " | Maximum: 3 per minute",
    });
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
    from: "alvah.zulauf@ethereal.email",
    to: req.body.where,
    subject: "Hello ✔",
    text: req.body.letter,
    html: req.body.letter
  };

  try {
    var sendInfo = {
      from: null, // sender address
      to: null, // recipient
      subject: "Subject", // Subject line
      text: null, // plain text body
      html: null,
    };
    await fetch("http://web-development2lab-git-2lab-iliantonili.vercel.app/api/check", {
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
        sendInfo = {
          from: data.from, // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        };
      });
  } catch (error) {
    return res.status(500).json({ sended: false, error: "Failed request!" });
  }
  try {
    let info = await transporter.sendMail({
      from: sendInfo.from, // sender address
      to: sendInfo.to, // list of receivers
      subject: sendInfo.subject, // Subject line
      text: sendInfo.text, // plain text body
      html: sendInfo.html // html body
    });
  } catch (error) {
    return res
      .status(500)
      .json({ sended: false, error: "Connecting to mailer failed" });
  }
  return res.status(200).json({ sended: true, messuage: "Mail sent" });
}
