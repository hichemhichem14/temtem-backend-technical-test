const rateLimit = require("express-rate-limit");
/**
 * If you are behind a proxy/load balancer (usually the case with most hosting services, e.g. Heroku, Bluemix, AWS ELB,
 * Nginx, Cloudflare, Akamai, Fastly, Firebase Hosting, Rackspace LB, Riverbed Stingray, etc.), the IP address of the
 * request might be the IP of the load balancer/reverse proxy (making the rate limiter effectively a global one and
 * blocking all requests once the limit is reached) or undefined. To solve this issue, add the following line to your
 * code (right after you create the express application):
 */

const makeRateLimiter = (timeWindowInMinutes, maxRequests = 10) =>
  // @ts-ignore
  rateLimit({
    windowMs: timeWindowInMinutes * (60 * 1000), // 1 minute
    max: maxRequests, // 10 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
  });

module.exports = {
  makeRateLimiter,
};
