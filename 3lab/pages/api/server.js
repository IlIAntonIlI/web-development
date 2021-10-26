const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000, // Our rate-limit interval, one minute
}).check;

const header = "x-forwarded-for";
export default async function handler(req, res) {
  try {
    await rateLimit(10, req.headers[header]);
  } catch (error) {
    return res.json({
      id: new Date() + " rate limit" + req.headers[header],
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
          created: false,
          messuage:
            "Too many requests!\n Curently: " +
            JSON.stringify(error) +
            " | Maximum: 2 per minute",
          color: "red",
        },
      },
    });
  }

  return res.json({
    status: "200",
    meta: {
      data: {
        created: true,
        messuage: "Created succesfully",
        color: "green",
      },
    },
  });
}
