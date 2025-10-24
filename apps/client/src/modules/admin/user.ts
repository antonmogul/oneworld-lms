import {
  WFComponent,
  WFDynamicList,
  WFFormComponent,
  navigate,
} from "@xatom/core";
import { adminQL } from "../../graphql";
import {
  AdminGetAllUsersDocument,
  AdminGetUserDocument,
  AdminUpdateUserStatusDocument,
  Certificate,
  LessonProgress,
} from "../../graphql/graphql";
import getLoader from "../utils/getLoader";
import dayjs from "dayjs";
import { ADMIN_PATHS, S3_BASE_URL } from "../../config";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeHTMLTags } from "../utils/removeHtmlTags";

// getSkeletonLoader().show();

export const userListing = () => {
  const userListReq = adminQL.query(
    AdminGetAllUsersDocument
  );
  const userList = new WFDynamicList<
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      enabled: boolean;
      createdAt: string;
      updatedAt: string;
    },
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="list"]`, {
    rowSelector: `[xa-type="item"]`,
    loaderSelector: `[xa-type="loading"]`,
  });

  const searchText = new WFComponent("#numResults");
  const searchForm = new WFFormComponent<{
    "search-term": string;
  }>(`[xa-type="search"]`);

  searchForm.onFormSubmit((data) => {
    let listItems = [];
    if (data["search-term"].length) {
      listItems = userListReq
        .data()
        .adminGetAllUsers.filter(
          ({ email, firstName, lastName }) => {
            return `${email} ${firstName} ${lastName}`
              .toLowerCase()
              .includes(data["search-term"].toLowerCase());
          }
        );
    } else {
      listItems = userListReq.data().adminGetAllUsers;
    }
    // searchText.updateTextVariable({
    //   noResults: `${listItems.length}`,
    // });
    searchText.getElement().innerHTML = `${listItems.length} Result found`;
    userList.setData(listItems);
  });

  userList.rowRenderer(({ rowData, rowElement }) => {
    const enabledTag = rowElement.getChildAsComponent(
      `[xa-type="userEnabled"]`
    );
    const disabledTag = rowElement.getChildAsComponent(
      `[xa-type="userDisabled"]`
    );
    const link = rowElement.getChildAsComponent(
      `[xa-type="viewUser"]`
    );
    link.setAttribute(
      "href",
      `${ADMIN_PATHS.userView}?id=${rowData.id}`
    );
    if (rowData.enabled) {
      disabledTag.setAttribute("style", "display:none;");
    } else {
      enabledTag.setAttribute("style", "display:none;");
    }
    rowElement.updateTextViaAttrVar({
      userFullName: `${rowData.firstName} ${rowData.lastName}`,
      userEmail: `${rowData.email}`,
      joinedDate: `Joined at ${ dayjs(rowData.createdAt).format(
        "MM-DD-YYYY"
      )}`,
    });
    return rowElement;
  });

  userListReq.onData((data) => {
    // searchText.updateTextVariable({
    //   noResults: `${data.adminGetAllUsers.length}`,
    // });
    searchText.getElement().innerHTML = `${data.adminGetAllUsers.length} Result found`;
    userList.setData(data.adminGetAllUsers);
    // getSkeletonLoader().hide();
    showData().show();
  });
  userListReq.fetch();
};

export const userSingleUser = (data: { id: string }) => {
  const userNavLink = new WFComponent(`[xa-type="userNavLink"]`);
  userNavLink.addCssClass("w--current");
  if (!("id" in data && data.id.length)) {
    navigate({
      to: ADMIN_PATHS.userList,
      type: "replace",
    });
    return;
  }
  const courseList = new WFDynamicList<
    LessonProgress,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="course-list"]`, {
    rowSelector: `[xa-type="course-item"]`,
  });
  const certificateList = new WFDynamicList<
    Certificate,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="certi-list"]`, {
    rowSelector: `[xa-type="certi-item"]`,
  });
  const noCourses = new WFComponent(`[xa-type="noCourses"]`);
  const noCertificates = new WFComponent(`[xa-type="noCertificates"]`);
  const courseListWrap = new WFComponent(`[xa-type="course-list"]`);
  const certificateListWrap = new WFComponent(`[xa-type="certi-list"]`);
  const userDetailsReq = adminQL.query(
    AdminGetUserDocument
  );
  const userStateChangeReq = adminQL.mutation(
    AdminUpdateUserStatusDocument
  );
  const userDetailsContainer = new WFComponent(
    ".ad-user__view-left"
  );
  const userStateChange =
    userDetailsContainer.getChildAsComponent(
      `[xa-type="user-state-change"]`
    );
  let userStatus = false;

  const renderUserState = () => {
    if (userStatus) {
      userStateChange.setText("Disable Access");
      userStateChange.addCssClass("is--disable");
      userStateChange.removeCssClass("is--enable");
    } else {
      userStateChange.setText("Enable Access");
      userStateChange.addCssClass("is--enable");
      userStateChange.removeCssClass("is--disable");
    }
  };
  userStateChangeReq.onLoadingChange((status) => {
    if (status) {
      userStateChange.setText("Please wait...");
    } else {
      renderUserState();
    }
  });
  userStateChangeReq.onError(() => {
    userStateChange.setText("Failed");
    setTimeout(() => {
      renderUserState();
    }, 2000);
  });
  userStateChangeReq.onData((data) => {
    userStatus = data.adminUpdateUserStatus.enabled;
    renderUserState();
  });
  userStateChange.on("click", () => {
    if (userStatus) {
      const response = confirm("Are you sure you want to disable the user?");
      if (response) {
        userStateChangeReq.fetch({
          userId: data.id,
          status: !userStatus,
        });
      }
    } else {
      userStateChangeReq.fetch({
        userId: data.id,
        status: !userStatus,
      });
    }
  });
  userDetailsReq.onData((data) => {
    userDetailsContainer.updateTextViaAttrVar({
      userFname: `Full Name: ${data.adminGetUser.user.firstName} ${data.adminGetUser.user.lastName}`,
      userEmail: `Email: ${data.adminGetUser.user.email}`,
      joinedDate: `Joined Date: ${dayjs(
        data.adminGetUser.user.createdAt
      ).format("MM-DD-YYYY")}`,
    });
    userStatus = data.adminGetUser.user.enabled;
    if (data.adminGetUser.user.lessonProgress.length) {
      courseList.setData(
        data.adminGetUser.user
          .lessonProgress as any as LessonProgress[]
      );
    } else {
      courseListWrap.addCssClass("hide");
      noCourses.removeCssClass("hide");
    }

    if (data.adminGetUser.user.certificate.length) {
      certificateList.setData(
        data.adminGetUser.user
          .certificate as any as Certificate[]
      );
  } else {
    certificateListWrap.addCssClass("hide");
    noCertificates.removeCssClass("hide");
  }
    renderUserState();
    // getSkeletonLoader().hide();
    showData().show();
  });
  userDetailsReq.onError((err) => {
    alert(`Error : User not found`);
    navigate({
      to: ADMIN_PATHS.userList,
      type: "replace",
    });
  });
  userDetailsReq.fetch({
    userId: data.id,
  });
  courseList.rowRenderer(({ rowData, rowElement }) => {
    const course = userDetailsReq
      .data()
      .adminGetUser.lessons.filter(
        (c) => c.id === rowData.lessonId
      )[0];
    const img = rowElement.getChildAsComponent(
      `[xa-type="courseThumb"]`
    );
    img.setAttribute("src", `${course.image}`);
    img.setAttribute("srcset", `${course.image}`);
    rowElement.updateTextViaAttrVar({
      courseName: removeHTMLTags(course.title),
      coursetag: course.tag,
      activityDate: `Last activity ${dayjs(rowData.updatedAt).format(
        "MM-DD-YYYY hh:mm a"
      )}`,
      percentComplete: parseInt(((rowData.progress * 100) / (course.slideCount - 1)).toFixed(0)) >= 100 ? "Completed" : "In-Progress",
    });
    return rowElement;
  });
  certificateList.rowRenderer(({ rowData, rowElement }) => {
    const course = userDetailsReq
      .data()
      .adminGetUser.lessons.filter(
        (c) => c.certificationId === rowData.certificationId
      )[0];
    const img = rowElement.getChildAsComponent(
      `[xa-type="certificateThumb"]`
    );
    if (course) {
      img.setAttribute("src", `${course.image}`);
      img.setAttribute("srcset", `${course.image}`);
      rowElement.updateTextViaAttrVar({
        courseTitle: removeHTMLTags(course.title),
        coursetag: course.tag,
        activityDate: `Date ${dayjs(rowData.updatedAt).format(
          "MM-DD-YYYY hh:mm a"
        )}`,
      });
      return rowElement;
    } else {
      return null;
    }
  });
  courseList.setData([]);
  certificateList.setData([]);
};
