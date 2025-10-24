import { WFComponent, WFDynamicList, WFFormComponent, navigate, queryType } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminGetAllCertificationsDocument, AdminGetCertificationByIdDocument, AdminUploadMediaDocument, CreateCertificationsDocument, DeleteCertificationDocument, ListMediaDocument, MediaContent, UpdateCertificationDocument } from "../../graphql/graphql";
import { ADMIN_PATHS, S3_BASE_URL } from "../../config";
import dayjs from "dayjs";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import Quill from "quill";
import loadRTCss from "../utils/loadRTCss";
import { removeHTMLTags } from "../utils/removeHtmlTags";

// getSkeletonLoader().show();

export const listCertifications = () => {
    const certListReq = adminQL.query(
        AdminGetAllCertificationsDocument
    );

    const list = new WFDynamicList<
        {
            id: string;
            title: string;
            image: string;
            createdAt: string;
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


    searchForm.onFormSubmit((data) => {
        let listItems = [];
        if (data["search-term"].length) {
            listItems = certListReq
                .data()
                .adminGetAllCertifications.filter(({ title }) => {
                    return `${title}`
                        .toLowerCase()
                        .includes(data["search-term"].toLowerCase());
                });
        } else {
            listItems = certListReq.data().adminGetAllCertifications;
        }
        searchText.getElement().innerHTML = `${listItems.length} Result found`;
        list.setData(listItems);
    });

    createButton.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        createButton.setText("Redirecting...");
        navigate({
            to: `${ADMIN_PATHS.certificationsView}?id=NewCertification`,
            type: "replace",
        });
    });


    list.rowRenderer(({ rowData, rowElement }) => {
        const img = rowElement.getChildAsComponent(
            `[xa-type="certificateThumb"]`
        );
        const link = rowElement.getChildAsComponent(
            `[xa-type="viewCourse"]`
        );

        rowElement.updateTextViaAttrVar({
            certificationName: removeHTMLTags(rowData.title),
            updatedDate: `Last updated: ${ dayjs(rowData.createdAt).format(
                "MM-DD-YYYY") }`
        });

        if (rowData.image.length) {
            img.setAttribute("src", rowData.image);
            img.setAttribute("srcset", rowData.image);
        }
        link.setAttribute(
            "href",
            `${ADMIN_PATHS.certificationsView}?id=${rowData.id}`
        );

        return rowElement;
    });

    certListReq.onData(({ adminGetAllCertifications }) => {
        searchText.getElement().innerHTML = `${adminGetAllCertifications.length} Result found`;
        list.setData(adminGetAllCertifications);
        // getSkeletonLoader().hide();
        showData().show();
    })

    certListReq.fetch();
}

export const createCertification = (data: { id: string }) => {
    loadRTCss();
    const certNavLink = new WFComponent(`[xa-type="certNavLink"]`);
    certNavLink.addCssClass("w--current");
    const deleteCertMenu = new WFComponent(`[xa-type="deleteCertification"]`);
    const pageHeading = new WFComponent(`[xa-type="pageHeading"]`);

    if ("id" in data && data.id == "NewCertification") {
        pageHeading.getElement().innerHTML = "Create Course";
        deleteCertMenu.addCssClass("hide");
        const createCertReq = adminQL.mutation(
            CreateCertificationsDocument
        );
        const certDetailsForm = new WFFormComponent<any>(`[xa-type="cbasicDetails"]`);
        const saveButton = new WFComponent(`[xa-type="saveButton"]`);
        const rtEditor =
            certDetailsForm.getChildAsComponent<HTMLDivElement>(
                "#rt-editor"
            );
        const rtArea =
            certDetailsForm.getChildAsComponent<HTMLInputElement>(
                `[name="certification-desc"]`
            );
        const quillEditor = new Quill(rtEditor.getElement(), {
            modules: {
                toolbar: [
                    [{ header: [2, 3, 4, false] }],
                    ["bold", "italic", "link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
            },
            placeholder: "Enter Certificate description",
            theme: "snow",
        });
        quillEditor.on("text-change", () => {
            rtArea.getElement().value = quillEditor.root.innerHTML;
        });
        const rtEditorTitle =
            certDetailsForm.getChildAsComponent<HTMLDivElement>(
                "#rt-editor-title"
            );
        const rtAreaTitle =
            certDetailsForm.getChildAsComponent<HTMLInputElement>(
                `[name="certification-title"]`
            );
        const quillEditorTitle = new Quill(rtEditorTitle.getElement(), {
            modules: {
                toolbar: [
                    [{ header: [2, 3, 4, false] }],
                    ["bold", "italic", "link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
            },
            placeholder: "Enter Course Title",
            theme: "snow",
        });
        quillEditorTitle.on("text-change", () => {
            rtAreaTitle.getElement().value = quillEditorTitle.root.innerHTML;
        });
        let mediaURL, mediaURLPDF;
        const media = setupMediaManager();
        // const mediaPDF = setupMediaManager();
        const basicMediaField = setupMediaField(
            `[xa-type="media-selection"]`,
            "",
            media
        );
        basicMediaField.onChange((url) => {
            mediaURL = url;
        });
        const basicMediaFieldPDF = setupMediaField(
            `[xa-type="media-selection-pdf"]`,
            "",
            media
        );
        basicMediaFieldPDF.onChange((url) => {
            mediaURLPDF = url;
        });

        createCertReq.onLoadingChange((status) => {
            if (status) { certDetailsForm.disableForm(); }
            else { 
                certDetailsForm.enableForm(); 
                alert("Course created!");
                setTimeout(() => {
                    navigate({
                        to: ADMIN_PATHS.certificationsList,
                        type: "replace",
                    });
                }, 1000);
            }
            saveButton.getElement().setAttribute("value", 
            status ? "Creating.." : "Create");
    });

        createCertReq.onError(() => {
            alert("Failed to create course!");
        });

        certDetailsForm.onFormSubmit((data) => {
            if (mediaURL) {
                createCertReq.fetch({
                    image: mediaURL,
                    title: data["certification-title"],
                    pdf: mediaURLPDF,
                    certificateDetails: data["certification-desc"]
                });
            } else {
                alert("Course Image Not Selected!");
            }
        })
        // getSkeletonLoader().hide();
        showData().show();

    } else if ("id" in data && data.id.length) {
        pageHeading.getElement().innerHTML = "Course Details";
        const updateCertReq = adminQL.mutation(
            UpdateCertificationDocument
        );
        const getCertificationReq = adminQL.query(
            AdminGetCertificationByIdDocument
        );
        const deleteCertReq = adminQL.mutation(
            DeleteCertificationDocument
        );
        const saveButton = new WFComponent(`[xa-type="saveButton"]`);
        const certDetailsForm = new WFFormComponent<any>(`[xa-type="cbasicDetails"]`);
        const certThumbPreview = new WFComponent(`[xa-type="media-preview"]`);
        const mediaSelecionWrap = new WFComponent<HTMLDivElement>(`[xa-type="media-selection"]`);
        const mediaSelecionWrapPDF = new WFComponent<HTMLDivElement>(`[xa-type="media-selection-pdf"]`);
        let mediaURL, mediaFileName, mediaURLPDF, mediaFileNamePDF;
        const media = setupMediaManager();
        const basicMediaField = setupMediaField(
            `[xa-type="media-selection"]`,
            "",
            media
        );
        basicMediaField.onChange((url) => {
            mediaURL = url;
        });
        const basicMediaFieldPDF = setupMediaField(
            `[xa-type="media-selection-pdf"]`,
            "",
            media
        );
        basicMediaFieldPDF.onChange((url) => {
            mediaURLPDF = url;
        });

        getCertificationReq.fetch({ certificationId: data.id }).then((response) => {
            mediaURL = response.adminGetCertificationById.image
            mediaURLPDF = response.adminGetCertificationById.pdf
            mediaFileName = mediaURL.split('/').pop();
            mediaFileNamePDF = mediaURLPDF.split('/').pop();
            certDetailsForm.setFromData({
                "certification-title": response.adminGetCertificationById.title,
                "certification-desc": response.adminGetCertificationById.certificateDetails
            });
            const rtEditor =
            certDetailsForm.getChildAsComponent<HTMLDivElement>(
                "#rt-editor"
            );
            const rtArea =
                certDetailsForm.getChildAsComponent<HTMLInputElement>(
                    `[name="certification-desc"]`
                );
            rtEditor.getElement().innerHTML = response.adminGetCertificationById.certificateDetails;

            const quillEditor = new Quill(rtEditor.getElement(), {
                modules: {
                    toolbar: [
                        [{ header: [2, 3, 4, false] }],
                        ["bold", "italic", "link"],
                        [{ list: "ordered" }, { list: "bullet" }],
                    ],
                },
                placeholder: "Enter Certificate description",
                theme: "snow",
            });
            quillEditor.on("text-change", () => {
                rtArea.getElement().value = quillEditor.root.innerHTML;
            });

            const rtEditorTitle =
            certDetailsForm.getChildAsComponent<HTMLDivElement>(
                "#rt-editor-title"
            );
            const rtAreaTitle =
                certDetailsForm.getChildAsComponent<HTMLInputElement>(
                    `[name="certification-title"]`
                );
            rtEditorTitle.getElement().innerHTML = response.adminGetCertificationById.title;
            const quillEditorTitle = new Quill(rtEditorTitle.getElement(), {
                modules: {
                    toolbar: [
                        [{ header: [2, 3, 4, false] }],
                        ["bold", "italic", "link"],
                        [{ list: "ordered" }, { list: "bullet" }],
                    ],
                },
                placeholder: "Enter Course Title",
                theme: "snow",
            });
            quillEditorTitle.on("text-change", () => {
                rtAreaTitle.getElement().value = quillEditorTitle.root.innerHTML;
            });
            certThumbPreview.setAttribute("src", response.adminGetCertificationById.image);
            certThumbPreview.setAttribute("srcset", response.adminGetCertificationById.image);
            mediaSelecionWrap.updateTextViaAttrVar({
                fileName: mediaFileName
            });
            mediaSelecionWrapPDF.updateTextViaAttrVar({
                fileNamePDF: mediaFileNamePDF
            });
            saveButton.getElement().setAttribute("value", "Update");
            // getSkeletonLoader().hide();
            showData().show();
        });

        updateCertReq.onLoadingChange((status) => {
            if (status) {
                certDetailsForm.disableForm();
            } else {
                certDetailsForm.enableForm();
                alert("Updated the course");
                setTimeout(() => {
                    navigate({
                        to: ADMIN_PATHS.certificationsList,
                        type: "replace",
                    }); 
                }, 1000);
            }
            saveButton.getElement().setAttribute("value", 
            status ? "Updating.." : "Update");
        });

        updateCertReq.onError(() => {
            alert("Failed to update the course!");
        });

        certDetailsForm.onFormSubmit((_data) => {
            if (mediaURL) {
                updateCertReq.fetch({
                    image: mediaURL,
                    pdf: mediaURLPDF,
                    title: _data["certification-title"],
                    certificationId: data.id,
                    certificateDetails: _data["certification-desc"]
                });
            }
        });

        deleteCertMenu.on("click", () => {
            const response = confirm("Are you sure you want to delete the course?");
            if (response) {
                deleteCertReq.fetch({
                    certificationId: data.id
                });
            }
        });

        deleteCertReq.onLoadingChange((status) => {
            if (status) {
                certDetailsForm.disableForm();
                deleteCertMenu.setText("Deleting...");
            } else {
                certDetailsForm.enableForm();
                alert("Course deleted!");
                setTimeout(() => {
                    navigate({
                        to: ADMIN_PATHS.certificationsList,
                        type: "replace",
                    }); 
                }, 1000);
            }
        })

    } else {
        navigate({
            to: ADMIN_PATHS.certificationsList,
            type: "replace",
        });
        return;
    }



}

const setupMediaManager = () => {
    const mediaListReq = adminQL.query(ListMediaDocument);
    const uploadFileReq = adminQL.mutation(
        AdminUploadMediaDocument
    );
    const mediaList = new WFDynamicList<
        {
            id: string;
            size: string;
            publicURL?: string;
            type: string;
            name: string;
            enabled: boolean;
        },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="listmedia"]`, {
        rowSelector: `[xa-type="itemmedia"]`,
    });
    const fileUploadForm = new WFFormComponent(
        `[xa-type="media-upload-form"]`
    );
    const fileUploadInput =
        fileUploadForm.getChildAsComponent(
            `input[type="file"]`
        );
    const fileUploadLabel =
        fileUploadForm.getChildAsComponent("label");
    const mediaSelectBtn = new WFComponent<HTMLAnchorElement>(
        `[xa-type="media-select"]`
    );
    const mediaOpenBtn = new WFComponent<HTMLAnchorElement>(
        `[xa-type="open-media"]`
    );
    const mediaCloseBtn = new WFComponent<HTMLAnchorElement>(
        `[xa-type="media-close"]`
    );

    fileUploadForm.onFormSubmit(() => {
        //do nothing
    });
    uploadFileReq.onLoadingChange((status) => {
        if (status) {
            fileUploadForm.disableForm();
        } else {
            fileUploadForm.enableForm();
        }
        fileUploadLabel.setText(
            status ? "Uploading..." : "Upload"
        );
    });
    uploadFileReq.onError(() => {
        alert("Failed to upload files");
    });
    uploadFileReq.onData((data) => {
        mediaList.setData(data.uploadMedia);
    });
    fileUploadInput.on("change", () => {
        let files: File[] = [];
        if (Array.isArray(fileUploadForm.getFormData().file)) {
            files = [
                ...(fileUploadForm.getFormData().file as any),
            ];
        } else {
            files = [fileUploadForm.getFormData().file as any];
        }

        uploadFileReq.fetch({
            files,
        });
    });
    let selectedMedia: MediaContent = null;

    let _onSelect = (media: MediaContent) => { };
    const _close = () => {
        mediaCloseBtn.getElement().click();
        _onSelect = (media: MediaContent) => { };
    };
    mediaSelectBtn.on("click", (e) => {
        if (selectedMedia) {
            _onSelect(selectedMedia);
            selectedMedia = null as any;
            _close();
        }
    });
    mediaList.rowRenderer(({ rowData, rowElement }) => {
        const image = rowElement.getChildAsComponent("img");
        if (
            !selectedMedia ||
            (selectedMedia && selectedMedia.id !== rowData.id)
        )
            rowElement.removeCssClass("is--active");
        image.setAttribute(
            "src",
            `${S3_BASE_URL}${rowData.publicURL}`
        );
        image.setAttribute(
            "srcset",
            `${S3_BASE_URL}${rowData.publicURL}`
        );
        rowElement.updateTextViaAttrVar({
            fileName: `${rowData.name}`,
        });
        rowElement.on("click", () => {
            selectedMedia = rowData as MediaContent;
            mediaList.forceRender();
        });
        return rowElement;
    });

    mediaListReq.onData((data) => {
        mediaList.setData(data.listMedia);
        fileUploadForm.resetForm();
    });

    mediaListReq.fetch();

    return {
        open: (cb: (media: MediaContent) => void) => {
            mediaOpenBtn.getElement().click();
            _onSelect = cb;
        },
        close: () => {
            _close();
        },
        mediaListReq,
    };
};

const setupMediaField = (
    selector: queryType,
    value: string = "",
    media: ReturnType<typeof setupMediaManager>,
) => {
    const mediaBox = new WFComponent(selector);
    let mediaPreview;
    if (selector === `[xa-type="media-selection-pdf"]`) {
        const mediaInput =
            mediaBox.getChildAsComponent<HTMLInputElement>(
                `[xa-type="mediaPDF"]`
            );
        const openerPDF = mediaBox.getChildAsComponent(
            `[xa-type="media-selector-pdf"]`
        );
        openerPDF.on("click", () => {
            media.open((media) => {
                mediaBox.updateTextViaAttrVar({
                    fileNamePDF: `${media.name}`,
                });
                mediaInput.getElement().value = `${S3_BASE_URL}${media.publicURL}`;
                _onChange(mediaInput.getElement().value);
            });
        });
    } else {
        const mediaInput =
            mediaBox.getChildAsComponent<HTMLInputElement>(
                `[xa-type="media"]`
            );
        const opener = mediaBox.getChildAsComponent(
            `[xa-type="media-selector"]`
        );
        mediaPreview = mediaBox.getChildAsComponent<HTMLImageElement>(
            `[xa-type="media-preview"]`
        );
        opener.on("click", () => {
            media.open((media) => {
                mediaBox.updateTextViaAttrVar({
                    fileName: `${media.name}`,
                });
                mediaPreview.setAttribute(
                    "src",
                    `${S3_BASE_URL}${media.publicURL}`
                );
                mediaPreview.setAttribute(
                    "srcset",
                    `${S3_BASE_URL}${media.publicURL}`
                );
                mediaInput.getElement().value = `${S3_BASE_URL}${media.publicURL}`;
                _onChange(mediaInput.getElement().value);
            });
        });
    }
    let _onChange = (url: string) => { };

    if (value.length) {
        mediaPreview.setAttribute("src", value);
        mediaPreview.setAttribute("srcset", value);
    }

    mediaBox.updateTextViaAttrVar({
        fileName: value.split("/").pop() || "Not Selected",
        fileNamePDF: value.split("/").pop() || "Not Selected",
    });
    return {
        onChange: (cb: (url: string) => void) => {
            _onChange = cb;
        },
    };
};