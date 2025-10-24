import {
  WFComponent,
  WFFormComponent,
  navigate,
} from "@xatom/core";
import { publicQL } from "../../graphql";
import {
  PublicForgotPasswordDocument,
  PublicLoginDocument,
  PublicLoginSsoDocument,
  PublicSignupDocument,
} from "../../graphql/graphql";
import { OATH_CLIENT_ID, OAUTH_AUTHORIZE_URL, OAUTH_CALLBACK_URL, PUBLIC_PATHS } from "../../config";
import { setPublicAuthDetails } from "../../auth/public";

export const userSignIn = (params: { sso: string, email: string, newUser: string, autoSSO: string }) => {
  const ssoResponse = parseInt(params.sso) || 2;
  const ssoEmail = params.email ? Buffer.from(params.email, "base64").toString() : null
  const ssoIsNewUser = params.newUser === "true" ? true : false;
  let passwordAttempts = localStorage.getItem("ow-sc-pac") ? parseInt(localStorage.getItem("ow-sc-pac")) : 0;
  const headerSection = new WFComponent(".header");
  const topNav = new WFComponent(".top-nav");
  const signInReq = publicQL.mutation(PublicLoginDocument);
  const signInSSOReq = publicQL.mutation(PublicLoginSsoDocument);
  const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
  const headingText = headerSection.getChildAsComponent(`[xa-type="loginHeading"]`);
  const headingDesc = headerSection.getChildAsComponent(`[xa-type="loginDesc"]`);
  const mobileSubmit = new WFComponent(`[xa-type="signInM"]`);
  const submitButton = new WFComponent(`[xa-type="submitButton"]`);
  const ssoButton = new WFComponent(`[xa-type="submitButtonSSO"]`);
  const signInForm = new WFFormComponent<{
    email: string;
    password: string;
  }>(`[xa-type="userSignin"]`);
  let email = "";

  signInSSOReq.onData((data) => {
    setTimeout(() => {
      signInForm.disableForm();
      signInForm.updateSubmitButtonText("Redirecting...");
      mobileSubmit.getElement().innerHTML = "Redirecting...";
    }, 100);
    setPublicAuthDetails(
      `${data.publicLoginSSO.firstName} ${data.publicLoginSSO.lastName}`,
      email,
      data.publicLoginSSO.token
    );
    if (ssoIsNewUser) {
      navigate(PUBLIC_PATHS.onboarding);
    } else {
      navigate(PUBLIC_PATHS.dashboardMain);
    }
  });

  signInSSOReq.onLoadingChange((status) => {
    if (status) {
      signInForm.disableForm();
    }
    else signInForm.enableForm();
    mobileSubmit.getElement().innerHTML = status ? "Please wait.." : "Sign In";
    ssoButton.getElement().innerHTML = status ? "Please wait..." : "Login with SSO";
  });

  signInSSOReq.onError((err) => {
    topNav.addCssClass("is--error");
    headerSection.addCssClass("is--error");
    headingText.getElement().innerHTML = "Oops!";
    headingDesc.getElement().innerHTML = "Something went wrong! Please try again.";
    headingText.addCssClass("is--error");
    headingDesc.addCssClass("is--error");
  });

  signInForm.removeCssClass("form-disabled");
  submitButton.setAttribute("value", "Sign In");
  mobileSubmit.setAttribute("value", "Sign In");
  submitButton.removeAttribute("disabled");
  submitButton.removeCssClass("is--disabled");
  mobileSubmit.removeAttribute("disabled");
  mobileSubmit.removeCssClass("is--disabled");

  headingText.getElement().innerHTML = "Sign In";
  headingDesc.getElement().innerHTML = "Enter your login information below to continue.";

  if (ssoResponse === 1 && ssoEmail) {
    signInSSOReq.fetch({
      email: ssoEmail,
    });
  } else if (ssoResponse === 0) {
    topNav.addCssClass("is--error");
    headerSection.addCssClass("is--error");
    headingText.getElement().innerHTML = "Oops!";
    headingDesc.getElement().innerHTML = "Something went wrong with SSO login! Please try again.";
    headingText.addCssClass("is--error");
    headingDesc.addCssClass("is--error");
  }

  mobileSubmit.on("click", () => {
    submitButton.getElement().click();
  });

  ssoButton.on("click", () => {
    ssoButton.getElement().innerHTML = "Please wait...";
    const url = encodeURI(`${OAUTH_AUTHORIZE_URL}?type=web_server&client_id=${OATH_CLIENT_ID}&response_type=code&redirect_uri=${OAUTH_CALLBACK_URL}`);
    window.location.href = url;
  });

  signInForm.onFormSubmit((data) => {
    email = data["user-email"];
    topNav.removeCssClass("is--error");
    headerSection.removeCssClass("is--error");
    headingText.getElement().innerHTML = "Sign In";
    headingDesc.getElement().innerHTML = "Enter your login information below to continue.";
    if (passwordAttempts < 5) {
      passwordAttempts = localStorage.getItem("ow-sc-pac") ? parseInt(localStorage.getItem("ow-sc-pac")) + 1 : 1;
      localStorage.setItem("ow-sc-pac", JSON.stringify(passwordAttempts));
      signInReq.fetch({
        email: data["user-email"],
        password: data["user-password"],
      });
    }
  });
  signInReq.onLoadingChange((status) => {
    if (status) {
      signInForm.disableForm();
    }
    else signInForm.enableForm();

    signInForm.updateSubmitButtonText(
      status ? "Please wait.." : "Sign In"
    );
    mobileSubmit.getElement().innerHTML = status ? "Please wait.." : "Sign In";
  });
  signInReq.onError((err) => {
    if (passwordAttempts >= 5 && err && err.message === "Invalid email or password") {
      headingText.getElement().innerHTML = "Login Error!";
      headingDesc.getElement().innerHTML = `You have exceeded password attempts limit! Please reset password!`;
      topNav.addCssClass("is--error");
      headerSection.addCssClass("is--error");
      headingText.addCssClass("is--error");
      headingDesc.addCssClass("is--error");
      setTimeout(() => {
        forgotPasswordReq.fetch({
          email: email
        });
        signInForm.disableForm();
        signInForm.updateSubmitButtonText("Redirecting...");
      }, 3000);
    } else {
      topNav.addCssClass("is--error");
      headerSection.addCssClass("is--error");
      headingText.getElement().innerHTML = "Oops!";
      headingDesc.getElement().innerHTML = "Something went wrong! Please try again.";
      headingText.addCssClass("is--error");
      headingDesc.addCssClass("is--error");
    }
  });
  signInReq.onData((data) => {
    setTimeout(() => {
      signInForm.disableForm();
      signInForm.updateSubmitButtonText("Redirecting...");
      mobileSubmit.getElement().innerHTML = "Redirecting...";
    }, 100);
    if (data.publicLogin.id) {
      setPublicAuthDetails(
        `${data.publicLogin.firstName} ${data.publicLogin.lastName}`,
        email,
        data.publicLogin.token
      );
      navigate(PUBLIC_PATHS.dashboardMain);
    } else {
      sessionStorage.setItem("verificationEmail", email);
      setTimeout(() => {
        navigate(`${PUBLIC_PATHS.userVerification}?type=login`);
      }, 2000);
    }
  });

  forgotPasswordReq.onError((err) => {
    const errMessage = err && err.message ? err.message : "Something went wrong!";
    topNav.addCssClass("is--error");
    headerSection.addCssClass("is--error");
    headingText.getElement().innerHTML = "Reset Password Error!";
    headingText.getElement().innerHTML = errMessage; headingText.addCssClass("is--error");
    headingDesc.addCssClass("is--error");
  });
  forgotPasswordReq.onData((data) => {
    setTimeout(() => {
      sessionStorage.setItem("verificationEmail", email);
      navigate(`${PUBLIC_PATHS.forgotPassword}?action=frp`);
    }, 5000);
  });
  if (params && parseInt(params.autoSSO)) {
    ssoButton.getElement().click();
  }
};

export const userSignup = () => {
  const headerSection = new WFComponent(".header");
  const topNav = new WFComponent(".top-nav");
  const signUpReq = publicQL.mutation(PublicSignupDocument);
  const headingText = headerSection.getChildAsComponent(`[xa-type="loginHeading"]`);
  const headingDesc = headerSection.getChildAsComponent(`[xa-type="loginDesc"]`);
  const mobileSubmit = new WFComponent(`[xa-type="signUpM"]`);
  const submitButton = new WFComponent(`[xa-type="submitButton"]`);
  const signUpForm = new WFFormComponent<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>(`[xa-type="userSignup"]`);
  let email = "";

  signUpForm.removeCssClass("form-disabled");
  submitButton.setAttribute("value", "Create Account");
  mobileSubmit.setAttribute("value", "Create Account");
  submitButton.removeAttribute("disabled");
  submitButton.removeCssClass("is--disabled");
  mobileSubmit.removeAttribute("disabled");
  mobileSubmit.removeCssClass("is--disabled");

  headingText.getElement().innerHTML = "Register";
  headingDesc.getElement().innerHTML = "Create an account with oneworld.";

  mobileSubmit.on("click", () => {
    submitButton.getElement().click();
  });

  signUpForm.onFormSubmit((data) => {
    email = data["user-email"];
    topNav.removeCssClass("is--error");
    headerSection.removeCssClass("is--error");

    headingText.getElement().innerHTML = "Register";
    headingDesc.getElement().innerHTML = "Create an account with oneworld.";

    signUpReq.fetch({
      firstName: data["first-name"],
      lastName: data["last-name"],
      email: data["user-email"],
      password: data["user-password"],
    });
  });
  signUpReq.onLoadingChange((status) => {
    if (status) signUpForm.disableForm();
    else signUpForm.enableForm();

    signUpForm.updateSubmitButtonText(
      status ? "Please wait.." : "Create Account"
    );
    mobileSubmit.getElement().innerHTML = status ? "Please wait.." : "Create Account";
  });
  signUpReq.onError((err) => {
    headerSection.addCssClass("is--error");
    topNav.addCssClass("is--error");

    headingText.getElement().innerHTML = "Oops!";
    headingDesc.getElement().innerHTML = err?.message || "Something went wrong! Please try again.";
  });
  signUpReq.onData((data) => {
    setTimeout(() => {
      signUpForm.disableForm();
      signUpForm.updateSubmitButtonText("Redirecting...");
      mobileSubmit.getElement().innerHTML = "Redirecting...";
    }, 100);
    sessionStorage.setItem("verificationEmail", email);
    setTimeout(() => {
      navigate(`${PUBLIC_PATHS.userVerification}?type=signup`);
    }, 2000);
  });

};
