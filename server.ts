import path from "path";
import next from "next";
import nextBuild from "next/dist/build";
import express from "express";
import payload from "payload";
import { config as dotenv } from "dotenv";

dotenv();

const dev = process.env.NODE_ENV !== "production";
const server = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET_KEY,
    mongoURL: process.env.MONGO_URL,
    express: server,
    email: {
      transportOptions: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        port: 465,
        /* secure: true, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        }, */
      },
      fromName: "hello",
      fromAddress: "test@test.com",
    },
  });

  if (!process.env.NEXT_BUILD) {
    const nextApp = next({ dev });

    const nextHandler = nextApp.getRequestHandler();

    server.get("*", (req, res) => nextHandler(req, res));

    nextApp.prepare().then(() => {
      console.log("NextJS started");

      server.listen(process.env.PORT, async () => {
        console.log(`Server listening on ${process.env.PORT}...`);
      });
    });
  } else {
    server.listen(process.env.PORT, async () => {
      console.log("NextJS is now building...");
      await nextBuild(path.join(__dirname, "../"));
      process.exit();
    });
  }
};

start();
