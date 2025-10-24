import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { GetAllNotificationsDocument, GetAndUpdateUserNotificationLastSeenDocument, GetLessonProgressDocument, GetCourseUpdateNotificationDocument, GetReminderNotificationDocument, GetSystemNotificationDocument, NotificationType, StartLessonDocument } from "../../graphql/graphql";
import dayjs from "dayjs";
import getLoader from "../utils/getLoader";
import { PUBLIC_PATHS } from "../../config";
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

export const userNotifications = () => {
    let allNotifications = [], courseNotifications, systemNotifications, reminderNotifications, userLastSeen;
    const allUserNotificationsReq = publicQL.query(GetAllNotificationsDocument);
    const userLastSeenReq = publicQL.query(GetAndUpdateUserNotificationLastSeenDocument);

    //desktop tabs menu 
    const viewAllMenu = new WFComponent(`[xa-type="viewAllMenu"]`);
    const reminderMenu = new WFComponent(`[xa-type="reminderMenu"]`);
    const systemUpdateMenu = new WFComponent(`[xa-type="systemUpdateMenu"]`);
    const courseUpdateMenu = new WFComponent(`[xa-type="courseUpdateMenu"]`);

    // mobile filter menu
    const viewAllM = new WFComponent(`[xa-type="viewAllM"]`);
    const remindersM = new WFComponent(`[xa-type="remindersM"]`);
    const systemUpdatesM = new WFComponent(`[xa-type="systemUpdatesM"]`);
    const courseUpdatesM = new WFComponent(`[xa-type="courseUpdatesM"]`);

    // mobile Radio circles
    const viewAllRadio = new WFComponent(`[xa-type="viewAllRadio"]`);
    const remindersRadio = new WFComponent(`[xa-type="remindersRadio"]`);
    const systemUpdateRadio = new WFComponent(`[xa-type="systemUpdateRadio"]`);
    const courseUpdateRadio = new WFComponent(`[xa-type="courseUpdateRadio"]`);

    //filter label
    const filterLabelM = new WFComponent(`[xa-type="tabLabelM"]`);

    //News slider 
    const newsSlider = new WFComponent(`[xa-type="newsSlider"]`);
    const newsArrowPrev = newsSlider.getChildAsComponent<HTMLElement>(`[xa-type="newsArrowPrev"]`);
    const newsArrowNext = newsSlider.getChildAsComponent<HTMLElement>(`[xa-type="newsArrowNext"]`);
    const newsPagination = document.querySelector(`[xa-type="newsPagination"]`) as HTMLElement;
    const sliderDot = document.querySelector(`[xa-type="sliderDot"]`) as HTMLElement;
    const newsSlides = Array.from(newsSlider.getElement().querySelectorAll(`[xa-type="newsSlide"]`));
    let currentSlideIndex = 0;


    allUserNotificationsReq.onData((data) => {
        allNotifications = [...data.getAllNotifications];
        allNotifications = allNotifications.sort((notification1, notification2) => {
            return (
                new Date(notification2.updatedAt).getTime() -
                new Date(notification1.updatedAt).getTime()
            );
        });

        userLastSeenReq.onData((_data) => {
            userLastSeen = _data.getAndUpdateUserNotificationLastSeen;
            if (allNotifications && allNotifications.length) {
                processNotifications(allNotifications, "view-all", userLastSeen);
            } else {
                const notificationElt = new WFComponent<HTMLDivElement>(`[xa-type = "notificationGroupWrap"]`);
                const noReminders = new WFComponent<HTMLDivElement>(`[xa-type = "noNotifications"]`);
                notificationElt.addCssClass("hide");
                noReminders.removeCssClass("hide");
            }

            courseNotifications = data.getAllNotifications.filter(d => d.type === NotificationType.LessonUpdate);
            courseNotifications = courseNotifications.sort((notification1, notification2) => {
                return (
                    new Date(notification2.updatedAt).getTime() -
                    new Date(notification1.updatedAt).getTime()
                );
            });
            if (courseNotifications && courseNotifications.length) {
                processNotifications(courseNotifications, "course-updates", userLastSeen);
            } else {
                const notificationElt = new WFComponent<HTMLDivElement>(`[xa-type = "courseUpdates"]`);
                const noReminders = new WFComponent<HTMLDivElement>(`[xa-type = "noCourseUpdates"]`);
                notificationElt.addCssClass("hide");
                noReminders.removeCssClass("hide");
            }

            systemNotifications = data.getAllNotifications.filter(d => d.type === NotificationType.SystemUpdate);
            systemNotifications = systemNotifications.sort((notification1, notification2) => {
                return (
                    new Date(notification2.updatedAt).getTime() -
                    new Date(notification1.updatedAt).getTime()
                );
            });
            if (systemNotifications && systemNotifications.length) {
                processNotifications(systemNotifications, "system-updates", userLastSeen);
            } else {
                const notificationElt = new WFComponent<HTMLDivElement>(`[xa-type = "systemUpdates"]`);
                const noReminders = new WFComponent<HTMLDivElement>(`[xa-type = "noSystemUpdates"]`);
                notificationElt.addCssClass("hide");
                noReminders.removeCssClass("hide");
            }

            reminderNotifications = data.getAllNotifications.filter(d => d.type === NotificationType.Reminder);
            reminderNotifications = reminderNotifications.sort((notification1, notification2) => {
                return (
                    new Date(notification2.updatedAt).getTime() -
                    new Date(notification1.updatedAt).getTime()
                );
            });
            if (reminderNotifications && reminderNotifications.length) {
                processNotifications(reminderNotifications, "reminders", userLastSeen);
            } else {
                const notificationElt = new WFComponent<HTMLDivElement>(`[xa-type = "remindersWrap"]`);
                const noReminders = new WFComponent<HTMLDivElement>(`[xa-type = "noReminders"]`);
                notificationElt.addCssClass("hide");
                noReminders.removeCssClass("hide");
            }


        });
    });

    viewAllM.on("click", () => {
        filterLabelM.getElement().innerHTML = "View All";
        viewAllMenu.getElement().click();
    });

    remindersM.on("click", () => {
        filterLabelM.getElement().innerHTML = "Reminders";
        reminderMenu.getElement().click();
    });

    systemUpdatesM.on("click", () => {
        filterLabelM.getElement().innerHTML = "System Notifications";
        systemUpdateMenu.getElement().click();
    });

    courseUpdatesM.on("click", () => {
        filterLabelM.getElement().innerHTML = "Course Updates";
        courseUpdateMenu.getElement().click();
    });

    userLastSeenReq.fetch();
    allUserNotificationsReq.fetch();

    if (currentSlideIndex == 0) {
        newsArrowPrev.getElement().style.opacity = "50%";
        newsArrowPrev.getElement().style.pointerEvents = "none";
    }

    newsArrowPrev.on("click", () => {
        currentSlideIndex--;
        if (currentSlideIndex == 0) {
            newsArrowPrev.getElement().style.opacity = "50%";
            newsArrowPrev.getElement().style.pointerEvents = "none";
        } else if (currentSlideIndex > 0) {
            newsArrowPrev.getElement().style.opacity = "100%";
            newsArrowPrev.getElement().style.pointerEvents = "auto";
        }

        if (currentSlideIndex == newsSlides.length - 1) {
            newsArrowNext.getElement().style.opacity = "50%";
            newsArrowNext.getElement().style.pointerEvents = "none";
        } else {
            newsArrowNext.getElement().style.opacity = "100%";
            newsArrowNext.getElement().style.pointerEvents = "auto";
        }
        
        if (currentSlideIndex >= 0 && currentSlideIndex < newsSlides.length) {
            let dotPosition = (currentSlideIndex / (newsSlides.length - 1)) * (newsPagination.offsetWidth - sliderDot.offsetWidth);
            sliderDot.style.left = Math.round(dotPosition).toString() + "px";
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = newsSlides.length - 1;
            let dotPosition = (currentSlideIndex / (newsSlides.length - 1)) * (newsPagination.offsetWidth - sliderDot.offsetWidth);
            sliderDot.style.left = Math.round(dotPosition).toString() + "px";
        }

    });

    newsArrowNext.on("click", () => {
        currentSlideIndex++;
        if (currentSlideIndex == 0) {
            newsArrowPrev.getElement().style.opacity = "50%";
            newsArrowPrev.getElement().style.pointerEvents = "none";
        } else if (currentSlideIndex > 0) {
            newsArrowPrev.getElement().style.opacity = "100%";
            newsArrowPrev.getElement().style.pointerEvents = "auto";
        } 
        
        if (currentSlideIndex == newsSlides.length - 1) {
            newsArrowNext.getElement().style.opacity = "50%";
            newsArrowNext.getElement().style.pointerEvents = "none";
        } else {
            newsArrowNext.getElement().style.opacity = "100%";
            newsArrowNext.getElement().style.pointerEvents = "auto";
        }

        if (currentSlideIndex > 0) {
            newsArrowPrev.getElement().style.opacity = "100%";
            newsArrowPrev.getElement().style.pointerEvents = "auto";
        }
        if (currentSlideIndex >= 0 && currentSlideIndex < newsSlides.length) {
            let dotPosition = (currentSlideIndex / (newsSlides.length - 1)) * (newsPagination.offsetWidth - sliderDot.offsetWidth);
            sliderDot.style.left = Math.round(dotPosition).toString() + "px";
        } else if (currentSlideIndex == newsSlides.length) {
            currentSlideIndex = 0;
            sliderDot.style.left = "5px";
        }
    });

};

function processNotifications(notifications, tab, LastSeen) {
    const systemDialog = new WFComponent<HTMLDivElement>(`#system-updates-popup`);
    const courseUpdatesDialog = new WFComponent<HTMLDivElement>(`#course-popup`);
    const remindersDialog = new WFComponent<HTMLDivElement>(`#reminder`);

    const systemTrigger = new WFComponent<HTMLAnchorElement>("#systemModalTrigger");
    const courseTrigger = new WFComponent<HTMLAnchorElement>("#courseModalTrigger");
    const remindersTrigger = new WFComponent<HTMLAnchorElement>("#reminderModalTrigger");

    const systemDialogTitle = systemDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Title"]`);
    const systemDialogDesc = systemDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Desc"]`);
    const systemDialogTime = systemDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Time"]`);

    const courseDialogTitle = courseUpdatesDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Title"]`);
    const courseDialogDesc = courseUpdatesDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Desc"]`);
    const courseDialogTime = courseUpdatesDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Time"]`);
    const notifyCourseTitle = courseUpdatesDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="courseTitle"]`);
    const notifyCourseTag = courseUpdatesDialog.getChildAsComponent<HTMLDivElement>(`[xa-type="courseTag"]`);
    const notifyCourseTagM = courseUpdatesDialog.getChildAsComponent<HTMLDivElement>(`[xa-type="courseTagPillM"]`);
    const notifyCourseImg = courseUpdatesDialog.getChildAsComponent(`[xa-type="courseThumb"]`);
    const notifyCourseProgress = courseUpdatesDialog.getChildAsComponent(`[xa-type="courseProgress"]`);
    const notifyProgressLine = courseUpdatesDialog.getChildAsComponent(`[xa-type="progressLine"]`);
    const courseWrapper = courseUpdatesDialog.getChildAsComponent(`[xa-type="courseWrapper"]`);
    const courseProgressReq = publicQL.query(GetLessonProgressDocument);
    const startCourseReq = publicQL.mutation(StartLessonDocument);

    const remindersDialogTitle = remindersDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Title"]`);
    const remindersDialogDesc = remindersDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Desc"]`);
    const remindersDialogTime = remindersDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="Time"]`);
    const reminderCourseTitle = remindersDialog.getChildAsComponent<HTMLParagraphElement>(`[xa-type="courseTitle"]`);
    const reminderCourseTag = remindersDialog.getChildAsComponent<HTMLDivElement>(`[xa-type="courseTag"]`);
    const reminderCourseTagM = remindersDialog.getChildAsComponent<HTMLDivElement>(`[xa-type="courseTagPillM"]`);
    const reminderCourseImg = remindersDialog.getChildAsComponent(`[xa-type="courseThumb"]`);
    const reminderCourseProgress = remindersDialog.getChildAsComponent(`[xa-type="courseProgress"]`);
    const reminderProgressLine = remindersDialog.getChildAsComponent(`[xa-type="progressLine"]`);
    const reminderCourseWrapper = remindersDialog.getChildAsComponent(`[xa-type="courseWrapper"]`);

    if (tab == "view-all") {
        const viewAllList = new WFDynamicList<
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
        >(`[xa-type="notificationGroupWrap"]`, {
            rowSelector: `[xa-type="notificationCard"]`,
        });

        viewAllList.rowRenderer(({ rowData, rowElement }) => {
            const notificationIcon = rowElement.getChildAsComponent(`[xa-type="notificationImg"]`);
            const newNotification = rowElement.getChildAsComponent(`[xa-type="newNotification"]`);
            const notificationTitle = rowElement.getChildAsComponent(`.notification-title`);
            const t = dayjs(LastSeen).diff(rowData.createdAt, 'milliseconds');

            if (rowData.type === "SYSTEM_UPDATE") {
                notificationIcon.setAttribute("src", notificationIcons.system);
                notificationIcon.setAttribute("srcset", notificationIcons.system);
                rowElement.updateTextViaAttrVar({
                    notificationText: rowData.title,
                    notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
                });
                notificationTitle.getElement().innerHTML = removeH5Tags(rowData.title);
                if (t >= 0) {
                    newNotification.addCssClass("hide");
                }
                rowElement.on("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    systemDialogTitle.getElement().innerHTML = rowData.title;
                    systemDialogDesc.getElement().innerHTML = rowData.description;
                    systemDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                    systemTrigger.getElement().click();
                    newNotification.addCssClass("hide");
                });
            } else if (rowData.type === "LESSON_UPDATE") {
                const _data = JSON.parse(rowData.notificationData);
                notificationIcon.setAttribute("src", notificationIcons.course);
                notificationIcon.setAttribute("srcset", notificationIcons.course);
                rowElement.updateTextViaAttrVar({
                    notificationText: rowData.title,
                    notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
                });
                if (t >= 0) {
                    newNotification.addCssClass("hide");
                }
                rowElement.on("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    courseDialogTitle.getElement().innerHTML = rowData.title;
                    courseDialogDesc.getElement().innerHTML = rowData.description;
                    courseDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                    notifyCourseTitle.getElement().innerHTML = _data.title;
                    notifyCourseTag.getElement().innerHTML = _data.tag;
                    notifyCourseTagM.getElement().innerHTML = _data.tag;
                    notifyCourseImg.setAttribute("src", _data.image);
                    notifyCourseImg.setAttribute("srcset", _data.image);
                    courseProgressReq.fetch({ lessonId: _data.id }).then((data) => {
                        if (data.getLessonProgress) {
                            const progress = `${Math.round(data.getLessonProgress.progress * 100 / data.getLessonProgress.totalSlides)}%`;
                            notifyCourseProgress.getElement().innerHTML = progress;
                            notifyProgressLine.getElement().style.width = progress;
                            if (progress == "100%") {
                                courseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}&preview=true`);
                            } else {
                                courseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`);
                            }
                        } else {
                            notifyCourseProgress.getElement().innerHTML = "0%";
                            notifyProgressLine.getElement().style.width = "0%";
                            courseWrapper.on("click", () => {
                                startCourseReq.onData((data) => {
                                    if (data) {
                                        setTimeout(() => {
                                            navigate(
                                                `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                            );
                                        }, 100);
                                    }
                                });
                                startCourseReq.fetch({
                                    lessonId: _data.id,
                                });
                            });
                        }
                    }).catch((err) => {
                        notifyCourseProgress.getElement().innerHTML = "0%";
                        notifyProgressLine.getElement().style.width = "0%";
                        courseWrapper.on("click", () => {
                            startCourseReq.onData((data) => {
                                if (data) {
                                    setTimeout(() => {
                                        navigate(
                                            `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                        );
                                    }, 100);
                                }
                            });
                            startCourseReq.fetch({
                                lessonId: _data.id,
                            });
                        });
                        console.log("Error: ", err);
                    });
                    courseTrigger.getElement().click();
                    newNotification.addCssClass("hide");
                });
            } else {
                const _data = JSON.parse(rowData.notificationData);
                notificationIcon.setAttribute("src", notificationIcons.reminder);
                notificationIcon.setAttribute("srcset", notificationIcons.reminder);
                rowElement.updateTextViaAttrVar({
                    notificationText: removeHTMLTags(rowData.title),
                    notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
                });
                notificationTitle.getElement().innerHTML = removeH5Tags(rowData.title);
                if (t >= 0) {
                    newNotification.addCssClass("hide");
                }
                rowElement.on("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    remindersDialogTitle.getElement().innerHTML = rowData.title;
                    remindersDialogDesc.getElement().innerHTML = rowData.description;
                    remindersDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                    reminderCourseTitle.getElement().innerHTML = _data.title;
                    reminderCourseTag.getElement().innerHTML = _data.tag;
                    reminderCourseTagM.getElement().innerHTML = _data.tag;
                    reminderCourseImg.setAttribute("src", _data.image);
                    reminderCourseImg.setAttribute("srcset", _data.image);
                    courseProgressReq.fetch({ lessonId: _data.id }).then((data) => {
                        if (data.getLessonProgress) {
                            const progress = `${Math.round(data.getLessonProgress.progress * 100 / data.getLessonProgress.totalSlides)}%`;
                            reminderCourseProgress.getElement().innerHTML = progress;
                            reminderProgressLine.getElement().style.width = progress;
                            if (progress == "100%") {
                                reminderCourseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}&preview=true`);
                            } else {
                                reminderCourseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`);
                            }
                        } else {
                            reminderCourseProgress.getElement().innerHTML = "0%";
                            reminderProgressLine.getElement().style.width = "0%";
                            reminderCourseWrapper.on("click", () => {
                                startCourseReq.onData((data) => {
                                    if (data) {
                                        setTimeout(() => {
                                            navigate(
                                                `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                            );
                                        }, 100);
                                    }
                                });
                                startCourseReq.fetch({
                                    lessonId: _data.id,
                                });
                            });
                        }
                    }).catch((err) => {
                        reminderCourseProgress.getElement().innerHTML = "0%";
                        reminderProgressLine.getElement().style.width = "0%";
                        reminderCourseWrapper.on("click", () => {
                            startCourseReq.onData((data) => {
                                if (data) {
                                    setTimeout(() => {
                                        navigate(
                                            `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                        );
                                    }, 100);
                                }
                            });
                            startCourseReq.fetch({
                                lessonId: _data.id,
                            });
                        });
                        console.log("Error: ", err);
                    });
                    remindersTrigger.getElement().click();
                    newNotification.addCssClass("hide");
                });
            }


            return rowElement;
        });
        viewAllList.setData(notifications);
        // getSkeletonLoader().hide();
        showData().show();
    }

    else if (tab == "system-updates") {
        const viewAllList = new WFDynamicList<
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
        >(`[xa-type="systemUpdates"]`, {
            rowSelector: `[xa-type="systemUpdateCards"]`,
        });

        viewAllList.rowRenderer(({ rowData, rowElement }) => {
            const notificationIcon = rowElement.getChildAsComponent(`[xa-type="notificationImg"]`);
            const newNotification = rowElement.getChildAsComponent(`[xa-type="newNotification"]`);
            const t = dayjs(LastSeen).diff(rowData.createdAt, 'milliseconds');
            const notificationTitle = rowElement.getChildAsComponent(`.notification-title`);

            notificationIcon.setAttribute("src", notificationIcons.system);
            notificationIcon.setAttribute("srcset", notificationIcons.system);
            rowElement.updateTextViaAttrVar({
                // notificationText: rowData.title,
                notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
            });
            notificationTitle.getElement().innerHTML = removeH5Tags(rowData.title);
            if (t >= 0) {
                newNotification.addCssClass("hide");
            }
            rowElement.on("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                systemDialogTitle.getElement().innerHTML = rowData.title;
                systemDialogDesc.getElement().innerHTML = rowData.description;
                systemDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                systemTrigger.getElement().click();
                newNotification.addCssClass("hide");
            });

            return rowElement;
        });
        viewAllList.setData(notifications);
        // getSkeletonLoader().hide();
        showData().show();
    }

    else if (tab == "course-updates") {

        const viewAllList = new WFDynamicList<
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
        >(`[xa-type="courseUpdates"]`, {
            rowSelector: `[xa-type="courseUpdateCards"]`,
        });

        viewAllList.rowRenderer(({ rowData, rowElement }) => {
            const _data = JSON.parse(rowData.notificationData);
            const notificationIcon = rowElement.getChildAsComponent(`[xa-type="notificationImg"]`);
            const newNotification = rowElement.getChildAsComponent(`[xa-type="newNotification"]`);
            const t = dayjs(LastSeen).diff(rowData.createdAt, 'milliseconds');
            const notificationTitle = rowElement.getChildAsComponent(`.notification-title`);

            notificationIcon.setAttribute("src", notificationIcons.course);
            notificationIcon.setAttribute("srcset", notificationIcons.course);
            rowElement.updateTextViaAttrVar({
                // notificationText: rowData.title,
                notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
            });
            notificationTitle.getElement().innerHTML = removeH5Tags(rowData.title);
            if (t >= 0) {
                newNotification.addCssClass("hide");
            }
            rowElement.on("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                courseDialogTitle.getElement().innerHTML = rowData.title;
                courseDialogDesc.getElement().innerHTML = rowData.description;
                courseDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                notifyCourseTitle.getElement().innerHTML = _data.title;
                notifyCourseTag.getElement().innerHTML = _data.tag;
                notifyCourseTagM.getElement().innerHTML = _data.tag;
                notifyCourseImg.setAttribute("src", _data.image);
                notifyCourseImg.setAttribute("srcset", _data.image);
                courseProgressReq.fetch({ lessonId: _data.id }).then((data) => {
                    if (data.getLessonProgress) {
                        const progress = `${Math.round(data.getLessonProgress.progress * 100 / data.getLessonProgress.totalSlides)}%`;
                        notifyCourseProgress.getElement().innerHTML = progress;
                        notifyProgressLine.getElement().style.width = progress;
                        if (progress == "100%") {
                            courseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}&preview=true`);
                        } else {
                            courseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`);
                        }
                    } else {
                        notifyCourseProgress.getElement().innerHTML = "0%";
                        notifyProgressLine.getElement().style.width = "0%";
                        courseWrapper.on("click", () => {
                            startCourseReq.onData((data) => {
                                if (data) {
                                    setTimeout(() => {
                                        navigate(
                                            `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                        );
                                    }, 100);
                                }
                            });
                            startCourseReq.fetch({
                                lessonId: _data.id,
                            });
                        });
                    }
                }).catch((err) => {
                    notifyCourseProgress.getElement().innerHTML = "0%";
                    notifyProgressLine.getElement().style.width = "0%";
                    courseWrapper.on("click", () => {
                        startCourseReq.onData((data) => {
                            if (data) {
                                setTimeout(() => {
                                    navigate(
                                        `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                    );
                                }, 100);
                            }
                        });
                        startCourseReq.fetch({
                            lessonId: _data.id,
                        });
                    });
                    console.log("Error: ", err);
                });
                courseTrigger.getElement().click();
                newNotification.addCssClass("hide");
            });

            return rowElement;
        });
        viewAllList.setData(notifications);
        // getSkeletonLoader().hide();
        showData().show();
    }

    else if (tab == "reminders") {

        const viewAllList = new WFDynamicList<
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
        >(`[xa-type="remindersWrap"]`, {
            rowSelector: `[xa-type="remindersCard"]`,
        });

        viewAllList.rowRenderer(({ rowData, rowElement }) => {
            const _data = JSON.parse(rowData.notificationData);
            const notificationIcon = rowElement.getChildAsComponent(`[xa-type="notificationImg"]`);
            const newNotification = rowElement.getChildAsComponent(`[xa-type="newNotification"]`);
            const t = dayjs(LastSeen).diff(rowData.createdAt, 'milliseconds');
            const notificationTitle = rowElement.getChildAsComponent(`.notification-title`);

            notificationIcon.setAttribute("src", notificationIcons.reminder);
            notificationIcon.setAttribute("srcset", notificationIcons.reminder);
            rowElement.updateTextViaAttrVar({
                // notificationText: rowData.title,
                notifiedTime: dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a"),
            });
            notificationTitle.getElement().innerHTML = removeH5Tags(rowData.title);
            if (t >= 0) {
                newNotification.addCssClass("hide");
            }
            rowElement.on("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                remindersDialogTitle.getElement().innerHTML = rowData.title;
                remindersDialogDesc.getElement().innerHTML = rowData.description;
                remindersDialogTime.getElement().innerHTML = dayjs(rowData.createdAt).format("MM-DD-YYYY hh:mm a");
                reminderCourseTitle.getElement().innerHTML = _data.title;
                reminderCourseTag.getElement().innerHTML = _data.tag;
                reminderCourseTagM.getElement().innerHTML = _data.tag;
                reminderCourseImg.setAttribute("src", _data.image);
                reminderCourseImg.setAttribute("srcset", _data.image);
                courseProgressReq.fetch({ lessonId: _data.id }).then((data) => {
                    if (data.getLessonProgress) {
                        const progress = `${Math.round(data.getLessonProgress.progress * 100 / data.getLessonProgress.totalSlides)}%`;
                        reminderCourseProgress.getElement().innerHTML = progress;
                        reminderProgressLine.getElement().style.width = progress;
                        if (progress == "100%") {
                            reminderCourseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}&preview=true`);
                        } else {
                            reminderCourseWrapper.setAttribute("href", `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`);
                        }
                    } else {
                        reminderCourseProgress.getElement().innerHTML = "0%";
                        reminderProgressLine.getElement().style.width = "0%";
                        reminderCourseWrapper.on("click", () => {
                            startCourseReq.onData((data) => {
                                if (data) {
                                    setTimeout(() => {
                                        navigate(
                                            `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                        );
                                    }, 100);
                                }
                            });
                            startCourseReq.fetch({
                                lessonId: _data.id,
                            });
                        });
                    }
                }).catch((err) => {
                    reminderCourseProgress.getElement().innerHTML = "0%";
                    reminderProgressLine.getElement().style.width = "0%";
                    reminderCourseWrapper.on("click", () => {
                        startCourseReq.onData((data) => {
                            if (data) {
                                setTimeout(() => {
                                    navigate(
                                        `${PUBLIC_PATHS.viewCourse}?id=${_data.id}`
                                    );
                                }, 100);
                            }
                        });
                        startCourseReq.fetch({
                            lessonId: _data.id,
                        });
                    });
                    console.log("Error: ", err);
                });
                remindersTrigger.getElement().click();
                newNotification.addCssClass("hide");
            });

            return rowElement;
        });
        viewAllList.setData(notifications);
        // getSkeletonLoader().hide();
        showData().show();
    }


}

function updateDotPosition() {

}