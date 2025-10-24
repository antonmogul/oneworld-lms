import {
  WFComponent,
  WFDynamicList,
  WFFormComponent,
  navigate,
} from "@xatom/core";
import { adminQL } from "../../graphql";
import {
  AdminCreateBlankCourseDocument,
  AdminDeleteCourseDocument,
  AdminGetAllCertificationsDocument,
  AdminGetAllCourseDocument,
  AdminGetCourseDocument,
} from "../../graphql/graphql";
import getLoader from "../utils/getLoader";
import { ADMIN_PATHS } from "../../config";
import dayjs from "dayjs";
import courseManager from "./courseManager";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeH5Tags } from "../utils/removeHtmlTags";

// getSkeletonLoader().show();

export const courseListing = () => {
  const courseListReq = adminQL.query(
    AdminGetAllCourseDocument,
    {
      fetchPolicy: "network-only"
    }
  );
  const courseCreate = adminQL.mutation(
    AdminCreateBlankCourseDocument
  );
  const adminDeleteCourseReq = adminQL.mutation(
    AdminDeleteCourseDocument
  );
  const list = new WFDynamicList<
    {
      id: string;
      title: string;
      image: string;
      tag: string;
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
  const createButton = new WFComponent<HTMLAnchorElement>(
    `[xa-type="create"]`
  );
  let isCreating = false;
  const searchForm = new WFFormComponent<{
    "search-term": string;
  }>(`[xa-type="search"]`);

  let listItems: {
    id: string;
    title: string;
    image: string;
    tag: string;
    enabled: boolean;
    createdAt: any;
    updatedAt: any;
  }[] = [];

  const resetFilterOption = new WFComponent(
    `[xa-type="reset-filter"]`
  );

  const publishedFilterOption = new WFComponent(
    `[xa-type="filter-by-published"]`
  );

  const draftFilterOption = new WFComponent(
    `[xa-type="filter-by-drafts"]`
  );

  resetFilterOption.on("click", () => {
    resetFilterOption.addCssClass("active");
    publishedFilterOption.removeCssClass("active");
    draftFilterOption.removeCssClass("active");
    searchText.getElement().innerHTML = `${listItems.length} Result found`;
    list.setData(listItems);
  });

  publishedFilterOption.on("click", () => {
    publishedFilterOption.addCssClass("active");
    resetFilterOption.removeCssClass("active");
    draftFilterOption.removeCssClass("active");
    const filteredListItems = listItems.filter((li) => li.enabled);
    searchText.getElement().innerHTML = `${filteredListItems.length} Result found`;
    list.setData(filteredListItems);
  });

  draftFilterOption.on("click", () => {
    draftFilterOption.addCssClass("active");
    resetFilterOption.removeCssClass("active");
    publishedFilterOption.removeCssClass("active");
    const filteredListItems = listItems.filter((li) => !li.enabled);
    searchText.getElement().innerHTML = `${filteredListItems.length} Result found`;
    list.setData(filteredListItems);
  });
  searchForm.onFormSubmit((data) => {
    if (data["search-term"].length) {
      listItems = courseListReq
        .data()
        .adminGetAllCourse.filter(({ title, tag }) => {
          return `${title} ${tag}`
            .toLowerCase()
            .includes(data["search-term"].toLowerCase());
        });
    } else {
      listItems = courseListReq.data().adminGetAllCourse;
    }
    searchText.getElement().innerHTML = `${listItems.length} Result found`;
    listItems = [...listItems].sort((c1, c2) => (c1 === c2) ? 0 : (c1) ? -1 : 1);
    list.setData(listItems);
    resetFilterOption.addCssClass("active");
    publishedFilterOption.removeCssClass("active");
    draftFilterOption.removeCssClass("active");
  });

  createButton.on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCreating) return;

    isCreating = true;
    createButton.setText("Please wait...");
    courseCreate.fetch();
  });
  courseCreate.onError(() => {
    alert("Failed please try again");
    createButton.setText("Create Course");
    isCreating = false;
  });
  courseCreate.onData(({ adminCreateBlankCourse }) => {
    createButton.setText("Redirecting...");
    navigate({
      to: `${ADMIN_PATHS.courseView}?id=${adminCreateBlankCourse.id}`,
      type: "replace",
    });
  });
  list.rowRenderer(({ rowData, rowElement }) => {
    const courseTitle = rowElement.getChildAsComponent(
      `[xa-type="courseTitle"]`
    );
    const draft = rowElement.getChildAsComponent(
      `[xa-type="draftCourse"]`
    );
    const published = rowElement.getChildAsComponent(
      `[xa-type="publishedCourse"]`
    );
    const img = rowElement.getChildAsComponent(
      `[xa-type="courseThumb"]`
    );
    const link = rowElement.getChildAsComponent(
      `[xa-type="viewCourse"]`
    );
    const courseMenu = rowElement.getChildAsComponent(
      `[xa-type="course-menu"]`
    );
    const courseMenuDD = courseMenu.getChildAsComponent(
      ".ad_course_list-filter-dd_links"
    );
    const courseDeleteMenu = courseMenu.getChildAsComponent(
      `[xa-type="course-delete-menu"]`
    )
    courseMenu.on("click", () => {
      if (courseMenuDD.getCssClass().includes("w--open")) {
        courseMenuDD.removeCssClass("w--open");
      } else {
        courseMenuDD.addCssClass("w--open");
      }
    });
    courseDeleteMenu.on("click", () => {
      showData().showLoader();
      const response = confirm("Are you sure you want to delete the lesson?");
      if (response) {
        adminDeleteCourseReq.fetch({
          lessonId: rowData.id
        });
      }
    });
    link.setAttribute(
      "href",
      `${ADMIN_PATHS.courseView}?id=${rowData.id}`
    );
    if (rowData.enabled) {
      draft.setAttribute("style", "display:none;");
    } else {
      published.setAttribute("style", "display:none;");
    }

    if (rowData.image.length) {
      img.setAttribute("src", rowData.image);
      img.setAttribute("srcset", rowData.image);
    }
    rowElement.updateTextViaAttrVar({
      // courseName: rowData.title,
      coursetag: rowData.tag || "NO TAG",
      updatedDate: `Last updated ${dayjs(rowData.updatedAt).format(
        "MM-DD-YYYY"
      )}`,
    });
    courseTitle.getElement().innerHTML = removeH5Tags(rowData.title);
    return rowElement;
  });
  courseListReq.onData(({ adminGetAllCourse }) => {
    searchText.getElement().innerHTML = `${adminGetAllCourse.length} Result found`;
    listItems = [...adminGetAllCourse].sort((c1, c2) => (c1 === c2) ? 0 : (c1) ? -1 : 1);
    list.setData(listItems);
    resetFilterOption.addCssClass("active");
    publishedFilterOption.removeCssClass("active");
    draftFilterOption.removeCssClass("active");
    // getSkeletonLoader().hide();
    showData().show();
  });

  adminDeleteCourseReq.onData(() => {
    courseListReq.fetch();
  });
  courseListReq.fetch();
};

export const createCourse = (data: { id: string }) => {
  const courseNavLink = new WFComponent(`[xa-type="courseNavLink"]`);
  courseNavLink.addCssClass("w--current");
  if (!("id" in data && data.id.length)) {
    navigate({
      to: ADMIN_PATHS.courseList,
      type: "replace",
    });
    return;
  }

  // Admin course tabs toggle
  const courseTabsToggle = new WFComponent(`[xa-type="adcourse-toggle-wrap"]`);
  const basicDetailsToggle = courseTabsToggle.getChildAsComponent(`[xa-type="basic-details-toggle"]`);
  // const highlightsToggle = courseTabsToggle.getChildAsComponent(`[xa-type="course-highlights-toggle"]`);
  const lessonToggle = courseTabsToggle.getChildAsComponent(`[xa-type="lesson-toggle"]`);
  const quizToggle = courseTabsToggle.getChildAsComponent(`[xa-type="quiz-toggle"]`);
  const successToggle = courseTabsToggle.getChildAsComponent(`[xa-type="success-toggle"]`);

  // Admin course tabs trigger
  const publishButton = new WFComponent<HTMLAnchorElement>(
    `[xa-type="publishbtn"]`
  );
  const basicDetailsTrigger = new WFComponent(`[xa-type="basic-details-trigger"]`);
  const highlightsTrigger = new WFComponent(`[xa-type="course-highlights-trigger"]`);
  const lessonTrigger = new WFComponent(`[xa-type="lesson-trigger"]`);
  const quizTrigger = new WFComponent(`[xa-type="quiz-trigger"]`);
  const successTrigger = new WFComponent(`[xa-type="success-trigger"]`);

  publishButton.getElement().style.pointerEvents = "none";
  Array.from(courseTabsToggle.getElement().children).
      forEach(button => {
        button.style.pointerEvents = "none";
      });

  basicDetailsToggle.getElement().click();

  basicDetailsToggle.on("click", () => {
    basicDetailsTrigger.getElement().click();
    basicDetailsToggle.addCssClass("is-active");
    Array.from(courseTabsToggle.getElement().children).
      filter(d => d !== basicDetailsToggle.getElement()).
      forEach(sibling => {
        sibling.classList.remove("is-active");
      });
  });

  // highlightsToggle.on("click", () => {
  //   highlightsTrigger.getElement().click();
  //   highlightsToggle.addCssClass("is-active");
  //   Array.from(courseTabsToggle.getElement().children).
  //     filter(d => d !== highlightsToggle.getElement()).
  //     forEach(sibling => {
  //       sibling.classList.remove("is-active");
  //     });
  // });

  lessonToggle.on("click", () => {
    lessonTrigger.getElement().click();
    lessonToggle.addCssClass("is-active");
    Array.from(courseTabsToggle.getElement().children).
      filter(d => d !== lessonToggle.getElement()).
      forEach(sibling => {
        sibling.classList.remove("is-active");
      });
  });

  quizToggle.on("click", () => {
    quizTrigger.getElement().click();
    quizToggle.addCssClass("is-active");
    Array.from(courseTabsToggle.getElement().children).
      filter(d => d !== quizToggle.getElement()).
      forEach(sibling => {
        sibling.classList.remove("is-active");
      });
  });

  successToggle.on("click", () => {
    successTrigger.getElement().click();
    successToggle.addCssClass("is-active");
    Array.from(courseTabsToggle.getElement().children).
      filter(d => d !== successToggle.getElement()).
      forEach(sibling => {
        sibling.classList.remove("is-active");
      });
  });

  const courseDetailsReq = adminQL.query(
    AdminGetCourseDocument
  );
  let _data: {
    id: string;
    title: string;
    certificationDetails: string;
    image: string;
    tag: string;
    lessonsSlides: string;
    quizSlides: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    certificationId?: string | null;
  } = {
    id: "",
    title: "",
    certificationDetails: "",
    image: "",
    tag: "",
    lessonsSlides: "",
    quizSlides: "",
    enabled: false,
    createdAt: "",
    updatedAt: "",
    certificationId: ""
  };

  courseDetailsReq.onError(() => {
    alert("Failed to fetch course details");
    navigate({
      to: ADMIN_PATHS.courseList,
      type: "replace",
    });
  });

  courseDetailsReq.onData((data) => {
    _data = data.adminGetCourse;
    courseManager(_data);
  });

  courseDetailsReq.fetch({
    lessonId: data.id,
  });
};
