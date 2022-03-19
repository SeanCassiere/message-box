import nodemailer from "nodemailer";

import { log } from "#root/utils/logger";

const SENDGRID_SMTP_HOST = process.env.SENDGRID_SMTP_HOST ?? "smtp.sendgrid.net";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? "";
const SENDGRID_API_USER = process.env.SENDGRID_API_USER ?? "";

export async function sendEmail({ recipient, subject, html }: { recipient: string; subject: string; html: string }) {
  try {
    const transporter = nodemailer.createTransport({
      host: SENDGRID_SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: SENDGRID_API_USER,
        pass: SENDGRID_API_KEY,
      },
    });

    await transporter.sendMail({
      from: '"MessageBox 👻" <sean.cassiere@gmail.com>',
      to: recipient,
      subject,
      html,
    });

    return true;
  } catch (error) {
    log.error(`Could not send email to ${recipient}\n${error}`);
    return false;
  }
}
