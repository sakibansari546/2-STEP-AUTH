import { mailtrapClient, sender } from './nodemailer.js'
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, varificationToken) => {
    const recipients = [{ email }];
    console.log(email);

    try {
        let response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", varificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, username) => {
    const recipients = [{ email }];
    console.log(email);

    try {
        let response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: `Welcoem ${username}`,
            html: `Welcome ${username}`,
            category: "Email Verification",
        })

        console.log("Welcome to MERN AUTH", response);
    } catch (error) {
        console.error(`Welcome to MERN AUTH`, error);
        throw new Error(`Welcome to MERN AUTH: ${error}`);
    }
}