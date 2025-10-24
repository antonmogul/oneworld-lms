import { WFRoute, navigate } from "@xatom/core";
import { ADMIN_PATHS } from "../../config";
import {
  adminAuth,
  adminMiddleware,
} from "../../auth/admin";
import { signIn } from "../../modules/admin/auth";
import landing from "../../modules/admin/landing";
import adminHeader from "../../modules/admin/adminHeader";
import {
  userListing,
  userSingleUser,
} from "../../modules/admin/user";
import {
  createNotification,
  listNotification,
} from "../../modules/admin/notification";
import {
  courseListing,
  createCourse,
} from "../../modules/admin/course";
import { adminSettings } from "../../modules/admin/settings";
import { createCertification, listCertifications } from "../../modules/admin/certifications";
import { adminLoginAlert } from "../../modules/public/adminLoginAlert";

const adminRoutes = () => {
  new WFRoute(ADMIN_PATHS.signIn)
    .withMiddleware(adminMiddleware, "NONE", "allow", {
      onError: () => {
        console.log("err");
        adminLoginAlert();
      },
    })
    .execute(signIn);

  new WFRoute(`${ADMIN_PATHS.dashboardOnly}/(.*)`)
    .withMiddleware(adminMiddleware, "ADMIN", "allow", {
      onError: () => {
        adminAuth.logout();
        navigate({
          to: ADMIN_PATHS.signIn,
          type: "replace",
        });
      },
    })
    .execute(() => {
      //admin header
      adminHeader();
      new WFRoute(ADMIN_PATHS.dashboardLanding).execute(
        landing
      );
      new WFRoute(ADMIN_PATHS.userList).execute(
        userListing
      );
      new WFRoute(ADMIN_PATHS.userView).execute(
        userSingleUser
      );
      new WFRoute(ADMIN_PATHS.notificationCreate).execute(
        createNotification
      );
      new WFRoute(ADMIN_PATHS.notificationList).execute(
        listNotification
      );
      new WFRoute(ADMIN_PATHS.courseList).execute(
        courseListing
      );
      new WFRoute(ADMIN_PATHS.courseView).execute(
        createCourse
      );
      new WFRoute(ADMIN_PATHS.settings).execute(
        adminSettings
      );
      new WFRoute(ADMIN_PATHS.certificationsList).execute(
        listCertifications
      );
      new WFRoute(ADMIN_PATHS.certificationsView).execute(
        createCertification
      );
    });
};

export default adminRoutes;
