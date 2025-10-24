import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicForgotPasswordDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";

export const userForgotPassword = (params: { action: string }) => {
    const headerSection = new WFComponent(".header");
    const topNav = new WFComponent(".top-nav");
    const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
    const mobileSubmit = new WFComponent(`[xa-type="resetPasswordM"]`);
    const submitButton = new WFComponent(`[xa-type="submitButton"]`);
    const forgotPasswordForm = new WFFormComponent<{
        email: string;
    }>(`[xa-type="forgotPasswordForm"]`);
    let email = "";
    const successMessageContainer = new WFComponent(".w-form-done");
    if (params.action === "frp") {
        setTimeout(() => {
            successMessageContainer.getChildAsComponent("div").setText("Password reset link has been sent to your email.");
            forgotPasswordForm.disableForm();
            forgotPasswordForm.updateSubmitButtonText("Redirecting...");
            forgotPasswordForm.showSuccessState();
        }, 100);
    }
    mobileSubmit.on("click", () => {
        submitButton.getElement().click();
    });

    forgotPasswordForm.removeCssClass("form-disabled");
    submitButton.setAttribute("value", "Reset Password");
    mobileSubmit.setAttribute("value", "Reset Password");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is--disabled");
    mobileSubmit.removeAttribute("disabled");
    mobileSubmit.removeCssClass("is--disabled");

    forgotPasswordForm.onFormSubmit((data) => {
        email = data["user-email"];
        headerSection.removeCssClass("is--error");
        topNav.removeCssClass("is--error");
        headerSection.updateTextViaAttrVar({
            heading: "Reset Password",
            description:
                "Enter your work email address to receive reset instructions.",
        });
        forgotPasswordReq.fetch({
            email: data["user-email"]
        });
    });
    forgotPasswordReq.onLoadingChange((status) => {
        if (status) forgotPasswordForm.disableForm();
        else forgotPasswordForm.enableForm();

        forgotPasswordForm.updateSubmitButtonText(
            status ? "Please wait.." : "Reset Password"
        );
        mobileSubmit.getElement().innerHTML = status ? "Please wait.." : "Reset Password";
    });
    forgotPasswordReq.onError((err) => {
        headerSection.addCssClass("is--error");
        topNav.addCssClass("is--error");
        headerSection.updateTextViaAttrVar({
            heading: "Oops!",
            description:
                err.message ||
                "Something went wrong! Please try again.",
        });
    });
    forgotPasswordReq.onData((data) => {
        setTimeout(() => {
            successMessageContainer.getChildAsComponent("div").setText("Password reset link has been sent to your email.");
            forgotPasswordForm.disableForm();
            forgotPasswordForm.updateSubmitButtonText("Redirecting...");
            forgotPasswordForm.showSuccessState();
        }, 100);
        setTimeout(() => {
            navigate(PUBLIC_PATHS.signIn);
        }, 3000);
    });
}