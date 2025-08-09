import transactionalEmailsApi, { sender } from './brevo.config.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

//Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) =>{
  const sendSmtpEmail = {
    sender,
    to: [{ email }],
    subject: 'Verify your e-mail',
    htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
  };

  try {
        const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('Verification email sent:', response);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
}; 

//Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
    const sendSmtpEmail = {
        sender,
        to: [{ email }],
        subject: 'Welcome to our app',
        htmlContent: `<p>Hello ${name}, welcome to our app!</p>`, // Podés usar plantilla o texto simple
    };

  try {
        const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('Welcome email sent:', response);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

//Send Reset Password Email
export const sendResetPasswordEmail = async (email, resetURL) => {
  const sendSmtpEmail = {
        sender,
        to: [{ email }],
        subject: 'Reset password',
        htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE(resetURL),
    };

  try {
        const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('Reset password email sent:', response);
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error(`Error sending reset password email: ${error.message}`);
    }
};

//Send successful reset email
export const sendSuccessResetEmail = async (email) => {
  const sendSmtpEmail = {
        sender,
        to: [{ email }],
        subject: 'Password reset successfully',
        htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

  try {
        const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('Success reset email sent:', response);
    } catch (error) {
        console.error('Error sending success reset email:', error);
        throw new Error(`Error sending success reset email: ${error.message}`);
    }
};