import {
  WFComponent,
  WFFormComponent,
  navigate,
} from "@xatom/core";
import { adminQL } from "../../graphql";
import { AdminSignInDocument } from "../../graphql/graphql";
import {
  adminAuth,
  setAdminAuthDetails,
} from "../../auth/admin";
import { ADMIN_PATHS } from "../../config";
import getLoader from "../utils/getLoader";

export const signIn = () => {
  const headerSection = new WFComponent(".header");
  const headingText = headerSection.getChildAsComponent(
    `[xa-type="heading"]`
  );
  const descriptionText = headerSection.getChildAsComponent(
    `[xa-type="description"]`
  );
  const signInReq = adminQL.mutation(AdminSignInDocument);
  const signInForm = new WFFormComponent<{
    email: string;
    password: string;
  }>(`[xa-type="signin"]`);
  let email = "";

  // headerSection.updateTextVariable({
  //   heading: "Sign In",
  //   description:
  //     "Enter your login information below to continue.",
  // });

  signInForm.onFormSubmit((data) => {
    email = data.email;
    headerSection.removeCssClass("is--error");
    headingText.removeCssClass("is--error");
    descriptionText.removeCssClass("is--error");
    // headerSection.updateTextVariable({
    //   heading: "Sign In",
    //   description:
    //     "Enter your login information below to continue.",
    // });
    headingText.getElement().innerHTML = "Sign In";
    descriptionText.getElement().innerHTML = "Enter your login information below to continue.";
    signInReq.fetch({
      email: data.email,
      password: data.password,
    });
  });
  signInReq.onLoadingChange((status) => {
    if (status) signInForm.disableForm();
    else signInForm.enableForm();

    signInForm.updateSubmitButtonText(
      status ? "Please wait.." : "Sign In"
    );
  });
  signInReq.onError((err) => {
    headerSection.addCssClass("is--error");
    // headerSection.updateTextVariable({
    //   heading: "Oops!",
    //   description:
    //     err.message ||
    //     "Something went wrong! Please try again.",
    // });
    headingText.getElement().innerHTML = "Oops!";
    descriptionText.getElement().innerHTML = err.message || "Something went wrong! Please try again.";
    headingText.addCssClass("is--error");
    descriptionText.addCssClass("is--error");
  });
  signInReq.onData((data) => {
    setTimeout(() => {
      signInForm.disableForm();
      signInForm.updateSubmitButtonText("Redirecting...");
    }, 100);
    setAdminAuthDetails(
      `${data.adminSignIn.firstName} ${data.adminSignIn.lastName}`,
      email,
      data.adminSignIn.token
    );
    setTimeout(() => {
      navigate(ADMIN_PATHS.dashboardLanding);
    }, 2000);
  });
  
};
