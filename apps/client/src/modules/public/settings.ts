import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicChangePasswordDocument, UserMeDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { logoutPublicAuth } from "../../auth/public";
import { showData } from "../utils/loadData";

export const userSettings = () => {
    const userDataReq = publicQL.query(
        UserMeDocument
    );
    const passChangeReq = publicQL.mutation(PublicChangePasswordDocument);
    const userInitialsText = new WFComponent(`[xa-var="userInitialsText"]`);

    const passChangeFormD = new WFFormComponent<{
        oldPass: string;
        newPass: string;
        repeatPass: string
    }>(`[xa-type="changePasswordD"]`);
    let oPass = "";
    let nPass = "";
    let rePass = "";
    passChangeFormD.updateTextViaAttrVar({
        passwordError: "",
    });
    const submitButtonD = passChangeFormD.getChildAsComponent('[xa-type="submitButton"]');

    const passChangeFormM = new WFFormComponent<{
        oldPass: string;
        newPass: string;
        repeatPass: string;
    }>(`[xa-type="changePasswordM"]`);
    const submitButtonM = passChangeFormM.getChildAsComponent('[xa-type="submitButtonM"]');
    const errorMessageM = document.getElementById("errormessageM");

    const editPassHeader = new WFComponent(`[xa-type="change-password-header"]`);
    const editPassHeaderM = new WFComponent(`[xa-type="change-password-headerM"]`);
    const oldPassFieldD = passChangeFormD.getChildAsComponent(`[xa-type="current-password-field"]`);
    const newPassFieldD = passChangeFormD.getChildAsComponent(`[xa-type="new-password-field"]`);
    const repeatPassFieldD = passChangeFormD.getChildAsComponent(`[xa-type="repeat-password-field"]`);
    const oldPassFieldM = passChangeFormM.getChildAsComponent(`[xa-type="current-password-fieldM"]`);
    const newPassFieldM = passChangeFormM.getChildAsComponent(`[xa-type="new-password-fieldM"]`);
    const repeatPassFieldM = passChangeFormM.getChildAsComponent(`[xa-type="repeat-password-fieldM"]`);

    passChangeFormD.removeCssClass("form-disabled");
    passChangeFormM.removeCssClass("form-disabled");
    submitButtonD.setAttribute("value", "Save Password");
    submitButtonM.setAttribute("value", "Save Password");
    submitButtonD.removeCssClass("is--disabled");
    submitButtonM.removeCssClass("is--disabled");
    submitButtonD.removeAttribute("disabled");
    submitButtonM.removeAttribute("disabled");

    // User details load
    const userDetailsContainer = new WFComponent("#userDetails");
    const userName = userDetailsContainer.getChildAsComponent(`[xa-type="userFName"]`);
    const userEmail = userDetailsContainer.getChildAsComponent(`[xa-type="userEmail"]`);
    userDataReq.onData((data) => {
        userName.getElement().innerHTML = `${data.userMe.firstName} ${data.userMe.lastName}`;
        userEmail.getElement().innerHTML = `${data.userMe.email}`;
        const initials = getInitials(`${data.userMe.firstName} ${data.userMe.lastName}`);
        userInitialsText.setText(initials);
        showData().show();
    });
    userDataReq.fetch();

    // User password change
    passChangeFormD.onFormSubmit((data) => {
        editPassHeader.setText("Change Password");
        editPassHeader.removeCssClass("is--error");
        newPassFieldD.removeCssClass("is--error");
        repeatPassFieldD.removeCssClass("is--error");
        oldPassFieldD.removeCssClass("is--error");
        oPass = data["current-password"];
        nPass = data["new-password"];
        rePass = data["repeat-password"];
        if (nPass === rePass && nPass !== oPass) {

            passChangeReq.fetch({
                oldPassword: data["current-password"],
                newPassword: data["new-password"],
            });
        } else if (nPass === oPass) {
            editPassHeader.setText("New password can't be same as old one");
            editPassHeader.addCssClass("is--error");
            newPassFieldD.addCssClass("is--error");
            repeatPassFieldD.addCssClass("is--error");
        } else {

            editPassHeader.setText("New passwords don't match");
            editPassHeader.addCssClass("is--error");
            newPassFieldD.addCssClass("is--error");
            repeatPassFieldD.addCssClass("is--error");
        }
    });

    passChangeFormM.onFormSubmit((data) => {
        editPassHeaderM.setText("Change Password");
        editPassHeaderM.removeCssClass("is--error");
        newPassFieldM.removeCssClass("is--error");
        repeatPassFieldM.removeCssClass("is--error");
        oldPassFieldM.removeCssClass("is--error");
        oPass = data["current-password"];
        nPass = data["new-password"];
        rePass = data["repeat-password"];
        if (nPass === rePass && nPass !== oPass) {

            passChangeReq.fetch({
                oldPassword: data["current-password"],
                newPassword: data["new-password"],
            });
        } else if (nPass === oPass) {
            editPassHeaderM.setText("New password can't be same as old one");
            editPassHeaderM.addCssClass("is--error");
            newPassFieldM.addCssClass("is--error");
            repeatPassFieldM.addCssClass("is--error");
        }else {
            editPassHeaderM.setText("New passwords don't match");
            editPassHeaderM.addCssClass("is--error");
            newPassFieldM.addCssClass("is--error");
            repeatPassFieldM.addCssClass("is--error");

        }
    });

    passChangeReq.onError((err) => {
        if (err.message === 'Invalid password') {
            editPassHeader.setText("Wrong old password!");
            editPassHeader.addCssClass("is--error");
            editPassHeaderM.setText("Wrong old password!");
            editPassHeaderM.addCssClass("is--error");
            oldPassFieldD.addCssClass("is--error");
            oldPassFieldM.addCssClass("is--error");
        } else {
            editPassHeader.setText("There was an error! Try later.");
            editPassHeader.addCssClass("is--error");
            editPassHeaderM.setText("There was an error! Try later.");
            editPassHeaderM.addCssClass("is--error");
        }
    });

    passChangeReq.onLoadingChange((status) => {
        if (status) { 
            passChangeFormD.disableForm(); 
            passChangeFormM.disableForm(); 
        
            editPassHeader.setText("Working on it...");
            editPassHeader.removeCssClass("is--error");
            editPassHeaderM.setText("Working on it...");
            editPassHeaderM.removeCssClass("is--error");
        }
        else { 
        
            passChangeFormD.enableForm(); 
            passChangeFormM.enableForm(); 
        }

        passChangeFormD.updateSubmitButtonText(
            status ? "Please wait.." : "Save Password"
        );

        passChangeFormM.updateSubmitButtonText(
            status ? "Please wait.." : "Save Password"
        );
    });

    passChangeReq.onData((data) => {

        editPassHeader.setText("Successfully changed");
        editPassHeader.addCssClass("is--success");
        editPassHeaderM.setText("Successfully changed");
        editPassHeaderM.addCssClass("is--success");

        setTimeout(() => {
        editPassHeader.setText("Logging out...");
        editPassHeader.removeCssClass("is--success");
        editPassHeaderM.setText("Logging out...");
        editPassHeaderM.removeCssClass("is--success");
            
        logoutPublicAuth();
            navigate(PUBLIC_PATHS.signIn);
        }, 2000);

    });

    function getInitials(name) {
        const words = name.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
        return initials;
    }
};

export default userSettings;