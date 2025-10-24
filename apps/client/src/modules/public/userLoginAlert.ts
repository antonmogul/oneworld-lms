import { WFComponent, navigate } from "@xatom/core"
import { logoutPublicAuth, publicAuth } from "../../auth/public";
import { PUBLIC_PATHS } from "../../config";

export const userLoginAlert = () => {
    const alertModal = new WFComponent(`[xa-type="login-alert-modal"]`);
    const loginAlertDescription = new WFComponent(`[xa-type="login-alert-description"]`);
    const logoutButton = new WFComponent(`[xa-type="logout"]`);
    const continueButton = new WFComponent(`[xa-type="continue"]`);
    const isLoggedIn = publicAuth.isLoggedIn();
    const urlParams = new URLSearchParams(window.location.search);
    const autoSSO = !!parseInt(urlParams.get('autoSSO'));
    if (isLoggedIn) {
        alertModal.setAttribute("style", "display: block");
        loginAlertDescription.setHTML(`You're already logged in with <strong>${publicAuth.getUser().email}</strong>. Do you want to continue with it?`);
    }

    logoutButton.on("click", () => {
        logoutPublicAuth(autoSSO);
    });

    continueButton.on("click", () => {
        navigate({
            to: PUBLIC_PATHS.dashboardMain,
            type: "replace",
        });
    })
}