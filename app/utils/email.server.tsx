import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

declare global {
  var transport: Transporter;
}
const transporter: Transporter =
  global.transport ?? (global.transport = getTransport());

function getTransport() {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
  return transporter;
}

export async function sendMail(mailOptions: Mail.Options) {
  return transporter.sendMail(mailOptions);
}
