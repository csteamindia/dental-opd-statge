import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import path from "path";
import { Logger } from "./config/logger.js";
import { swaggerSpec } from "./config/swagger-config.js";
import {
  badJsonHandler,
  errorHandler,
  notFoundHandler,
} from "./middlewares/index.js";
import cookieParser from "cookie-parser";

import healthRoute from "./routes/health.route.js";
import v1Routes from "./routes/v1/index.js";

const logger = Logger(fileURLToPath(import.meta.url));

const app = express();

app.use(cookieParser());
// Serve the uploads directory as static files
app.use(
  "/api/profile-view",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use(
  "/api/pdf",
  express.static(path.join(process.cwd(), "uploads/pdf"))
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// disable `X-Powered-By` header that reveals information about the server
app.disable("x-powered-by");

// set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    },
  },
}));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
// app.use(cors());  // remove this line
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://opd.oralstop.com', 'https://ehr-dental.oralstop.com', 'https://*.oralstop.com'], // your frontend URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'x-xsrf-token', 'Authorization'],
//   exposedHeaders: ['set-cookie']
// }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile apps / curl etc.

    const allowedDomain = /\.oralstop\.com$/; // matches ANY subdomain
    const whitelist = [
      'http://localhost:3000',
    ];

    if (whitelist.includes(origin) || allowedDomain.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-xsrf-token', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));


app.use(
  morgan("combined", {
    write(message) {
      logger.info(message.substring(0, message.lastIndexOf("\n")));
    },
    skip() {
      return process.env.NODE_ENV === "test";
    },
  })
);

// handle bad json format
app.use(badJsonHandler);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css",
  })
);

app.use("/api/health", healthRoute);

// v1 api routes
app.use("/api", v1Routes);

// handle 404 not found error
app.use(notFoundHandler);

// catch all errors
app.use(errorHandler);

// generate swagger API specifications in yaml format
// generateSpecs();

export default app;
