import 'dotenv/config'
import { sendEmail } from "../utils/sendEmail.js";

export const sendVerificationEmail = async (user, host) => {
    const link = `http://${host}/verify-email/${user.emailToken}`;
    return sendEmail({
        to: user.email,
        subject: "Email Verification",
        html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
      <h1>Welcome to Our App!</h1>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Hi ${user.username || ''},</p>
      <p>Thank you for signing up. Please verify your email address to get started:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-weight: bold;">Verify Email</a>
      </div>
      <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;"><a href="${link}">${link}</a></p>
      <p>Welcome aboard,<br>The Team</p>
    </div>
    <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
      <p>If you did not sign up for this account, you can safely ignore this email.</p>
    </div>
  </div>
  `,
        text: `Verify here: ${link}`,
    });
};


export const sendResetPasswordEmail = async (user, resetLink) => {
    return sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #FF6B6B; color: white; padding: 20px; text-align: center;">
              <h1>Password Reset Request</h1>
            </div>
            <div style="padding: 30px; color: #333;">
              <p>Hi ${user.username || ""},</p>
              <p>You are receiving this email because a password reset request was made for your account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #FF6B6B; color: white; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-weight: bold;">Reset Password</a>
              </div>
              <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
              <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Stay safe,<br>The Team</p>
            </div>
          </div>
        `,
        text: `Reset here: ${resetLink}`,
    });
};

export const sendPasswordChangedEmail = async (user, frontendUrl) => {
    return sendEmail({
        to: user.email,
        subject: "Password Changed Successfully",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>Password Changed Successfully</h1>
            </div>
            <div style="padding: 30px; color: #333;">
              <p>Hi ${user.username || ""},</p>
              <p>The password for your account <strong>${user.email}</strong> has been changed.</p>
              <p>If you did not make this change, please reset your password immediately and review your account security.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-weight: bold;">Login</a>
              </div>
            </div>
          </div>
        `,
        text: `Password changed successfully.`,
    });
};
