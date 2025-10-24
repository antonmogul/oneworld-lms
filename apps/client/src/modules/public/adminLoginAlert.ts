import { WFComponent, navigate } from "@xatom/core"
import { logoutPublicAuth, publicAuth } from "../../auth/public";
import { ADMIN_PATHS, PUBLIC_PATHS } from "../../config";
import { adminAuth, logoutAdminAuth } from "../../auth/admin";

export const adminLoginAlert = () => {
    const alertModal = new WFComponent(`[xa-type="login-alert-modal"]`);
    const loginAlertDescription = new WFComponent(`[xa-type="login-alert-description"]`);
    const logoutButton = new WFComponent(`[xa-type="logout"]`);
    const continueButton = new WFComponent(`[xa-type="continue"]`);
    const isLoggedIn = adminAuth.isLoggedIn();
    if (isLoggedIn) {
        alertModal.setAttribute("style", "display: block");
        loginAlertDescription.setHTML(`You're already logged in with <strong>${adminAuth.getUser().email}</strong>. Do you want to continue with it?`);
    }

    logoutButton.on("click", () => {
        logoutAdminAuth();
    });

    continueButton.on("click", () => {
        navigate({
            to: ADMIN_PATHS.dashboardLanding,
            type: "replace",
        });
    })
}