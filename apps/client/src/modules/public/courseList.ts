import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicGetAllCertificationsDocument, RestartCourseDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { showData } from "../utils/loadData";
import { removeH5Tags, removeHTMLTags } from "../utils/removeHtmlTags";

export const userCourseList = () => {
    const getAllCertificationsReq = publicQL.query(PublicGetAllCertificationsDocument);
    const restartCourseReq = publicQL.mutation(RestartCourseDocument);
    const courseDyList = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            lesson?: { 
                id: string,
                enabled: boolean,
                lessonProgress?: {
                    completed: boolean,
                    progress: number
                }[]
            }[]
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="courseList"]`, {
        rowSelector: `[xa-type="courseItem"]`,
    });
    courseDyList.rowRenderer(({rowData, rowElement, index}) => {
        const image = rowElement.getChildAsComponent<HTMLImageElement>(`[xa-type="courseImage"]`);
        const courseTitle = rowElement.getChildAsComponent(`[xa-var="courseTitle"]`);
        image.setAttribute("src", rowData.image);
        image.setAttribute("srcSet", rowData.image);
        courseTitle.setHTML(removeH5Tags(rowData.title));
        rowElement.updateTextViaAttrVar({
            courseNoOfLesson: `${rowData.lesson.length} Lessons`
        });
        const courseDetailsLink = rowElement.getChildAsComponent(`[xa-type="continueCourseLink"]`);const totalLessons = rowData.lesson.length;
        const completedLessons = rowData.lesson.filter(l => l.lessonProgress && l.lessonProgress.length && l.lessonProgress[0].completed).length;
        const courseId = rowData.id;
        if (rowData.lesson && rowData.lesson.length) {
            if (completedLessons === totalLessons) {
                courseDetailsLink.setText("Restart Course");
                restartCourseReq.onData((data) => {
                    if (data) {
                        navigate(`${PUBLIC_PATHS.courseDetails}?id=${courseId}`);
                    }
                })
                courseDetailsLink.on("click", () => {
                    restartCourseReq.fetch({
                        certificationId: courseId
                    });
                });
            } else {
                const inProgressLessons = rowData.lesson.some(l => l.lessonProgress && l.lessonProgress.length && (l.lessonProgress[0].progress || l.lessonProgress[0].progress === 0) && (!l.lessonProgress[0].completed));
                if (inProgressLessons) {
                    courseDetailsLink.setText("Continue Course");
                } else {
                    courseDetailsLink.setText("Start Course");
                }
                courseDetailsLink.on("click", () => {
                    navigate(`${PUBLIC_PATHS.courseDetails}?id=${courseId}`);
                });
            }
        }
        const progressLine =
            rowElement.getChildAsComponent(
                `[xa-type="progressLine"]`
            );
        const progressPercentageLabel =
            rowElement.getChildAsComponent(
                `[xa-type="courseProgress"]`
            );
        const progressPercent =
            (completedLessons * 100) / totalLessons;
        progressPercentageLabel.setText(
            `${progressPercent.toFixed(0)}%`
        );
        progressLine.setAttribute(
            "style",
            `width: ${progressPercent.toFixed(0)}%`
        );
        return rowElement;
    });

    getAllCertificationsReq.onData(async (certificationsData) => {
        const activeCourses = certificationsData.publicGetAllCertifications.filter(c => c.lesson.some(c => c.enabled));
        courseDyList.setData(activeCourses);
        const mainContent = new WFComponent<HTMLDivElement>(`.airlines-card-list`);
        showData().show();
        mainContent.removeCssClass("hide");
        if (activeCourses.length % 2 !== 0) {
            const emptyCardBlock = new WFComponent<HTMLDivElement>(`[xa-type="courseEmptyItem"]`);
            const courseList = new WFComponent<HTMLDivElement>(`[xa-type="courseList"]`);
            courseList.appendChild(emptyCardBlock);
        }
    });

    getAllCertificationsReq.fetch();
}