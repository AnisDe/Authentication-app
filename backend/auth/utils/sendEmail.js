import 'dotenv/config' 
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendEmail = async ({ to, subject, html, text }) => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAIL_API_KEY
    });

    const sentFrom = new Sender(
        process.env.API_EMAIL,
        "Authentication App"
    );

    const recipients = [new Recipient(to, 'Recipient')];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(html)
        .setText(text || "");

    return mailerSend.email.send(emailParams);
};
