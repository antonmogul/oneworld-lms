import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { DisplayDataForSaveItem, GetAllLessonsDocument, GetUserSavedItemsDocument, SavedItemType, UserSaveItemResponse } from "../../graphql/graphql";
import getLoader from "../utils/getLoader";
import { initSaveComponent } from "../utils/savedItemStore";
import { PUBLIC_PATHS, shadowBackgroundColors } from "../../config";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeH5Tags } from "../utils/removeHtmlTags";

// getSkeletonLoader().show();

export const userSaved = () => {
    let allSavedItems: UserSaveItemResponse[] = [];
    const savedItemReq = publicQL.mutation(GetUserSavedItemsDocument);

    // Saved Tabs & nothing Saved state
    const savedFilters = new WFComponent(`[xa-type="savedFilters"]`);
    const nothingSaved = new WFComponent(`[xa-type="nothingSaved"]`);
    const savedHeading = new WFComponent(`[xa-type="savedHeading"]`);

    //desktop tabs menu
    const viewAllMenu = new WFComponent(`[xa-type="viewAllMenu"]`);
    const lessonCardMenu = new WFComponent(`[xa-type="lessonCardMenu"]`);
    const courseHighlightMenu = new WFComponent(`[xa-type="courseHighlightMenu"]`);

    // Mobile filter menu
    const viewAllM = new WFComponent(`[xa-type="viewAllM"]`);
    const lessonCardsM = new WFComponent(`[xa-type="lessonCardsM"]`);
    const courseHightlightsM = new WFComponent(`[xa-type="courseHighlightsM"]`);

    // RADIO circles
    const viewAllRadio = new WFComponent(`[xa-type="viewAllRadio"]`);
    const lessonCardRadio = new WFComponent(`[xa-type="lessonCardRadio"]`);
    const courseHighlightRadio = new WFComponent(`[xa-type="courseHighlightRadio"]`);

    //filter label
    const filterLabelM = new WFComponent(`[xa-type="tabLabelM"]`);

    savedItemReq.onData((data) => {
        allSavedItems = data.getUserSavedItems;
        if (data.getUserSavedItems.length) {
            processSavedItem(allSavedItems);
        } else {
            savedHeading.addCssClass("show-mobile");
            savedFilters.addCssClass("hide");
            nothingSaved.removeCssClass("hide");
        }

        viewAllM.getElement().click();
        filterLabelM.getElement().innerHTML = "View All";
        viewAllMenu.getElement().click();

    });

    viewAllM.on("click", () => {
        filterLabelM.getElement().innerHTML = "View All";
        viewAllMenu.getElement().click();
    });

    lessonCardsM.on("click", () => {
        filterLabelM.getElement().innerHTML = "Lesson Cards";
        lessonCardMenu.getElement().click();
    });

    courseHightlightsM.on("click", () => {
        filterLabelM.getElement().innerHTML = "Course Highlights";
        courseHighlightMenu.getElement().click();
    });

    savedItemReq.fetch().then(() => {

    })

}


function processSavedItem(allSavedItems: UserSaveItemResponse[]) {
    let _allSavedItems = allSavedItems;
    let courseItems = allSavedItems.filter(item => item.type === "COURSE");
    let slideItems = allSavedItems.filter(item => item.type === "SLIDE");



    //List all cards
    const savedCardList = new WFDynamicList<
        {
            id: string;
            savedItemKey: string;
            type: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            displayData: DisplayDataForSaveItem;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="savedCards"]`, {
        rowSelector: `[xa-type="savedCard"]`,
        loaderSelector: `[xa-type="noSavedCards"]`,
    });
    const courseCardList = new WFDynamicList<
        {
            id: string;
            savedItemKey: string;
            type: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            displayData: DisplayDataForSaveItem;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="courseCards"]`, {
        rowSelector: `[xa-type="courseCard"]`,
        loaderSelector: `[xa-type="noSavedCards"]`,

    });

    const lessonCardList = new WFDynamicList<
        {
            id: string;
            savedItemKey: string;
            type: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            displayData: DisplayDataForSaveItem;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="lessonCards"]`, {
        rowSelector: `[xa-type="lessonCard"]`,
        loaderSelector: `[xa-type="noSavedCards"]`,

    });

    const showEmptyState = () => {
        savedCardList.changeLoadingStatus(_allSavedItems.length === 0)
        courseCardList.changeLoadingStatus(courseItems.length === 0)
        lessonCardList.changeLoadingStatus(slideItems.length === 0)

    }
    const removeFromList = (id: string) => {
        _allSavedItems = _allSavedItems.filter(item => item.id !== id);
        courseItems = _allSavedItems.filter(item => item.type === "COURSE");
        slideItems = _allSavedItems.filter(item => item.type === "SLIDE");
        courseCardList.setData(courseItems);
        lessonCardList.setData(slideItems);
        savedCardList.setData(_allSavedItems);
        showEmptyState();
    }

    showEmptyState();


    let colorCount = 0;
    savedCardList.rowRenderer(({ rowData, rowElement }) => {
        const courseBlock = rowElement.getChildAsComponent<HTMLAnchorElement>(`[xa-type="courseBlock"]`);
        const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
        const lessonCourseTitle = rowElement.getChildAsComponent(`[xa-type="lessonCourseTitle"]`);
        const lessonBlock = rowElement.getChildAsComponent<HTMLAnchorElement>(`[xa-type="lessonBlock"]`);
        const courseThumb = courseBlock.getChildAsComponent(`[xa-type="savedCourseThumb"]`);
        const completedMark = courseBlock.getChildAsComponent(`[xa-type="completedMark"]`);
        const thumbWrap = rowElement.getChildAsComponent(`[xa-type="thumbnailWrap"]`);

        if (rowData.type == "COURSE") {
            //rowData.savedItemKey => as id, type course
            initSaveComponent(rowData.savedItemKey, SavedItemType.Course, courseBlock.getChildAsComponent(`[xa-type="favouritingIcon"]`), (isFilled) => {
                if (!isFilled) {
                    removeFromList(rowData.id)

                }
            });
            lessonBlock.addCssClass("hide");
            courseBlock.updateTextViaAttrVar({
                // courseTitle: rowData.displayData.heading,
                coursetag: rowData.displayData.tag,

            });
            courseTitle.getElement().innerHTML = removeH5Tags(rowData.displayData.heading);

            courseThumb.setAttribute("src", rowData.displayData.image);
            courseThumb.setAttribute("srcset", rowData.displayData.image);
            thumbWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount) % 4]}`);
            colorCount++;
            if (!rowData.displayData.isCompleted) {
                courseBlock.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${rowData.displayData.lessonId}`);
                completedMark.addCssClass("hide");

                // const currentUrl = window.location.href;
                // const courseLink = currentUrl.split('user')[0] + "user/dashboard/course-view?id=" + rowData.savedItemKey; 
                // courseBlock.setAttribute("href", courseLink);
            } else {
                courseBlock.setAttribute("href", `${PUBLIC_PATHS.courseHightlights}?id=${rowData.displayData.certificateId}`);
            }
        } else if (rowData.type == "SLIDE") {
            const formattedCardTitle = extractAndCleanH3Text(rowData.displayData.heading);
            //rowData.savedItemKey => as id, type course
            initSaveComponent(rowData.savedItemKey, SavedItemType.Slide, lessonBlock.getChildAsComponent(`[xa-type="favouritingIcon"]`), (isFilled) => {
                if (!isFilled) {
                    removeFromList(rowData.id)
                }
            });
            //TODO : resume course form slide,
            lessonBlock.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${rowData.displayData.lessonId}&slideId=${rowData.savedItemKey}`);
            courseBlock.addCssClass("hide");
            lessonBlock.updateTextViaAttrVar({
                cardTitle: formattedCardTitle,
                // courseTitle: rowData.displayData.footerText,
            });
            lessonCourseTitle.getElement().innerHTML = removeH5Tags(rowData.displayData.footerText);

        }
        return rowElement;
    });
    savedCardList.setData(_allSavedItems);
    // getSkeletonLoader().hide();
    showData().show();


    //List course cards
    colorCount = 0;
    courseCardList.rowRenderer(({ rowData, rowElement }) => {
        const courseThumb = rowElement.getChildAsComponent(`[xa-type="savedCourseThumb"]`);
        const completedMark = rowElement.getChildAsComponent(`[xa-type="completedMark"]`);
        const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
        const thumbWrap = rowElement.getChildAsComponent(`[xa-type="thumbnailWrap"]`);

        rowElement.updateTextViaAttrVar({
            coursetag: rowData.displayData.tag,
            // courseTitle: rowData.displayData.heading
        });
        courseTitle.getElement().innerHTML = removeH5Tags(rowData.displayData.heading);
        initSaveComponent(rowData.savedItemKey, SavedItemType.Course, rowElement.getChildAsComponent(`[xa-type="favouritingIcon"]`), (isFilled) => {
            if (!isFilled) {
                removeFromList(rowData.id)
            }
        });
        courseThumb.setAttribute("src", rowData.displayData.image);
        courseThumb.setAttribute("srcset", rowData.displayData.image);
        thumbWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount) % 4]}`);
            colorCount++;

        if (!rowData.displayData.isCompleted) {
            completedMark.addCssClass("hide");
            rowElement.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${rowData.displayData.lessonId}`);
        } else {
            rowElement.setAttribute("href", `${PUBLIC_PATHS.courseHightlights}?id=${rowData.displayData.certificateId}`);
        }
        return rowElement;
    });
    courseCardList.setData(courseItems);
    // getSkeletonLoader().hide();
    showData().show();


    //List lesson cards
    lessonCardList.rowRenderer(({ rowData, rowElement }) => {
        const formattedCardTitle = extractAndCleanH3Text(rowData.displayData.heading);
        const lessonCourseTitle = rowElement.getChildAsComponent(`[xa-type="lessonCourseTitle"]`);
        initSaveComponent(rowData.savedItemKey, SavedItemType.Slide, rowElement.getChildAsComponent(`[xa-type="favouritingIcon"]`), (isFilled) => {
            if (!isFilled) {
                removeFromList(rowData.id)
            }
        });
        rowElement.updateTextViaAttrVar({
            cardTitle: formattedCardTitle,
            // courseTitle: rowData.displayData.footerText,
        });
        lessonCourseTitle.getElement().innerHTML = removeH5Tags(rowData.displayData.footerText);
        rowElement.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${rowData.displayData.lessonId}&slideId=${rowData.savedItemKey}`);
        return rowElement;
    });
    lessonCardList.setData(slideItems);
    // getSkeletonLoader().hide();
    showData().show();

}

function extractAndCleanH3Text(input) {
    const h3Regex = /<h3>(.*?)<\/h3>/;
    const match = input.match(h3Regex);

    if (match) {
        const h3Text = match[1];
        const cleanedText = h3Text.replace(/<\/?[^>]+(>|$)/g, "");
        return cleanedText;
    }

    return input;
}