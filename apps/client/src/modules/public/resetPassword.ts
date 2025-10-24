import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicResetPasswordDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";

export const userResetPassword = () => {
    const headerSection = new WFComponent(".header");
    const resetPasswordReq = publicQL.mutation(PublicResetPasswordDocument);
    const resetPasswordForm = new WFFormComponent<{
        email: string;
    }>(`[xa-type="resetPasswordForm"]`);
    let email = "";
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const mobileSubmit = new WFComponent(`[xa-type="resetPasswordM"]`);
    const submitButton = new WFComponent(`[xa-type="submitButton"]`);

    resetPasswordForm.removeCssClass("form-disabled");
    submitButton.setAttribute("value", "Reset Password");
    mobileSubmit.setAttribute("value", "Reset Password");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is--disabled");
    mobileSubmit.removeAttribute("disabled");
    mobileSubmit.removeCssClass("is--disabled");

    
    mobileSubmit.on("click", () => {
        submitButton.getElement().click();
    });

    resetPasswordForm.onFormSubmit((data) => {
        email = data["user-email"];
        headerSection.removeCssClass("is--error");
        headerSection.updateTextViaAttrVar({
            heading: "Reset Password",
            description:
                "Enter new password and click reset password",
        });
        resetPasswordReq.fetch({
            newPassword: data["new-password"],
            token
        });
    });
    resetPasswordReq.onLoadingChange((status) => {
        if (status) resetPasswordForm.disableForm();
        else resetPasswordForm.enableForm();

        resetPasswordForm.updateSubmitButtonText(
            status ? "Please wait.." : "Reset Password"
        );
        mobileSubmit.getElement().innerHTML = status ? "Please wait.." : "Reset Password";
    });
    resetPasswordReq.onError((err) => {
        headerSection.addCssClass("is--error");

        headerSection.updateTextViaAttrVar({
            heading: "Oops!",
            description:
                err.message ||
                "Something went wrong! Please try again.",
        });
    });
    resetPasswordReq.onData((data) => {
        localStorage.removeItem("ow-sc-pac");
        localStorage.removeItem("ow-sc-voac");
        setTimeout(() => {
            resetPasswordForm.disableForm();
            resetPasswordForm.updateSubmitButtonText("Redirecting...");
        }, 100);
        setTimeout(() => {
            navigate(PUBLIC_PATHS.signIn);
        }, 2000);
    });
}