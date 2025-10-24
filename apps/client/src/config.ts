export const ENVIRONMENT = window.location.hostname.includes("oneworld.com") ? "Production" : window.location.hostname.includes("devlab.zone") ? "Staging" : "Dev"

export const GQL_ENDPOINT = window.location.hostname.includes("oneworld.com") ? "https://oneworld-api.devlab.zone/api/graphql" : window.location.hostname.includes("webflow.io") ? "https://oneworld-dev.devlab.zone/api/graphql" : window.location.hostname.includes("devlab.zone") ? "https://oneworld-staging.devlab.zone/api/graphql" : "http://localhost:4020/api/graphql"

export const S3_BASE_URL = window.location.hostname.includes("oneworld.com") ? "https://oneworld-prod.s3.amazonaws.com/" : window.location.hostname.includes("devlab.zone") ? "https://oneworld-staging.s3.amazonaws.com/" : "https://oneworld-dev.s3.amazonaws.com/";

export const ADMIN_PATHS = {
  signIn: "/admin/sign-in",
  dashboardOnly: "/admin/dashboard",
  dashboardLanding: "/admin/dashboard/main",
  courseList: "/admin/dashboard/course/list",
  courseView: "/admin/dashboard/course/view",
  userList: "/admin/dashboard/user/list",
  userView: "/admin/dashboard/user/view",
  notificationList: "/admin/dashboard/notification/list",
  notificationCreate:
    "/admin/dashboard/notification/create",
  settings: "/admin/dashboard/settings",
  certificationsList: "/admin/dashboard/certifications/list",
  certificationsView: "/admin/dashboard/certifications/view"
};

export const PUBLIC_PATHS = {
  landingPage: "",
  unsubscribePage: "/unsubscribe",
  signIn: "/user/sign-in",
  signUp: "/user/sign-up",
  userVerification: "/user/verify",
  dashboardOnly: "/user/dashboard",
  dashboardMain: "/user/dashboard/main",
  viewCourse: "/user/dashboard/course-view",
  forgotPassword: "/user/forgot-password",
  resetPassword: "/user/reset-password",
  certificates: "/user/dashboard/certificate/list",
  certificationDetails: "/user/dashboard/certificate/details",
  courseHightlights:
    "/user/dashboard/certificate/view",
  notifications: "/user/dashboard/notification",
  settings: "/user/dashboard/user-settings",
  onboarding: "/user/dashboard/on-boarding",
  saved: "/user/dashboard/saved",
  courseDetails: "/user/dashboard/course-details",
  courseList: "/user/dashboard/course-list"
};

export const slideTemplateInputsData = [
  {
    slideName: "Intro",
    key: "intro",
    selector: `[xa-template-key="intro"]`,
    editable: [
      {
        label: "Course Tag",
        selector: `coursetag`,
        type: "text",
      },
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Description",
        selector: `description`,
        type: "rt",
      }
    ],
  },
  {
    slideName: "Icon Heading Description",
    key: "icon_heading_rt",
    selector: `[xa-template-key="icon_heading_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Heading Description",
    key: "heading_rt",
    selector: `[xa-template-key="heading_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Description Heading Video",
    key: "rt_heading_video",
    selector: `[xa-template-key="rt_heading_video"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Outro",
    key: "outro",
    selector: `[xa-template-key="outro"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Description",
        selector: `description`,
        type: "text",
      },
      {
        label: "Button Text",
        selector: `button`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Description Heading Full Image Description",
    key: "rt_heading_fullimage_rt",
    selector: `[xa-template-key="rt_heading_fullimage_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Middle Description",
    key: "middle_rt",
    selector: `[xa-template-key="middle_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Heading Full Image",
    key: "heading_fullimage",
    selector: `[xa-template-key="heading_fullimage"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Left Icon Heading Description",
    key: "left_icon_heading_rt",
    selector: `[xa-template-key="left_icon_heading_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Middle Heading Image Description",
    key: "middle_heading_image_rt",
    selector: `[xa-template-key="middle_heading_image_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Special With Popup",
    key: "special_with_popup",
    selector: `[xa-template-key="special_with_popup"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Link Text",
        selector: `linktext`,
        type: "text",
      },
      {
        label: "V1 Text",
        selector: `v1-text`,
        type: "text",
      },
      {
        label: "V1 Sub",
        selector: `v1-sub`,
        type: "text",
      },
      {
        label: "V2 Text",
        selector: `v2-text`,
        type: "text",
      },
      {
        label: "V2 Sub",
        selector: `v2-sub`,
        type: "text",
      },
      {
        label: "V3 Text",
        selector: `v3-text`,
        type: "text",
      },
      {
        label: "V3 Sub",
        selector: `v3-sub`,
        type: "text",
      },
      {
        label: "V4 Text",
        selector: `v4-text`,
        type: "text",
      },
      {
        label: "V4 Sub",
        selector: `v4-sub`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Description Heading Image Description",
    key: "rt_heading_image_rt",
    selector: `[xa-template-key="rt_heading_image_rt"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "rt",
      },
      {
        label: "Content",
        selector: `content`,
        type: "rt",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Special 3",
    key: "special3",
    selector: `[xa-template-key="special3"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "rt",
      },
      {
        label: "SPL Link1 Text",
        selector: `spl1-text`,
        type: "text",
      },
      {
        label: "SPL Link2 Text",
        selector: `spl2-text`,
        type: "text",
      },
      {
        label: "SPL Link3 Text",
        selector: `spl3-text`,
        type: "text",
      },
      {
        label: "SPL Link4 Text",
        selector: `spl4-text`,
        type: "text",
      },
      {
        label: "SPL Link5 Text",
        selector: `spl5-text`,
        type: "text",
      },
      {
        label: "SPL Link6 Text",
        selector: `spl6-text`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Special 1 with popup",
    key: "special1_with_popup",
    selector: `[xa-template-key="special1_with_popup"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Popup1 Heading",
        selector: `popup1-heading`,
        type: "text",
      },
      {
        label: "Popup1 Link Text",
        selector: `popup1-link-text`,
        type: "text",
      },
      {
        label: "Popup2 Heading",
        selector: `popup2-heading`,
        type: "text",
      },
      {
        label: "Popup2 Link Text",
        selector: `popup2-link-text`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
  {
    slideName: "Special 2",
    key: "special2",
    selector: `[xa-template-key="special2"]`,
    editable: [
      {
        label: "Heading",
        selector: `heading`,
        type: "text",
      },
      {
        label: "Description",
        selector: `description`,
        type: "text",
      },
      {
        label: "Popup1 Heading",
        selector: `popup1-heading`,
        type: "text",
      },
      {
        label: "Popup2 Heading",
        selector: `popup2-heading`,
        type: "text",
      },
      {
        label: "Popup3 Heading",
        selector: `popup3-heading`,
        type: "text",
      },
      {
        label: "Card Title",
        selector: `cardTitle`,
        type: "text",
      },
    ],
  },
];

export const shadowBackgroundColors = ["#FF909B", "#CAE691", "#ABE9FF", "#F9D25D"];

export const OAUTH_AUTHORIZE_URL = window.location.hostname.includes("oneworld.com") ? "https://bi.oneworld.com/opass/oauth/authorize" : "https://bi-siteacceptance.oneworld.com/opass/oauth/authorize";

export const OATH_TOKEN_URL = window.location.hostname.includes("oneworld.com") ? "https://bi.oneworld.com/opass/oauth/token" : "https://bi-siteacceptance.oneworld.com/opass/oauth/token";

export const OAUTH_REVOKE_URL = "";

export const OATH_CLIENT_ID = window.location.hostname.includes("oneworld.com") ? "mogultraining" : "lmsmoguldev"

export const OAUTH_CALLBACK_URL = window.location.hostname.includes("oneworld.com") ? "https://oneworld-api.devlab.zone/sso" : "https://oneworld-dev.devlab.zone/sso";

export const PROFILE_API_URL = window.location.hostname.includes("oneworld.com") ? "https://bi.oneworld.com/opass/api/profile" : "https://bi-siteacceptance.oneworld.com/opass/api/profile";
