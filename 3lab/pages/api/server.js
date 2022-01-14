const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

const header = "x-forwarded-for";
export default function handler(req, res) {
  rateLimit(1, req.headers[header])
    .then(() => {
      return res.status(200).json({
        created: true,
        messuage: "Created succesfully",
        color: "green",
      });
    })
    .catch((error) => {
      return res.status(429).json({
        created: false,
        messuage:
          "Too many requests!\n Curently: " +
          JSON.stringify(error) +
          " | Maximum: 1 per minute",
        color: "red",
      });
    });
}
