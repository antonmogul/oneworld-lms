import axios from "axios";
import WelcomeEmail from "./templates/welcomeEmail";
import { POSTMARK_EMAIL_API_ENDPOINT, POSTMARK_FROM_EMAIL } from "@config/global";
import CourseCompleteReminderEmail, { CourseCompleteReminderParams } from "./templates/courseCompleteReminder";
import WelcomeEmail2, { WelcomeEmail2Params } from "./templates/welcomeEmail2";
import { WelcomeEmailParams } from "./templates/welcomeEmail";
import ResetPasswordEmail, { ResetPasswordEmailParams } from "./templates/resetPassword";
import VerificationOTPEmail, { VerificationOTPEmailParams } from "./templates/verificationOTP";
import CourseCompletionEmail, { CourseCompletionEmailParams } from "./templates/courseCompletionEmail";

export enum emailTemplates {
    WELCOME_EMAIL = "Welcome Email",
    WELCOME_EMAIL_2 = "Welcome Email 2",
    COURSE_COMPLETE_REMINDER = "Course Complete Reminder",
    RESET_PASSWORD = "Reset Password",
    VERIFICATION_OTP = "Verification OTP",
    COURSE_COMPLETION = "Course Completion"
}

const sendEmail = (To: string, Subject: string, TextBody: string, HtmlBody: string, Cc: string = "", Bcc: string = "") => {
    return new Promise((resolve, reject) => {
        axios.post(
            `${POSTMARK_EMAIL_API_ENDPOINT}/email`,
            {
                From: POSTMARK_FROM_EMAIL,
                To,
                Subject,
                TextBody,
                HtmlBody,
                Cc,
                Bcc
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN
                }
            }
        ).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        });
    });
}


export const sendEmailWithTemplate = async (
    To: string,
    emailTemplate: emailTemplates,
    templateParams: Object,
    Cc: string = "",
    Bcc: string = ""
) => {
    let data: { Subject: string, TextBody: string, HtmlBody: string };

    switch (emailTemplate) {
        case "Welcome Email":
            const welcomeEmailParams: WelcomeEmailParams = { email: templateParams["email"], name: templateParams["name"] };
            data = WelcomeEmail(welcomeEmailParams);
            break;
        case "Welcome Email 2":
            const welcomeEmail2Params: WelcomeEmail2Params = { email: templateParams["email"], name: templateParams["name"] };
            data = WelcomeEmail2(welcomeEmail2Params);
            break;
        case "Course Complete Reminder":
            const courseCompleteReminderParams: CourseCompleteReminderParams = { 
                courseId: templateParams["courseId"],
                courseName: templateParams["courseName"],
                name: templateParams["name"],
                progress: templateParams["progress"],
                email: templateParams["email"],
                courseImage: templateParams["courseImage"]
            };
            data = CourseCompleteReminderEmail(courseCompleteReminderParams);
            break;
        case "Reset Password":
            const resetPasswordParams: ResetPasswordEmailParams = { email: templateParams["email"], token: templateParams["token"] };
            data = ResetPasswordEmail(resetPasswordParams);
            break;
        case "Verification OTP":
            const verificationOTPParams: VerificationOTPEmailParams = { email: templateParams["email"], otp: templateParams["otp"] };
            data = VerificationOTPEmail(verificationOTPParams);
            break;
        case "Course Completion":
            const courseCompletionParams: CourseCompletionEmailParams = { 
                name: templateParams["name"],
                courseName: templateParams["courseName"],
                completionDate: templateParams["completionDate"],
                certificateName: templateParams["certificateName"],
                email: templateParams["email"]
            }
            data = CourseCompletionEmail(courseCompletionParams);
            break;
    }

    const result = await sendEmail(To, data.Subject, data.TextBody, data.HtmlBody, Cc, Bcc);

    return result;
}