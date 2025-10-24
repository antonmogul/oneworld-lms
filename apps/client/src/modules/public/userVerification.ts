import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicForgotPasswordDocument, PublicResendLoginOtpDocument, VerifyLoginOtpDocument, VerifySignupOtpDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { setPublicAuthDetails } from "../../auth/public";

export const userVerification = (pageQuery: { type: string, newSSOUser: string }) => {
  const newSSOUser = pageQuery.newSSOUser === "true" ? true : false;
  const headerSection = new WFComponent(".header");
  const topNav = new WFComponent(".top-nav");
  const resendOTPReq = publicQL.mutation(PublicResendLoginOtpDocument);
  const userLoginVerificationReq = publicQL.mutation(VerifyLoginOtpDocument);
  const userSignupVerificationReq = publicQL.mutation(VerifySignupOtpDocument);
  const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
  const headingText = headerSection.getChildAsComponent(`[xa-type="loginHeading"]`);
  const headingDesc = headerSection.getChildAsComponent(`[xa-type="loginDesc"]`);
  const mobileSubmit = new WFComponent(`[xa-type="continueM"]`);
  const resendButton = new WFComponent(`[xa-type="resendLink"]`);
  const mobileResendButton = new WFComponent(`[xa-type="resendLinkM"]`);
  const submitButton = new WFComponent(`[xa-type="submitButton"]`);
  const verificationForm = new WFFormComponent<{
    "Verification-Code": string;
    "Remember-Me": string;
  }>(`[xa-type="userVerifyForm"]`);

  verificationForm.removeCssClass("form-disabled");
  submitButton.setAttribute("value", "Continue");
  mobileSubmit.setAttribute("value", "Continue");
  submitButton.removeAttribute("disabled");
  submitButton.removeCssClass("is--disabled");
  mobileSubmit.removeAttribute("disabled");
  mobileSubmit.removeCssClass("is--disabled");

  const email = sessionStorage.getItem("verificationEmail");

  let OTPAttempts = localStorage.getItem("ow-sc-voac") ? parseInt(localStorage.getItem("ow-sc-voac")) : 0;
  
  if (email && pageQuery && pageQuery.type) {
    headingText.getElement().innerHTML = "Verification Code";
    headingDesc.getElement().innerHTML = "Enter your 2-FA verification code sent on your email";

    mobileSubmit.on("click", () => {
      submitButton.getElement().click();
    });

    mobileResendButton.on("click", () => {
      resendButton.getElement().click();
    });

    resendButton.on("click", () => {
      resendOTPReq.fetch({ email, OTPType: pageQuery.type === "login" ? "LOGIN" : "SIGNUP" });
      const successMessageContainer = new WFComponent(".w-form-done");
      successMessageContainer.getChildAsComponent("div").setText("New OTP has been sent to your email.");
      verificationForm.showSuccessState();
      setTimeout(() => {
        verificationForm.showForm();
      }, 3000);
    });

    verificationForm.onFormSubmit((data) => {
      if (OTPAttempts < 5) {
        OTPAttempts = localStorage.getItem("ow-sc-voac") ? parseInt(localStorage.getItem("ow-sc-voac")) + 1 : 1;
        localStorage.setItem("ow-sc-voac", JSON.stringify(OTPAttempts));
        topNav.removeCssClass("is--error");
        headerSection.removeCssClass("is--error");
        headingText.getElement().innerHTML = "Verification Code";
        headingDesc.getElement().innerHTML = "Enter your 2-FA verification code sent on your email";
        if (pageQuery.type === "login") {
          userLoginVerificationReq.fetch({
            email,
            otp: data["Verification-Code"],
            rememberMe: !!data["Remember-Me"]
          });
        } else {
          userSignupVerificationReq.fetch({
            email,
            otp: data["Verification-Code"],
            rememberMe: !!data["Remember-Me"]
          });
        }
      }
    });

    forgotPasswordReq.onError((err) => {
      const errMessage = err && err.message ? err.message : "Something went wrong!";
      topNav.addCssClass("is--error");
      headerSection.addCssClass("is--error");
      headingText.getElement().innerHTML = "Reset Password Error!";
      headingDesc.getElement().innerHTML = errMessage;
      headingText.addCssClass("is--error");
      headingDesc.addCssClass("is--error");
    });

    forgotPasswordReq.onData((data) => {
      setTimeout(() => {
        sessionStorage.setItem("verificationEmail", email);
        localStorage.removeItem("ow-sc-voac");
        OTPAttempts = 0;
        navigate(`${PUBLIC_PATHS.forgotPassword}?action=frp`);
      }, 5000);
    });

    userLoginVerificationReq.onError((err) => {
      topNav.addCssClass("is--error");
      headerSection.addCssClass("is--error");
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        headingText.getElement().innerHTML = "Verification Error!";
        headingDesc.getElement().innerHTML = `You have exceeded OTP attempts limit! Please reset password!`;
        headingText.addCssClass("is--error");
        headingDesc.addCssClass("is--error");
        setTimeout(() => {
          forgotPasswordReq.fetch({
            email: email
          });
          verificationForm.disableForm();
          verificationForm.updateSubmitButtonText("Redirecting...");
        }, 3000);
      } else {
        if (err && err.message) {
          headingText.getElement().innerHTML = "Oops!";
          headingDesc.getElement().innerHTML = err.message;
        } else {
          headingText.getElement().innerHTML = "Oops!";
          headingDesc.getElement().innerHTML = "Something went wrong! Please try again.";
        }
        headingText.addCssClass("is--error");
        headingDesc.addCssClass("is--error");
      }
    });

    userLoginVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
        mobileSubmit.getElement().innerHTML = "Redirecting...";
      }, 100);

      setPublicAuthDetails(
        `${data.verifyLoginOTP.firstName} ${data.verifyLoginOTP.lastName}`,
        email,
        data.verifyLoginOTP.token
      );
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        if (newSSOUser) {
          navigate(PUBLIC_PATHS.onboarding);
        } else {
          navigate(PUBLIC_PATHS.dashboardMain);
        }
      }, 500);
    });

    userSignupVerificationReq.onError((err) => {
      topNav.addCssClass("is--error");
      headerSection.addCssClass("is--error");
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        headingText.getElement().innerHTML = "Verification Error!";
        headingDesc.getElement().innerHTML = `You have exceeded OTP attempts limit! Please reset password!`;
        headingText.addCssClass("is--error");
        headingDesc.addCssClass("is--error");
        setTimeout(() => {
          forgotPasswordReq.fetch({
            email: email
          });
          verificationForm.disableForm();
          verificationForm.updateSubmitButtonText("Redirecting...");
        }, 3000);
      } else {
        if (err && err.message) {
          headingText.getElement().innerHTML = "Oops!";
          headingDesc.getElement().innerHTML = err.message;
        } else {
          headingText.getElement().innerHTML = "Oops!";
          headingDesc.getElement().innerHTML = "Something went wrong! Please try again.";
        }
        headingText.addCssClass("is--error");
        headingDesc.addCssClass("is--error");
      }
    });

    userSignupVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
        mobileSubmit.getElement().innerHTML = "Redirecting...";
      }, 100);

      setPublicAuthDetails(
        `${data.verifySignupOTP.firstName} ${data.verifySignupOTP.lastName}`,
        email,
        data.verifySignupOTP.token
      );
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(PUBLIC_PATHS.onboarding);
      }, 500);
    });
  } else {
    if (pageQuery && pageQuery.type) {
      if (pageQuery.type === "login") {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.signIn);
        }, 500);
      } else {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.signUp);
        }, 500);
      }
    } else {
      setTimeout(() => {
        navigate(PUBLIC_PATHS.signIn);
      }, 500);
    }
  }
};

