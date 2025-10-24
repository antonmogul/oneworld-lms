import { WFRoute, navigate } from "@xatom/core";
import { PUBLIC_PATHS } from "../../config";
import { publicAuth, publicMiddleware } from "../../auth/public";
import { userSignIn, userSignup } from "../../modules/public/auth";
import { userResetPassword } from "../../modules/public/resetPassword";
import { userForgotPassword } from "../../modules/public/forgotPassword";
import { userSettings } from "../../modules/public/settings";
import { userDashboardMain } from "../../modules/public/dashboardMain";
import { userCourseHighlights, userCertifications, userCertificationDetail } from "../../modules/public/certificates";
import { userSidebar } from "../../modules/public/userSidebar";
import { userNotifications } from "../../modules/public/notification";
import { courseViewPage } from "../../modules/public/courseView";
import { userSaved } from "../../modules/public/saved";
import { loadSavedItems } from "../../modules/utils/savedItemStore";
import { startCourse } from "../../modules/public/commonFunctions";
import { userVerification } from "../../modules/public/userVerification";
import { landingPage } from "../../modules/public/landingPage";
import { userCourseDetails } from "../../modules/public/courseDetails";
import { userCourseList } from "../../modules/public/courseList";
import { userLoginAlert } from "../../modules/public/userLoginAlert";
import { unsubscribePage } from "../../modules/public/unsubscribe";

const publicRoutes = () => {

    new WFRoute(PUBLIC_PATHS.landingPage).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboardMain,
                type: "replace",
            });
        },
    }).execute(
        landingPage
    );
    
    new WFRoute(PUBLIC_PATHS.signIn)
        .withMiddleware(publicMiddleware, "NONE", "allow", {
            onError: () => {
                console.log("err");
                userLoginAlert();
            },
        })
        .execute(userSignIn);


    new WFRoute(PUBLIC_PATHS.signUp).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboardMain,
                type: "replace",
            });
        },
    }).execute(
        userSignup
    );


    new WFRoute(PUBLIC_PATHS.forgotPassword).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboardMain,
                type: "replace",
            });
        },
    }).execute(
        userForgotPassword
    );

    new WFRoute(PUBLIC_PATHS.resetPassword).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboardMain,
                type: "replace",
            });
        },
    }).execute(
        userResetPassword
    );

    new WFRoute(PUBLIC_PATHS.userVerification).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboardMain,
                type: "replace",
            });
        },
    }).execute(
        userVerification
    );

    new WFRoute(PUBLIC_PATHS.unsubscribePage).execute(
        unsubscribePage
    );

    new WFRoute(`${PUBLIC_PATHS.dashboardOnly}/(.*)`)
        .withMiddleware(publicMiddleware, "USER", "allow", {
            onError: () => {
                publicAuth.logout();
                navigate({
                    to: PUBLIC_PATHS.signIn,
                    type: "replace",
                });
            },
        })
        .execute(() => {
            userSidebar();
            loadSavedItems(()=>{
                new WFRoute(PUBLIC_PATHS.dashboardMain).execute(
                    userDashboardMain
                );
                new WFRoute(PUBLIC_PATHS.courseList).execute(
                    userCourseList
                );
                new WFRoute(PUBLIC_PATHS.courseDetails).execute(
                    userCourseDetails
                );
                new WFRoute(PUBLIC_PATHS.viewCourse).execute(
                    startCourse
                )
                new WFRoute(PUBLIC_PATHS.certificates).execute(
                    userCertifications
                );
                new WFRoute(PUBLIC_PATHS.certificationDetails).execute(
                    userCertificationDetail
                );
                new WFRoute(PUBLIC_PATHS.courseHightlights).execute(
                    userCourseHighlights
                );
                new WFRoute(PUBLIC_PATHS.notifications).execute(
                    userNotifications
                )
                new WFRoute(PUBLIC_PATHS.settings).execute(
                    userSettings
                );
                new WFRoute(PUBLIC_PATHS.saved).execute(
                    userSaved
                );
            })
        });
};

export default publicRoutes;
