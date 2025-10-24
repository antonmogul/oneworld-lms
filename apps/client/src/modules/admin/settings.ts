import { WFFormComponent, navigate } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminChangePasswordDocument, AdminMeDocument } from "../../graphql/graphql"
import { setAdminAuthDetails } from "../../auth/admin";
import { ADMIN_PATHS } from "../../config";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";

// getSkeletonLoader().show();

export const adminSettings = () => {
    const adminMeReq = adminQL.query(AdminMeDocument);
    const adminChangePasswordReq = adminQL.mutation(AdminChangePasswordDocument);
    let email: string;
    const settingsForm = new WFFormComponent<{
        adminName: string
        adminEmail: string
    }>(`[xa-type="adminSettings"]`);
    adminMeReq.onData((data) => {
        settingsForm.updateTextViaAttrVar({
            adminName: `${data.adminMe.firstName} ${data.adminMe.lastName}`,
            adminEmail: data.adminMe.email
        });
        email = data.adminMe.email;
        showData().show();
    });

    adminMeReq.fetch();

    const changePasswordForm = new WFFormComponent<{
        "current-password": string,
        "new-password": string,
        "new-password2": string
    }>(`[xa-type="adPasswordChangeD"]`);
    adminChangePasswordReq.onData((data) => {
        setAdminAuthDetails(
            `${data.adminChangePassword.firstName} ${data.adminChangePassword.lastName}`,
            email,
            data.adminChangePassword.token
        );
        setTimeout(() => {
            navigate(ADMIN_PATHS.dashboardLanding);
        }, 2000);
    });

    adminChangePasswordReq.onError((err) => {
        alert(err.message || "Something went wrong while updating password!");
    });

    changePasswordForm.onFormSubmit((data) => {
        if (data["new-password"] === data["new-password2"]) {
            adminChangePasswordReq.fetch({
                newPassword: data["new-password2"],
                oldPassword: data["current-password"]
            });
        } else {
            alert("New passwords are not matching!");
        }
    });
}