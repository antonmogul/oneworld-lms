import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { GetCertificateByIdDocument, PublicGetAllCertificationsDocument, PublicGetCertificationByIdDocument, RestartLessonDocument, SavedItemType } from "../../graphql/graphql";
import { PUBLIC_PATHS, shadowBackgroundColors } from "../../config";
import { showData } from "../utils/loadData";
import { removeH5Tags, removeHTMLTags } from "../utils/removeHtmlTags";
import { initSaveComponent } from "../utils/savedItemStore";

// getSkeletonLoader().show();

export const userCertifications = () => {
    const certificateReq = publicQL.query(
        PublicGetAllCertificationsDocument
    );
    const noCertificates = new WFComponent<HTMLDivElement>(
        `[xa-type="noCertificates"]`
    );
    const certiWrapper = new WFComponent<HTMLDivElement>(
        `[xa-type="certificateWrapper"]`
    );
    const list = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            pdf: string;
            createdAt: string;
            lesson?: {
                lessonProgress?: Array<{
                    id: string;
                    userId: string;
                    lessonId: string;
                    progress: number;
                    completed: boolean;
                    completedAt?: string;
                    createdAt: string;
                    updatedAt: string;
                }>;
            }[];
            certificate?: {
                id: string;
            }[]
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="certiList"]`, {
        rowSelector: `[xa-type="certiBlock"]`,
    });

    let colorCount = 0;
    list.rowRenderer(({ rowData, rowElement }) => {
        const image = rowElement.getChildAsComponent(
            `[wized="certiimg"]`
        );
        const heading = rowElement.getChildAsComponent(
            `[wized="certiheading"]`
        );
        const link = rowElement.getChildAsComponent(
            `[wized="certilink"]`
        );
        const downloadLink = rowElement.getChildAsComponent(
            `[wized="certiDownloadlink"]`
        );
        const completedTik = rowElement.getChildAsComponent(`[xa-type="completedTick"]`);
        image.setAttribute("src", rowData.image);
        image.setAttribute("srcset", rowData.image);
        heading.setHTML(removeH5Tags(rowData.title));
        link.on("click", () => {
            navigate(`${PUBLIC_PATHS.courseHightlights}?id=${rowData.certificate[0].id}`);
        });
        downloadLink.on("click", () => {
            window.open(rowData.pdf, "_blank");
        })
        // let display = true;
        if (rowData.lesson.filter(d => d.lessonProgress && d.lessonProgress.length && d.lessonProgress[0].completed).length === rowData.lesson.length) {
            completedTik.removeCssClass("hide");
        } else {
            completedTik.addCssClass("hide");
        }

        {
            const thumbnailWrap = rowElement.getChildAsComponent(
                `[xa-type="thumbnailWrap"]`
            );
            thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[colorCount % 4]}`);
            colorCount++;
        }
        return rowElement;
    });

    certificateReq.fetch().then((response) => {
        const certifications = response.publicGetAllCertifications;
        let completedCertification = [];

        certifications.forEach((certification) => {
            const totalLessons = certification.lesson.length;
            let hasCompletedCourse = 0;
            if (certification.lesson.length) {
                certification.lesson.forEach((course) => {
                    if (course.lessonProgress[0] && course.lessonProgress[0].completed) {
                        hasCompletedCourse++
                    }
                });
            }

            if (totalLessons && totalLessons > 0 && hasCompletedCourse === totalLessons) {
                completedCertification.push(certification);
            }
        });

        showData().show();
        if (completedCertification.length) {
            list.setData(completedCertification);
        } else {
            certiWrapper.addCssClass("hide");
            noCertificates.removeCssClass("hide");
        }

        // getSkeletonLoader().hide();
        // if (response.publicGetAllCertifications) {
        //     noCertificates.addCssClass("hide");
        //     certiWrapper.removeCssClass("hide");
        // } else {
        //     noCertificates.removeCssClass("hide");
        //     certiWrapper.addCssClass("hide");
        // }
    });

    certificateReq.onError((err) => {
        noCertificates.removeCssClass("hide");
        certiWrapper.addCssClass("hide");
    });
}

export const userCertificationDetail = (data: { id: string }) => {
    const certNavLink = new WFComponent(`[xa-type="certNavLink"]`);
    const certNavLinkM = new WFComponent(`[xa-type="certNavLinkM"]`);
    certNavLink.addCssClass("w--current");
    certNavLinkM.addCssClass("w--current");
    const certFetchReq = publicQL.query(
        PublicGetCertificationByIdDocument
    );
    const list = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            tag: string;
            certificate?: Array<{
                id
            }>;
            courseProgress?: Array<{
                id: string;
                userId: string;
                courseId: string;
                progress: number;
                completed: boolean;
                completedAt?: string;
                createdAt: string;
                updatedAt: string;
            }>;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="userLearningPath"]`, {
        rowSelector: `[xa-type="courseItem"]`,
    });

    let colorCount = 0;
    list.rowRenderer(({ rowData, rowElement }) => {
        const courseThumb = rowElement.getChildAsComponent(`[xa-type="courseThumbnail"]`);
        const courseTitle = rowElement.getChildAsComponent(`[xa-type="courseTitle"]`);
        const link = rowElement.getChildAsComponent(`[xa-type="viewHighlights"]`);
        link.addCssClass("hide");
        rowElement.updateTextViaAttrVar({
            coursetag: rowData.tag,
        });
        courseTitle.getElement().innerHTML = removeH5Tags(rowData.title);

        courseThumb.setAttribute("src", rowData.image);
        courseThumb.setAttribute("srcset", rowData.image);

        {
            const thumbnailWrap = rowElement.getChildAsComponent(
                `[xa-type="thumbnailWrap"]`
            );
            thumbnailWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[(colorCount + 1) % 4]}`);
            colorCount++;
        }
        return rowElement;
    });


    certFetchReq.fetch({ certificationId: data.id }).then((response) => {
        const completedCourses = response.publicGetCertificationById.lesson.filter(d => d.lessonProgress && d.lessonProgress.length && d.lessonProgress[0].completed);
        list.setData(completedCourses);
        const certHeader = new WFComponent(`[xa-type="currentCoursesItem"]`);
        const certTitle = certHeader.getChildAsComponent(`[xa-type="courseTitle"]`);
        const certThumb = certHeader.getChildAsComponent(`[xa-type="courseThumbnail"]`);
        const certThumbWrap = certHeader.getChildAsComponent(`[xa-type="thumbnailWrap"]`);
        const certDownloadLink = certHeader.getChildAsComponent(`[xa-type="downloadLink"]`);
        const certHighlightLink = certHeader.getChildAsComponent(`[xa-type="highlightLink"]`);
        certHighlightLink.updateTextViaAttrVar({
            btnHighlightText: "Certificate Highlights"
        });
        certDownloadLink.updateTextViaAttrVar({
            btnDownloadText: "Download PDF"
        });
        if (response.publicGetCertificationById.lesson.length === completedCourses.length) {
            certHighlightLink.removeCssClass("hide");
            certDownloadLink.removeCssClass("hide");
            certHighlightLink.on("click", () => {
                navigate(`${PUBLIC_PATHS.courseHightlights}?id=${response.publicGetCertificationById.certificate[0].id}`);
            });
            certDownloadLink.on("click", () => {
                window.open(response.publicGetCertificationById.pdf);
            })
        } else {
            certHighlightLink.addCssClass("hide");
            certDownloadLink.addCssClass("hide");
        }
        if (!response.publicGetCertificationById.pdf) {
            certDownloadLink.addCssClass("hide");
        }
        // certTitle.updateTextViaAttrVar({
        //     courseName: response.publicGetCertificationById.title
        // });
        certTitle.setHTML(removeH5Tags(response.publicGetCertificationById.title));
        
        certThumb.setAttribute("src", response.publicGetCertificationById.image);
        certThumb.setAttribute("srcset", response.publicGetCertificationById.image);
        certThumbWrap.setAttribute("style", `background-color: ${shadowBackgroundColors[0]}`);
        showData().show();
    });
}

export const userCourseHighlights = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id');
    const certificateReq = publicQL.query(GetCertificateByIdDocument, {
        variables: {
            certificateId
        }
    });
    const certificateHeader = new WFComponent<HTMLDivElement>(
        `[xa-type="certificateHeader"]`
    );
    const courseTitle = certificateHeader.getChildAsComponent(`[xa-type="courseTitle"]`);
    const courseHighlights = document.getElementsByClassName("global__rich-text");
    const certificateImage = new WFComponent<HTMLImageElement>(
        `[xa-type="courseThumbnail"]`
    );

    certificateReq.onData((data) => {
        certificateHeader.updateTextVariable({
            courseTitle: data.getCertificatesById.certification.title
        });
        courseTitle.getElement().innerHTML = removeH5Tags(data.getCertificatesById.certification.certificateDetails);
        courseHighlights[0].innerHTML = data.getCertificatesById.certification.certificateDetails;
        certificateImage.setAttribute("src", data.getCertificatesById.certification.image);
        certificateImage.setAttribute("srcset", data.getCertificatesById.certification.image);

        initSaveComponent(
            data.getCertificatesById.certification.id,
            SavedItemType.Course,
            new WFComponent<HTMLAnchorElement>(
                `[xa-type="favouritingIcon"]`
            )
        );
        showData().show();
    });

    certificateReq.onError((err) => {
        navigate(PUBLIC_PATHS.certificates);
    });
    certificateReq.fetch();

}