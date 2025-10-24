import {
  WFComponent,
  WFDynamicList,
  WFFormComponent,
  navigate,
} from "@xatom/core";
import loadRTCss from "../utils/loadRTCss";
import Quill from "quill";
import { adminQL } from "../../graphql";
import {
  AdminCreateNotificationDocument,
  AdminGetAllCourseDocument,
  AdminGetAllNotificationsDocument,
  NotificationType,
} from "../../graphql/graphql";
import { ADMIN_PATHS } from "../../config";
import getLoader from "../utils/getLoader";
import dayjs from "dayjs";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeH5Tags, removeHTMLTags } from "../utils/removeHtmlTags";
const notificationIcons = {
  system:
    "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/649d4c053f440aade32e70ea_system-notifications.svg",
  course:
    "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/649d4af19150ed6f4fa373a0_course-notifications.svg",
  reminder:
    "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/649d4c058fa7ad5b021e873d_reminder-notifications.svg",
};

// getSkeletonLoader().show();

export const createNotification = () => {
  loadRTCss();
  const notificationNavLink = new WFComponent(`[xa-type="notificationNavLink"]`);
  notificationNavLink.addCssClass("w--current");
  const notificationCreateReq = adminQL.mutation(
    AdminCreateNotificationDocument
  );
  const allCourseReq = adminQL.mutation(
    AdminGetAllCourseDocument
  );
  const notificationForm = new WFFormComponent<{
    "notification-title": string;
    "notification-desc": string;
    "notification-type": string;
    "notification-course": string;
  }>(`[xa-type="createNotification"]`);
  const courseSelect = notificationForm.getChildAsComponent(
    `[name="notification-course"]`
  );
  const notificationTypeSelect =
    notificationForm.getChildAsComponent<HTMLSelectElement>(
      `[name="notification-type"]`
    );
  const courseSelectContainer =
    notificationForm.getChildAsComponent(
      `[xa-type="notificationCourse"]`
    );
  courseSelectContainer.setAttribute(
    "style",
    "display: none;"
  );
  courseSelect.getElement().replaceChildren();
  const rtEditor =
    notificationForm.getChildAsComponent<HTMLDivElement>(
      "#rt-editor"
    );
  const rtArea =
    notificationForm.getChildAsComponent<HTMLInputElement>(
      `[name="notification-desc"]`
    );
  const quillEditor = new Quill(rtEditor.getElement(), {
    modules: {
      toolbar: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    placeholder: "Enter notification description",
    theme: "snow",
  });
  quillEditor.on("text-change", () => {
    rtArea.getElement().value = quillEditor.root.innerHTML;
  });
  notificationCreateReq.onLoadingChange((status) => {
    notificationForm.updateSubmitButtonText(
      status ? "Please wait..." : "Notify Users"
    );
    if (status) {
      notificationForm.disableForm();
    } else {
      notificationForm.enableForm();
    }
  });
  notificationCreateReq.onError(() => {
    notificationForm.showErrorState();
  });
  notificationCreateReq.onData(() => {
    notificationForm.showSuccessState();
    setTimeout(() => {
      navigate({
        to: ADMIN_PATHS.notificationList,
        type: "replace",
      });
    }, 1000);
  });
  notificationForm.onFormSubmit((data) => {
    notificationCreateReq.fetch({
      title: data["notification-title"],
      description: data["notification-desc"],
      notificationData:
        data["notification-type"] === "LESSON_UPDATE"
          ? data["notification-course"]
          : "",
      type: data["notification-type"],
    });
  });
  allCourseReq.onError(() => {
    alert("Failed to load courses");
  });
  allCourseReq.onData((data) => {

    data.adminGetAllCourse
      .filter((d) => d.enabled)
      .forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = `${removeHTMLTags(item.title)} - (${item.tag || "No Tag"
          })`;
        courseSelect.getElement().appendChild(option);
      });
    // getSkeletonLoader().hide();
    showData().show();
  });
  notificationTypeSelect.on("change", () => {
    if (
      notificationTypeSelect.getElement().value ===
      "LESSON_UPDATE"
    ) {
      courseSelectContainer.setAttribute(
        "style",
        "display:block;"
      );
    } else {
      courseSelectContainer.setAttribute(
        "style",
        "display:none;"
      );
    }
  });
  allCourseReq.fetch();
};

export const listNotification = () => {
  const notificationReq = adminQL.query(
    AdminGetAllNotificationsDocument
  );
  const list = new WFDynamicList<
    {
      id: string;
      title: string;
      description: string;
      type: NotificationType;
      notificationData: string;
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
  const systemButton = new WFComponent<HTMLAnchorElement>(
    "#systemModalTrigger"
  );
  const courseButton = new WFComponent<HTMLAnchorElement>(
    "#courseModalTrigger"
  );
  const systemDialog = new WFComponent<HTMLDivElement>(
    "#system-updates-popup"
  );
  const systemDialogDesc =
    systemDialog.getChildAsComponent<HTMLParagraphElement>(
      `[xa-type="desc"]`
    );
  const courseDialog = new WFComponent<HTMLDivElement>(
    "#course-popup"
  );
  const courseDialogDesc =
    courseDialog.getChildAsComponent<HTMLParagraphElement>(
      `.modal__body-txt`
    );
  const courseImg =
    courseDialog.getChildAsComponent<HTMLParagraphElement>(
      `.img-wrapper > img`
    );

  const searchForm = new WFFormComponent<{
    "search-term": string;
  }>(`[xa-type="search"]`);

  searchForm.onFormSubmit((data) => {
    let listItems = [];
    if (data["search-term"].length) {
      listItems = notificationReq
        .data()
        .adminGetAllNotifications.filter(
          ({ title, description }) => {
            return `${title} ${description}`
              .toLowerCase()
              .includes(data["search-term"].toLowerCase());
          }
        );
    } else {
      listItems =
        notificationReq.data().adminGetAllNotifications;
    }
    // searchText.updateTextViaAttrVar({
    //   noResults: `${listItems.length}`,
    // });
    searchText.getElement().innerHTML = `${listItems.length} Result found`;
    list.setData(listItems);
  });

  list.rowRenderer(({ rowData, rowElement }) => {
    const img = rowElement.getChildAsComponent(
      `[xa-type="notificationThumb"]`
    );
    const dialogIcon = systemDialog.getChildAsComponent(
      `[class="notification-icon"]`
    );
    const link = rowElement.getChildAsComponent(
      `[xa-type="viewNotification"]`
    );

    if (rowData.type === "SYSTEM_UPDATE") {
      img.setAttribute("src", notificationIcons.system);
      img.setAttribute("srcset", notificationIcons.system);
      link.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dialogIcon.setAttribute(
          "src",
          notificationIcons.system
        );
        dialogIcon.setAttribute(
          "srcset",
          notificationIcons.system
        );
        systemDialog.updateTextViaAttrVar({
          notificationTitle: rowData.title,
        });
        systemDialogDesc.getElement().innerHTML =
          rowData.description;
        systemButton.getElement().click();
      });
    } else {
      const _data = JSON.parse(rowData.notificationData);
      img.setAttribute("src", notificationIcons.course);
      img.setAttribute("srcset", notificationIcons.course);
      link.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        courseImg.setAttribute("src", _data.image);
        courseImg.setAttribute("srcset", _data.image);
        courseDialog.updateTextViaAttrVar({
          notificationTitle: rowData.title,
          coursetag: _data.tag,
          courseName: removeHTMLTags(_data.title),
        });
        courseDialogDesc.getElement().innerHTML =
          rowData.description;
        courseButton.getElement().click();
      });
    }
    rowElement.updateTextViaAttrVar({
      notificationTitle: rowData.title,
      notifDate: `Date ${dayjs(rowData.createdAt).format(
        "MM-DD-YYYY hh:mm a"
      )}`,
    });
    return rowElement;
  });
  notificationReq.onData(({ adminGetAllNotifications }) => {
    // searchText.updateTextViaAttrVar({
    //   noResults: `${adminGetAllNotifications.length}`,
    // });
    searchText.getElement().innerHTML = `${adminGetAllNotifications.length} Result found`;
    list.setData(adminGetAllNotifications);
    // getSkeletonLoader().hide();
    showData().show();
  });
  notificationReq.fetch();
};
