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
    html: req.body.letter,
  };

  try {
    fetch("https://web-development-git-2lab-iliantonili.vercel.app/api/check", {
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
        bodyToSend = {
          from: data.from,
          to: data.to,
          subject: data.subject,
          text: data.text,
          html: data.html,
        };
      });
  } catch (error) {
    return res.status(500).json({ sended: false, error: "Failed request!" });
  }
  try {
    await transporter.sendMail({
      from: bodyToSend.from, // sender address
      to: bodyToSend.to, // list of receivers
      subject: bodyToSend.subject, // Subject line
      text: bodyToSend.text, // plain text body
      html: bodyToSend.html, // html body
    });
  } catch (error) {
    return res
      .status(500)
      .json({ sended: false, error: "Connecting to mailer failed" });
  }
  return res.status(200).json({ sended: true, messuage: "Mail sent" });
}
