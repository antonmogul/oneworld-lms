import {
    WFComponent,
    WFDynamicList,
    navigate,
} from "@xatom/core";
import getLoader from "../utils/getLoader";
import { publicQL } from "../../graphql";
import {
    GetAllLessonProgressDocument,
    GetAllLessonsDocument,
    PublicGetAllCertificationsDocument,
    RestartLessonDocument,
    SavedItemType,
    StartLessonDocument,
} from "../../graphql/graphql";
import { PUBLIC_PATHS, shadowBackgroundColors } from "../../config";
import { initSaveComponent } from "../utils/savedItemStore";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeH5Tags, removeHTMLTags } from "../utils/removeHtmlTags";

// getSkeletonLoader().show();

export const userCourseDetails = ({id}: {id: string}) => {
    const getAllLessonsReq = publicQL.query(
        GetAllLessonsDocument
    );
    const getAllLessonProgressReq = publicQL.query(
        GetAllLessonProgressDocument
    );
    const startLessonReq = publicQL.mutation(
        StartLessonDocument
    );

    const getAllCertificationsReq = publicQL.query(PublicGetAllCertificationsDocument);

    const restartCourseReq = publicQL.mutation(RestartLessonDocument);

    const promises = [
        getAllLessonsReq.fetch()
    ];
    const currentCertificationId = id;
    const coursesWrapper = new WFComponent(`[xa-type="dashboardCourses"]`);
    const allCompleted = new WFComponent(`[xa-type="allCompleted"]`);
    const inProgress = coursesWrapper.getChildAsComponent(`[xa-type="inProgress"]`);

    let allCourseProgress;
    const userLearningPathListIP = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            tag: string;
            progress?: number;
            totalSlides?: number;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="userLearningPathIP"]`, {
        rowSelector: `[xa-type="courseItemIP"]`,
        loaderSelector: `[xa-type="coursesLoadingIP"]`,
    });
    userLearningPathListIP.rowRenderer(
        ({ rowData, rowElement, index }) => {
            const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
            const courseTagM = rowElement.getChildAsComponent(`[xa-type="courseTagPillM"]`);
            rowElement.updateTextViaAttrVar({
                coursetag: rowData.tag,
                // courseName: rowData.title,
            });
            courseTagM.getElement().innerHTML = rowData.tag;
            courseTitle.getElement().innerHTML = rowData.title;

            initSaveComponent(
                rowData.id,
                SavedItemType.Course,
                rowElement.getChildAsComponent(
                    `[xa-type="favouritingIcon"]`
                )
            );
            const startCourseLink =
                rowElement.getChildAsComponent(
                    `[xa-type="startCourse"]`
                );
            const courseImage = rowElement.getChildAsComponent(
                `[xa-type="courseThumbnail"]`
            );
            const progressWrap = rowElement.getChildAsComponent(
                `[xa-type="courseProgressWrap"]`
            );
            courseImage.setAttribute("src", rowData.image);
            courseImage.setAttribute("srcset", rowData.image);
            const lessonProgress =
                allCourseProgress.getAllLessonProgress.find(
                    (pd) => pd.lessonId === rowData.id
                );
            let display = true;
            if (lessonProgress && lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Restart Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    restartCourseReq.onData((res) => {
                        if (res) {
                            navigate(`${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`);
                        }
                    });
                    restartCourseReq.fetch({
                        lessonId: rowData.id
                    })
                });

            } else if (lessonProgress && !lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Continue Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            } else {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Start Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            }
            if (display) {
                const thumbnailWrap = rowElement.getChildAsComponent(
                    `[xa-type="thumbnailWrap"]`
                )
                thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount + 1) % 4]}`)
                colorCount++;
            }
            return rowElement;
        }
    );
    const userLearningPathListNS = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            tag: string;
            progress?: number;
            totalSlides?: number;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="userLearningPathNS"]`, {
        rowSelector: `[xa-type="courseItemNS"]`,
        loaderSelector: `[xa-type="coursesLoadingNS"]`,
    });
    userLearningPathListNS.rowRenderer(
        ({ rowData, rowElement, index }) => {
            const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
            const courseTagM = rowElement.getChildAsComponent(`[xa-type="courseTagPillM"]`);
            rowElement.updateTextViaAttrVar({
                coursetag: rowData.tag,
                // courseName: rowData.title,
            });
            courseTagM.getElement().innerHTML = rowData.tag;
            courseTitle.getElement().innerHTML = rowData.title;

            initSaveComponent(
                rowData.id,
                SavedItemType.Course,
                rowElement.getChildAsComponent(
                    `[xa-type="favouritingIcon"]`
                )
            );
            const startCourseLink =
                rowElement.getChildAsComponent(
                    `[xa-type="startCourse"]`
                );
            const courseImage = rowElement.getChildAsComponent(
                `[xa-type="courseThumbnail"]`
            );
            const progressWrap = rowElement.getChildAsComponent(
                `[xa-type="courseProgressWrap"]`
            );
            courseImage.setAttribute("src", rowData.image);
            courseImage.setAttribute("srcset", rowData.image);
            const lessonProgress =
                allCourseProgress.getAllLessonProgress.find(
                    (pd) => pd.lessonId === rowData.id
                );
            let display = true;
            if (lessonProgress && lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Restart Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    restartCourseReq.onData((res) => {
                        if (res) {
                            navigate(`${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`);
                        }
                    });
                    restartCourseReq.fetch({
                        lessonId: rowData.id
                    })
                });

            } else if (lessonProgress && !lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Continue Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            } else {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Start Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            }
            if (display) {
                const thumbnailWrap = rowElement.getChildAsComponent(
                    `[xa-type="thumbnailWrap"]`
                )
                thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount + 1) % 4]}`)
                colorCount++;
            }
            return rowElement;
        }
    );
    const userLearningPathListC = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            tag: string;
            progress?: number;
            totalSlides?: number;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="userLearningPathC"]`, {
        rowSelector: `[xa-type="courseItemC"]`,
        loaderSelector: `[xa-type="coursesLoadingC"]`,
    });
    userLearningPathListC.rowRenderer(
        ({ rowData, rowElement, index }) => {
            const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
            const courseTagM = rowElement.getChildAsComponent(`[xa-type="courseTagPillM"]`);
            rowElement.updateTextViaAttrVar({
                coursetag: rowData.tag,
                // courseName: rowData.title,
            });
            courseTagM.getElement().innerHTML = rowData.tag;
            courseTitle.getElement().innerHTML = rowData.title;

            initSaveComponent(
                rowData.id,
                SavedItemType.Course,
                rowElement.getChildAsComponent(
                    `[xa-type="favouritingIcon"]`
                )
            );
            const startCourseLink =
                rowElement.getChildAsComponent(
                    `[xa-type="startCourse"]`
                );
            const courseImage = rowElement.getChildAsComponent(
                `[xa-type="courseThumbnail"]`
            );
            const progressWrap = rowElement.getChildAsComponent(
                `[xa-type="courseProgressWrap"]`
            );
            courseImage.setAttribute("src", rowData.image);
            courseImage.setAttribute("srcset", rowData.image);
            const lessonProgress =
                allCourseProgress.getAllLessonProgress.find(
                    (pd) => pd.lessonId === rowData.id
                );
            let display = true;
            if (lessonProgress && lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Restart Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    restartCourseReq.onData((res) => {
                        if (res) {
                            navigate(`${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`);
                        }
                    });
                    restartCourseReq.fetch({
                        lessonId: rowData.id
                    })
                });

            } else if (lessonProgress && !lessonProgress.completed) {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Continue Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            } else {
                progressWrap.addCssClass("hide");
                startCourseLink.removeCssClass("hide");
                startCourseLink.getChildAsComponent(".course-link__txt").setText("Start Lesson")
                startCourseLink.on("click", () => {
                    startCourseLink
                        .getChildAsComponent(".course-link__txt")
                        .setText("Please wait...");
                    startLessonReq.onData((data) => {
                        if (data) {
                            setTimeout(() => {
                                navigate(
                                    `${PUBLIC_PATHS.viewCourse}?id=${rowData.id}`
                                );
                            }, 100);
                        }
                    });
                    startLessonReq.fetch({
                        lessonId: rowData.id,
                    });
                });
            }
            if (display) {
                const thumbnailWrap = rowElement.getChildAsComponent(
                    `[xa-type="thumbnailWrap"]`
                )
                thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount + 1) % 4]}`)
                colorCount++;
            }
            return rowElement;
        }
    );
    let colorCount;
    getAllLessonsReq.onData((coursesData) => {
        getAllLessonProgressReq.onData(async (progressData) => {
            getAllCertificationsReq.onData(async (certificationsData) => {
                if (progressData.getAllLessonProgress) {
                    allCourseProgress = progressData;
                    const currentCertification = certificationsData.publicGetAllCertifications.find((c) => c.id === currentCertificationId);
                    const completedLessons = currentCertification.lesson.filter(l => l.enabled && l.lessonProgress[0] && l.lessonProgress[0].completed);
                    const incompleteLessons = currentCertification.lesson.filter(l => l.lessonProgress[0] && l.lessonProgress[0].progress >= 0 && (!l.lessonProgress[0].completed));
                    const notStartedLessons = currentCertification.lesson.filter(l => l && (!l.lessonProgress[0]));
                    const currentCourseId = await setCurrentCourse(
                        coursesData.getAllLessons.filter(c => currentCertification.lesson.find(l => l.id === c.id)),
                        progressData.getAllLessonProgress.filter(c => currentCertification.lesson.find(l => l.id === c.lessonId)),
                        certificationsData.publicGetAllCertifications,
                        currentCertificationId
                    );
                    const courseCounterDivIP = new WFComponent<HTMLDivElement>(
                        `[xa-type="courseCounterIP"]`
                    );
                    const courseCounterDivNS = new WFComponent<HTMLDivElement>(
                        `[xa-type="courseCounterNS"]`
                    );
                    const courseCounterDivC = new WFComponent<HTMLDivElement>(
                        `[xa-type="courseCounterC"]`
                    );
                    const newDivIP = document.createElement("div");
                    newDivIP.className = "text-size-xsmall";
                    newDivIP.innerHTML = `In-Progress: <strong>${incompleteLessons.length}</strong>`
                    const newDivNS = document.createElement("div");
                    newDivNS.className = "text-size-xsmall";
                    newDivNS.innerHTML = `Not Started: <strong>${notStartedLessons.length}</strong>`
                    const newDivC = document.createElement("div");
                    newDivC.className = "text-size-xsmall";
                    newDivC.innerHTML = `Completed: <strong>${completedLessons.length}</strong>`
                    courseCounterDivIP.setHTML("");
                    courseCounterDivIP.getElement().appendChild(newDivIP);
                    courseCounterDivNS.setHTML("");
                    courseCounterDivNS.getElement().appendChild(newDivNS);
                    courseCounterDivC.setHTML("");
                    courseCounterDivC.getElement().appendChild(newDivC);
                    let courseWithProgress = coursesData.getAllLessons;
                    courseWithProgress = courseWithProgress.filter(cd => currentCertification.lesson.find(l => l.id === cd.id));
                    courseWithProgress = courseWithProgress.filter(c => c.id !== currentCourseId);
                    const allLessons = [...incompleteLessons, ...notStartedLessons, ...completedLessons];
                    const inProgressCourses: {
                        id: string;
                        title: string;
                        image: string;
                        tag: string;
                        progress?: number;
                        totalSlides?: number;
                    }[] = [];
                    const notStartedCourses: {
                        id: string;
                        title: string;
                        image: string;
                        tag: string;
                        progress?: number;
                        totalSlides?: number;
                    }[] = [];
                    const completedCourses: {
                        id: string;
                        title: string;
                        image: string;
                        tag: string;
                        progress?: number;
                        totalSlides?: number;
                    }[] = [];
                    for (let l of allLessons) {
                        const lesson = courseWithProgress.find(cp => cp.id === l.id);
                        if (lesson) {
                            const totalSlides = JSON.parse(lesson.lessonsSlides).length + JSON.parse(lesson.quizSlides).length;
                            const progress = progressData.getAllLessonProgress.find(lp => lp.lessonId === lesson.id);
                            if (totalSlides && progress && totalSlides === progress.progress + 1 && progress.completed === true) {
                                completedCourses.push(lesson);
                            } else if (totalSlides && progress && totalSlides > progress.progress) {
                                inProgressCourses.push(lesson);
                            } else {
                                notStartedCourses.push(lesson);
                            }
                        }
                    }
                    colorCount = 0;
                    if (notStartedCourses && notStartedCourses.length) {
                        userLearningPathListNS.setData(notStartedCourses);
                    } else {
                        userLearningPathListNS.addCssClass("hide")
                        courseCounterDivNS.addCssClass("hide")
                    }
                    if (completedCourses && completedCourses.length) {
                        userLearningPathListC.setData(completedCourses);
                    } else {
                        userLearningPathListC.addCssClass("hide");
                        courseCounterDivC.addCssClass("hide");
                    }
                    if (inProgressCourses && inProgressCourses.length) {
                        userLearningPathListIP.setData(inProgressCourses);
                    } else {
                        userLearningPathListIP.addCssClass("hide")
                        courseCounterDivIP.addCssClass("hide")
                    }
                    // getSkeletonLoader().hide();
                    showData().show();
                } else {
                    allCourseProgress = null;
                    const currentCourseId = await setCurrentCourse(coursesData.getAllLessons, null, certificationsData.publicGetAllCertifications, currentCertificationId);
                    if (currentCourseId) {
                        const completeCourses =
                            progressData.getAllLessonProgress
                                .filter((p) => p.completed)
                                .length.toString() || "0";
                        const totalCourses =
                            coursesData.getAllLessons.length.toString();
                        const totalCoursesDiv = new WFComponent(
                            `[xa-type="totalCourses"]`
                        );
                        const completeCoursesDiv = new WFComponent(
                            `[xa-type="completeCourses"]`
                        );
                        totalCoursesDiv.setText(totalCourses);
                        completeCoursesDiv.setText(completeCourses);
                        let courseWithProgress: {
                            id: string;
                            title: string;
                            image: string;
                            tag: string;
                            progress?: number;
                            totalSlides?: number;
                        }[] = coursesData.getAllLessons;
                        courseWithProgress = courseWithProgress.filter(c => c.id !== currentCourseId);
                        colorCount = 0;
                        userLearningPathListNS.setData(courseWithProgress);
                        // getSkeletonLoader().hide();
                        showData().show();
                    }
                }
                const noCompletedCourses = progressData.getAllLessonProgress.filter(course => course.completed).length;
                if (noCompletedCourses && noCompletedCourses === coursesData.getAllLessons.length) {
                    inProgress.addCssClass("hide");
                    allCompleted.removeCssClass("hide");
                }
            });
            getAllCertificationsReq.fetch();
        });
        getAllLessonProgressReq.fetch();
    });
    getAllLessonsReq.fetch();
};

const setCurrentCourse = (coursesData, progressData, allCertificationsData, currentCertificationId) => {
    return new Promise((resolve, reject) => {
        const startNewCourseReq = publicQL.mutation(
            StartLessonDocument
        );
        let currentCourse;
        const currentCourseDiv = new WFComponent(
            `[xa-type="currentCoursesItem"]`
        );
        const courseTitle = currentCourseDiv.getChildAsComponent(`[xa-type="courseTitle"]`);
        const courseTag = currentCourseDiv.getChildAsComponent(`[xa-type="courseTag"]`);
        const currentCourseLoader = new WFComponent(
            `[xa-type="currentCourseLoading"]`
        );
        const continueCourseLink =
            currentCourseDiv.getChildAsComponent(
                `[xa-type="continueCourseLink"]`
            );
        currentCourseDiv.addCssClass("hide");
        currentCourseLoader.removeCssClass("hide");
        const currentCourseImage = new WFComponent(
            `[xa-type="courseThumbnail"]`
        );
        const dashboardCourses = new WFComponent(
            `[xa-type="dashboardCourses"]`
        );
        const dashboardHeadingM = new WFComponent(`[xa-type="coursesHeadingM"]`);

        const allCompleted = new WFComponent(`[xa-type="allCompleted"]`);
        const coursesWrapper = new WFComponent(`[xa-type="dashboardCourses"]`);

        let currentCertification;

        let totalLessonsOfCurrentCertification;
        let completedLessonsOfCurrentCertification;

        if (progressData && progressData.length) {
            const completedCourseIds = [];
            let inCompleteProgressData = progressData.filter(
                (pd) => {
                    if (pd.completed) {
                        completedCourseIds.push(pd.lessonId);
                        return false;
                    } else {
                        return true;
                    }
                }
            );
            if (inCompleteProgressData && inCompleteProgressData.length) {
                inCompleteProgressData = inCompleteProgressData.sort(
                    (course1, course2) => {
                        return (
                            new Date(course2.updatedAt).getTime() -
                            new Date(course1.updatedAt).getTime()
                        );
                    }
                );
                currentCourse = coursesData.find((course) => {
                    return (
                        course.id === inCompleteProgressData[0].lessonId
                    );
                });
                currentCertification = allCertificationsData.find((c) => c.id === currentCertificationId);
                totalLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled).length;
                completedLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled && lesson.lessonProgress[0] && lesson.lessonProgress[0].completed).length;
                currentCourse.isStarted = true;
                try {
                    const courseHeading =  new WFComponent(`[xa-var="coursesHeading"]`);
                    courseHeading.getElement().innerHTML = removeH5Tags(currentCertification.title);
                    const motivationLine = new WFComponent(`[xa-var="motivation-line"]`);
                    motivationLine.getElement().innerHTML= removeH5Tags(`- Pickup where you left off!`);
                    const motivationLineM = new WFComponent(`[xa-var="motivation-lineM"]`);
                    motivationLineM.getElement().innerHTML= removeH5Tags(`- Pickup where you left off!`);
                    dashboardHeadingM.getElement().innerHTML = `${removeHTMLTags(currentCertification.title)}`;
                } catch(err) {
                    console.log(err);
                }
                currentCourseImage.setAttribute(
                    "src",
                    currentCertification.image
                );
                currentCourseImage.setAttribute(
                    "srcset",
                    currentCertification.image
                );
                const currentCourseSlides = progressData.find(
                    (pd) => pd.courseId === currentCourse.id
                );
                currentCourseDiv.updateTextViaAttrVar({
                    // courseName: currentCourse.title,
                    btnText: "Continue",
                });
            } else {
                let coursesNotStarted = coursesData.filter((c) => {
                    if (completedCourseIds.includes(c.id)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                if (coursesNotStarted && coursesNotStarted.length) {
                    currentCourse = coursesNotStarted[0];
                    currentCourse.isStarted = false;
                    currentCertification = allCertificationsData.find((c) => c.id === currentCertificationId);
                    totalLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled).length;
                    completedLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled && lesson.lessonProgress[0] && lesson.lessonProgress[0].completed).length;
                    currentCourseImage.setAttribute(
                        "src",
                        currentCertification.image
                    );
                    currentCourseImage.setAttribute(
                        "srcset",
                        currentCertification.image
                    );
                    try {
                        const courseHeading =  new WFComponent(`[xa-var="coursesHeading"]`);
                        courseHeading.getElement().innerHTML = removeH5Tags(currentCertification.title);
                        const motivationLine = new WFComponent(`[xa-var="motivation-line"]`);
                        motivationLine.getElement().innerHTML= removeH5Tags(`- You're ready for take off!`);
                        const motivationLineM = new WFComponent(`[xa-var="motivation-lineM"]`);
                        motivationLineM.getElement().innerHTML= removeH5Tags(`- You're ready for take off!`);
                    } catch(err) {
                        console.log(err);
                    }
                    currentCourseDiv.updateTextViaAttrVar({
                        // courseName: currentCourse.title,
                        btnText: "Start Here",
                    });
                } else {
                    //   coursesWrapper.addCssClass("hide");
                    // allCompleted.removeCssClass("hide");
                }

            }
        } else {
            currentCourse = coursesData[0];
            currentCourse.isStarted = false;
            currentCertification = allCertificationsData.find((c) => c.id === currentCertificationId);
            totalLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled).length;
            completedLessonsOfCurrentCertification = currentCertification.lesson.filter((lesson) => lesson.enabled && lesson.lessonProgress[0] && lesson.lessonProgress[0].completed).length;
            currentCourseImage.setAttribute(
                "src",
                currentCertification.image
            );
            currentCourseImage.setAttribute(
                "srcset",
                currentCertification.image
            );
            try {
                const courseHeading =  new WFComponent(`[xa-var="coursesHeading"]`);
                courseHeading.getElement().innerHTML = removeH5Tags(currentCertification.title);
                const motivationLine = new WFComponent(`[xa-var="motivation-line"]`);
                motivationLine.getElement().innerHTML= removeH5Tags(`- You're ready for take off!`);
                dashboardHeadingM.getElement().innerHTML = `${removeHTMLTags(currentCertification.title)}`;
                const motivationLineM = new WFComponent(`[xa-var="motivation-lineM"]`);
                motivationLineM.getElement().innerHTML= removeH5Tags(`- You're ready for take off!`);
            } catch(err) {
                console.log(err);
            }
            currentCourseDiv.updateTextViaAttrVar({
                // courseName: currentCourse.title,
                btnText: "Start Here",
            });
        }
        if (currentCourse) {
            courseTitle.getElement().innerHTML = removeH5Tags(currentCertification.title);
            courseTag.getElement().innerHTML = currentCourse.tag;
            currentCourseDiv.removeCssClass("hide");
            currentCourseLoader.addCssClass("hide");
            continueCourseLink.on("click", () => {
                setTimeout(() => {
                    navigate(
                        `${PUBLIC_PATHS.viewCourse}?id=${currentCourse.id}`
                    );
                }, 100);
            });
            const thumbnailWrap = currentCourseDiv.getChildAsComponent(
                `[xa-type="thumbnailWrap"]`
            )
            thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[0 % 4]}`)

            const progressLine =
                currentCourseDiv.getChildAsComponent(
                    `[xa-type="progressLine"]`
                );
            const progressPercentageLabel =
                currentCourseDiv.getChildAsComponent(
                    `[xa-type="courseProgress"]`
                );
            const progressPercent =
                (completedLessonsOfCurrentCertification * 100) / totalLessonsOfCurrentCertification;
            progressPercentageLabel.setText(
                `${progressPercent.toFixed(0)}%`
            );
            progressLine.setAttribute(
                "style",
                `width: ${progressPercent.toFixed(0)}%`
            );
            resolve(currentCourse.id);
        } else {
            resolve(null);
            // coursesWrapper.addCssClass("hide");
            //   allCompleted.removeCssClass("hide");
        }
    });
};
