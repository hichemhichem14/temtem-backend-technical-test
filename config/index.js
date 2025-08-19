require("dotenv-safe").config();

const config = {
  site: {
    base_url: process.env.BASE_URL,
    client_url: process.env.BASE_URL.CLIENT_URL,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  db: {
    url: process.env.DB_URL,
  },
  env: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  security: {
    bcryptRounds: 10,
    jwtPayload: ["email", "role"],
    jwtSecret: process.env.JWT_SECRET,
    authHeader: "x-auth-token",
    emailValidationTokenExpiration: 7,
  },
  roles: ["owner", "guest"],
};

module.exports = config;
