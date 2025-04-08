"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const constant_1 = require("./constant");
const email_model_1 = __importDefault(require("../models/email.model"));
const EMAIL_VERIFY = constant_1.SMTP_USER || "notification@mlinzi.tech";
const unsubscribe_url = "#";
function getHtmTemplateEmail(params) {
    const htm = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <style>
      body {
        background-color: #f6f9fc;
        padding: 10px 0;
      }
      .email-container {
        max-width: 600px;
        background-color: #ffffff;
        border: 1px solid #f0f0f0;
        padding: 45px;
        margin: auto;
      }
      .email-header {
        text-align: center;
        margin-bottom: 30px;
      }
      .email-header img {
        max-width: 200px;
        height: auto;
        display: block;
        margin: auto;
      }
      .email-body {
        font-size: 16px;
        line-height: 26px;
        margin: 16px 0;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-weight: 300;
        color: #404040;
      }
      .button {
        background-color: #e6001b;
        border-radius: 4px;
        color: #fff;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 15px;
        text-decoration: none;
        text-align: center;
        display: inline-block;
        width: 210px;
        padding: 14px 7px;
        line-height: 100%;
        max-width: 100%;
        margin-top: 20px;
      }
      .footer {
        font-size: 14px;
        line-height: 20px;
        color: #888888;
        margin-top: 40px;
        text-align: center;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
      }
      .footer p {
        margin: 0 0 10px;
      }
      .social-links a {
        margin: 0 5px;
        text-decoration: none;
        color: #404040;
      }
      .hidden-text {
        display: none;
        overflow: hidden;
        line-height: 1px;
        opacity: 0;
        max-height: 0;
        max-width: 0;
      }
    </style>
  </head>
  <body>
    <div class="hidden-text">Mlinzi Technologie<div></div></div>
    <table align="center" class="email-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tbody>
        <tr>
          <td>
            <div class="email-header">
              <img alt="Mlinzi System" src="https://mlinzicient.vercel.app/_next/static/media/logolarge.2e718dff.png" />
            </div>
            <div class="email-body">
              <p>${params.texte}</p>
              ${params.boutton
        ? `<a href="${params.boutton.boutton_url}" class="button" target="_blank">${params.boutton.boutton_text}</a>`
        : ""}
              <p>${params.end_text}</p>
              <p>Système Mlinzi : Des solutions sur mesure</p>
            </div>
            <div class="footer">
              <p>Suivez-nous :</p>
              <p class="social-links">
                <a href="https://facebook.com/mlinzisystem" target="_blank">Facebook</a> |
                <a href="https://twitter.com/mlinzisystem" target="_blank">Twitter</a> |
                <a href="https://instagram.com/mlinzisystem" target="_blank">Instagram</a>
              </p>
              <p>Besoin d'aide ? Contactez-nous à <a href="mailto:support@mlinzisystem.com">support@mlinzisystem.com</a></p>
              <p><a href="${unsubscribe_url}" target="_blank">Se désabonner</a> | <a href="${unsubscribe_url}" target="_blank">Gérer vos préférences</a></p>
              <p>&copy; 2024 Mlinzi Technologies, Tous droits réservés.</p>
            </div>
          </td> 
        </tr>
      </tbody>
    </table>
  </body>
</html>


`;
    return htm;
}
const send = async (params) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: constant_1.SMTP_HOST,
            port: parseInt(String(constant_1.SMTP_PORT)),
            secure: false,
            auth: {
                user: constant_1.SMTP_USER,
                pass: constant_1.SMTP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"${constant_1.SMTP_NAME}" <${EMAIL_VERIFY}>`,
            to: params.email_to,
            subject: params.subject,
            html: params.htmlContent,
        };
        const info = await transporter.sendMail(mailOptions);
        await email_model_1.default.create({
            status: true,
            statusAt: new Date(),
            observation: info.response,
            message: params.htmlContent,
            email: params.email_to,
            objet: params.subject,
        });
        console.log("Email sent:", info.response);
    }
    catch (error) {
        await email_model_1.default.create({
            status: false,
            statusAt: new Date(),
            observation: error.message,
            message: params.htmlContent,
            email: params.email_to,
            objet: params.subject,
        });
        console.error("Error sending email:", error);
    }
};
exports.default = {
    getHtmTemplateEmail,
    send,
    EMAIL_VERIFY,
};
