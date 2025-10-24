import {
  WFComponent,
  WFDynamicList,
  WFFormComponent,
  queryType,
} from "@xatom/core";
import { adminQL } from "../../graphql";
import {
  AdminCreateBlankSlideDocument,
  AdminDeleteSlideDocument,
  AdminGetAllCertificationsDocument,
  AdminGetSlidesDocument,
  AdminUpdateCourseCertificateDetailsDocument,
  AdminUpdateCourseDetailsDocument,
  AdminUpdateCourseLessonsDetailsDocument,
  AdminUpdateCourseStatusDocument,
  AdminUpdateQuizLessonsDetailsDocument,
  AdminUpdateSlideDocument,
  AdminUpdateSuccessDetailsDocument,
  AdminUploadMediaDocument,
  ListMediaDocument,
  MediaContent,
  SlideType,
  Slides,
} from "../../graphql/graphql";
import dayjs from "dayjs";
import loadRTCss from "../utils/loadRTCss";
import Quill from "quill";
import Delta from "quill";
import {
  S3_BASE_URL,
  slideTemplateInputsData,
} from "../../config";
import { Sortable } from "@shopify/draggable";
import { getSkeletonLoader } from "../utils/skeletonLoader";
import { showData } from "../utils/loadData";
import { removeHTMLTags } from "../utils/removeHtmlTags";
import { extractMediaType } from "../utils/mediaType";
import loadCustomSelect from "../utils/Finsweet";

let currentSwipeGroup = 0;
let maxSwipeGroups = 20;

type editableType = {
  label: string;
  key: string;
  type: string;
};

type lessonsMetaDataType = {
  slideName: string;
  img: string;
  key: string;
  component: WFComponent;
  editable: editableType[];
};

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
    
    try{
      // Set basic preview thumbnails
      const basicPreview = new WFComponent(`#basic-details-preview`);
      const basicPreviewOne = basicPreview.getChildAsComponent(`[xa-type="basic-preview-1"]`);
      // const basicPreviewTwo = basicPreview.getChildAsComponent(`[xa-type="basic-preview-2"]`);
      const bPreviewThumb1 = basicPreviewOne.getChildAsComponent(`[xa-type="courseThumbnail"]`);
      // const bPreviewThumb2 = basicPreviewTwo.getChildAsComponent(`[xa-type="courseThumbnail"]`);
  
      bPreviewThumb1.setAttribute("src", `${S3_BASE_URL}${selectedMedia.publicURL.toString()}`);
      bPreviewThumb1.setAttribute("srcset", `${S3_BASE_URL}${selectedMedia.publicURL.toString()}`);
      // bPreviewThumb2.setAttribute("src", `${S3_BASE_URL}${selectedMedia.publicURL.toString()}`);
      // bPreviewThumb2.setAttribute("srcset", `${S3_BASE_URL}${selectedMedia.publicURL.toString()}`);
    } catch (e) {
      console.log(e);
    }
    if (selectedMedia) {
      _onSelect(selectedMedia);
      selectedMedia = null as any;
      _close();
    }
    
  });
  mediaList.rowRenderer(({ rowData, rowElement }) => {
    const image = rowElement.getChildAsComponent("img");
    const imageName = rowElement.getChildAsComponent(`.body-small`);
    if (
      !selectedMedia ||
      (selectedMedia && selectedMedia.id !== rowData.id)
    )
      rowElement.removeCssClass("is--active");
    const mediaType = extractMediaType(rowData.publicURL);
    if (mediaType === 'jpg' || mediaType === 'png' || mediaType === 'webp' || mediaType === 'jpeg') {
      image.setAttribute(
        "src",
        `${S3_BASE_URL}${rowData.publicURL}`
      );
      image.setAttribute(
        "srcset",
        `${S3_BASE_URL}${rowData.publicURL}`
      );
    } else if (mediaType === 'mp4' || mediaType === 'mov' || mediaType === 'webm') {
      image.setAttribute(
        "src",
        `https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6526510a0a74cd0d04f0e0e2_video-placeholder.png`
      );
      image.setAttribute(
        "srcset",
        `https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/6526510a0a74cd0d04f0e0e2_video-placeholder.png`
      );
    } else if (mediaType === 'svg') {
      image.setAttribute(
        "src",
        `https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/652657889b18f9270cf16bad_Placeholder_view_vector.svg.png`
      );
      image.setAttribute(
        "srcset",
        `https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/652657889b18f9270cf16bad_Placeholder_view_vector.svg.png`
      );
    }
    image.getElement().style.pointerEvents = "none";
    rowElement.updateTextViaAttrVar({
      fileName: `${rowData.name}`,
    });
    imageName.getElement().style.pointerEvents = "none";
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
  media: ReturnType<typeof setupMediaManager>
) => {
  const mediaBox = new WFComponent(selector);
  const mediaPreview =
    mediaBox.getChildAsComponent<HTMLImageElement>(
      `[xa-type="media-preview"]`
    );
  const mediaInput =
    mediaBox.getChildAsComponent<HTMLInputElement>(
      `[xa-type="media"]`
    );

  const opener = mediaBox.getChildAsComponent(
    `[xa-type="media-selector"]`
  );
  let _onChange = (url: string) => { };
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

  if (value.length) {
    mediaPreview.setAttribute("src", value);
    mediaPreview.setAttribute("srcset", value);
  }

  mediaBox.updateTextViaAttrVar({
    fileName: value.split("/").pop() || "Not Selected",
  });
  return {
    onChange: (cb: (url: string) => void) => {
      _onChange = cb;
    },
  };
};
const setupVideoMediaField = (
  selector: queryType,
  value: string = "",
  media: ReturnType<typeof setupMediaManager>
) => {
  const mediaBox = new WFComponent(selector);
  const videoPreview =
    mediaBox.getChildAsComponent<HTMLImageElement>(
      `[xa-type="videoSource"]`
    );
  const mediaInput =
    mediaBox.getChildAsComponent<HTMLInputElement>(
      `[xa-type="media"]`
    );

  const opener = mediaBox.getChildAsComponent(
    `[xa-type="media-selector"]`
  );
  let _onChange = (url: string) => { };
  opener.on("click", () => {
    media.open((media) => {
      mediaBox.updateTextViaAttrVar({
        fileName: `${media.name}`,
      });
      videoPreview.setAttribute(
        "src",
        `${S3_BASE_URL}${media.publicURL}`
      );
      videoPreview.setAttribute(
        "srcset",
        `${S3_BASE_URL}${media.publicURL}`
      );
      mediaInput.getElement().value = `${S3_BASE_URL}${media.publicURL}`;
      _onChange(mediaInput.getElement().value);
    });
  });

  if (value.length) {
    videoPreview.setAttribute("src", value);
    videoPreview.setAttribute("srcset", value);
  }

  mediaBox.updateTextViaAttrVar({
    fileName: value.split("/").pop() || "Not Selected",
  });
  return {
    onChange: (cb: (url: string) => void) => {
      _onChange = cb;
    },
  };
};

const setupSlidesMetaData = (
  key = "slide-list-template"
) => {
  const slidesContainer = new WFComponent(
    `[xa-type="${key}"]`
  );
  const slides = slidesContainer.getChildAsComponents(
    `[xa-template-key]`
  );

  const metaData = new Map<string, lessonsMetaDataType>();

  slides.forEach((slide) => {
    const editables =
      slide.getChildAsComponents(`[xa-editable]`);

    metaData.set(slide.getAttribute("xa-template-key"), {
      img: slide.getAttribute("xa-template-img") || "",
      slideName:
        slide.getAttribute("xa-template-name") ||
        slide.getAttribute("xa-template-key"),
      component: slide.getCloneAsComponent(),
      key: slide.getAttribute("xa-template-key"),
      editable: editables.map((editable) => {
        return {
          key: editable.getAttribute("xa-key"),
          label: editable.getAttribute("xa-title"),
          type: editable.getAttribute("xa-editable"),
        };
      }),
    });
  });

  return {
    metaData,
    getConfig: (key: string) => metaData.get(key),
  };
};

const setupFormManager = (
  media: ReturnType<typeof setupMediaManager>,
  config = {
    previewKey: "preview-slide",
    formKey: "lessonDetails",
    mainFormId: "lesson-form",
  }
) => {
  let _slideId = "";
  const slideUpdateReq = adminQL.mutation(
    AdminUpdateSlideDocument
  );
  const previewContainer = new WFComponent(
    `[xa-type="${config.previewKey}"]`
  );
  const form = new WFComponent(
    `[xa-type="${config.formKey}"]`
  );
  const mainForm = new WFFormComponent<any>(
    `#${config.mainFormId}`
  );
  const formDynamicArea = mainForm.getChildAsComponent(
    `[xa-type="dyanamic-fields"]`
  );
  const deleteSlide =
    mainForm.getChildAsComponent<HTMLAnchorElement>(
      `[xa-type="delete-slide"]`
    );
  const textField = form
    .getChildAsComponent(`[xa-field="text"]`)
    .getCloneAsComponent();
  const mcqField = form
    .getChildAsComponent(`[xa-field="mcq"]`)
    .getCloneAsComponent();
  const blanksField = form
    .getChildAsComponent(`[xa-field="blanks"]`)
    .getCloneAsComponent();
  const twoByTwoImgField = form
    .getChildAsComponent(`[xa-field="2by2img"]`)
    .getCloneAsComponent();
  const oneByTwoImgField = form
    .getChildAsComponent(`[xa-field="1by2img"]`)
    .getCloneAsComponent();
  const imageField = form
    .getChildAsComponent(`[xa-field="image"]`)
    .getCloneAsComponent();
  const videoField = form
    .getChildAsComponent(`[xa-field="video"]`)
    .getCloneAsComponent();
  const rtField = form
    .getChildAsComponent(`[xa-field="rt"]`)
    .getCloneAsComponent();
  const numberField = form
    .getChildAsComponent(`[xa-field="number"]`)
    .getCloneAsComponent();
  const swipeGroupField = form.getChildAsComponent(`[xa-field="swipeGroupField"]`).getCloneAsComponent();

  form.getElement().remove();

  const generateSwipeGroupSelector = (
    selectedValue: string
  ) => {
    const input = swipeGroupField.getCloneAsComponent();
    const _input = input.getChildAsComponent<HTMLInputElement>(`[xa-type="swipeGroup"]`);

    if (selectedValue) {
      for (let i = 0; i < maxSwipeGroups; i++) {
        const optionElement = document.createElement("option");
        optionElement.value = i.toString();
        optionElement.text = `Swipe Group ${i + 1}`;
        if (i.toString() === selectedValue.toString()) {
          optionElement.selected = true;
        }
        _input.getElement().appendChild(optionElement);
      }
    }
    return input;
  }

  const generateText = (
    config: editableType,
    value?: string
  ) => {
    const input = textField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );

    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="text"]`
      );
    _input.setAttribute("name", config.key);
    if (value) {
      _input.getElement().value = value;
      previewInput.setText(value);
    }
    _input.on("keyup", () => {
      previewInput.setText(_input.getElement().value);
    });
    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateImage = (
    config: editableType,
    value?: string
  ) => {
    const input = imageField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent<HTMLImageElement>(
        `[xa-key="${config.key}"]`
      );
    const _imageField = setupMediaField(
      input,
      value || "",
      media
    );
    input.updateTextViaAttrVar({
      title: config.label,
    });
    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="hidden"]`
      );
    if (value) {
      _input.getElement().value = value;
      previewInput.setAttribute(
        "src",
        _input.getElement().value
      );
      previewInput.setAttribute(
        "srcset",
        _input.getElement().value
      );
    }
    _imageField.onChange(() => {
      previewInput.setAttribute(
        "src",
        _input.getElement().value
      );
      previewInput.setAttribute(
        "srcset",
        _input.getElement().value
      );
    });

    _input.setAttribute("name", config.key);
    return input;
  };
  const generateVideo = (
    config: editableType,
    value?: string
  ) => {
    const input = videoField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent<HTMLImageElement>(
        `[xa-key="${config.key}"]`
      );
    const _videoField = setupVideoMediaField(
      input,
      value || "",
      media
    );
    input.updateTextViaAttrVar({
      title: config.label,
    });
    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="hidden"]`
      );
    if (value) {
      _input.getElement().value = value;
      previewInput
        .getChildAsComponent("source")
        .setAttribute("src", _input.getElement().value);
      previewInput
        .getChildAsComponent("source")
        .setAttribute("srcset", _input.getElement().value);
    }
    _videoField.onChange(() => {
      previewInput
        .getChildAsComponent("source")
        .setAttribute("src", _input.getElement().value);
      previewInput
        .getChildAsComponent("source")
        .setAttribute("srcset", _input.getElement().value);
    });

    _input.setAttribute("name", config.key);
    return input;
  };
  const generateRT = (
    config: editableType,
    value?: string
  ) => {
    const input = rtField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );
    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="hidden"]`
      );

    _input.setAttribute("name", config.key);
    const rtEditor =
      input.getChildAsComponent<HTMLDivElement>(
        `[xa-type="rt-editor-container"]`
      );

    const rtArea =
      input.getChildAsComponent<HTMLInputElement>(
        `[xa-type="rt-input"]`
      );
    if (value) {
      rtArea.getElement().value = value;
      // rtEditor.getElement().innerHTML = value;
      previewInput.getElement().innerHTML = value;
    }
    const quillEditor = new Quill(rtEditor.getElement(), {
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
      placeholder: "Enter certification highlights",
      theme: "snow",
    });
    quillEditor.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
      // Check if the node is a text node
      if (typeof node.data === 'string') {
        // Modify the delta to add a color attribute
        delta.forEach(function (op) {
          if (op.insert === node.data) {
            // You can apply any other styling you want here
            op.attributes = { color: '#120C80' };
          }
        });
      }
      return delta;
    });
    if (value) {
      quillEditor.root.innerHTML = value;
    }
    quillEditor.on("text-change", () => {
      rtArea.getElement().value =
        quillEditor.root.innerHTML;
      previewInput.getElement().innerHTML =
        quillEditor.root.innerHTML;
    });
    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateRTForBlanks = (
    config: editableType,
    value?: string
  ) => {
    const generateTextForPreview = (html: string) => {
      return html.replace(
        "_____",
        `<span xa-type="blanks-slot" class="blank_answer" style="min-width: 70px;display: inline-block;"></span>`
      );
    };
    const input = rtField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );
    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="hidden"]`
      );

    _input.setAttribute("name", config.key);
    const rtEditor =
      input.getChildAsComponent<HTMLDivElement>(
        `[xa-type="rt-editor-container"]`
      );

    const rtArea =
      input.getChildAsComponent<HTMLInputElement>(
        `[xa-type="rt-input"]`
      );
    if (value) {
      rtArea.getElement().value = value;
      // rtEditor.getElement().innerHTML = value;
      previewInput.getElement().innerHTML =
        generateTextForPreview(value);
    }
    const quillEditor = new Quill(rtEditor.getElement(), {
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
      placeholder: "Enter certification highlights",
      theme: "snow",
    });
    quillEditor.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
      // Check if the node is a text node
      if (typeof node.data === 'string') {
        // Modify the delta to add a color attribute
        delta.forEach(function (op) {
          if (op.insert === node.data) {
            // You can apply any other styling you want here
            op.attributes = { color: '#120C80' };
          }
        });
      }
      return delta;
    });
    if (value) {
      quillEditor.root.innerHTML = value;
    }
    quillEditor.on("text-change", () => {
      rtArea.getElement().value =
        quillEditor.root.innerHTML;
      previewInput.getElement().innerHTML =
        generateTextForPreview(quillEditor.root.innerHTML);
    });
    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateNumber = (
    config: editableType,
    value?: string
  ) => {
    const input = numberField.getCloneAsComponent();
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );
    const _input =
      input.getChildAsComponent<HTMLInputElement>(
        `input[type="number"]`
      );
    _input.setAttribute("name", config.key);
    if (value) {
      _input.getElement().value = value;
      previewInput.setText(value);
    }
    _input.on("keyup", () => {
      previewInput.setText(_input.getElement().value);
    });

    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateUnknown = (config: editableType) => {
    const input = new WFComponent(
      document.createElement("p")
    );
    input.setText(`${config.key} is unknown`);
    return input;
  };
  //quiz
  const generateMCQ = (
    config: editableType,
    value?: any
  ) => {
    const input = mcqField.getCloneAsComponent();
    let items = [];
    if (value && "options" in value) {
      if (Array.isArray(value.options))
        items = [...value.options];
      else items = [value.options];
    }
    const mcqList = new WFDynamicList<
      string,
      HTMLDivElement,
      HTMLDivElement,
      HTMLDivElement
    >(input.getChildAsComponent(`[xa-type="mcq-list"]`), {
      rowSelector: `[xa-type="mcq-item"]`,
    });
    const mcqAddButton = input.getChildAsComponent(
      `[xa-type="add-mcq-item"]`
    );
    const mcqAnswer =
      input.getChildAsComponent<HTMLInputElement>(
        `[xa-type="answer"]`
      );
    mcqAnswer.setAttribute("name", "answer");

    const updateOptions = () => {
      mcqAnswer.getElement().replaceChildren();
      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        mcqAnswer.getElement().appendChild(option);
      });
    };
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );
    const listPreview = new WFDynamicList(previewInput, {
      rowSelector: `[xa-type="mcq-item"]`,
    });
    listPreview.rowRenderer(({ rowData, rowElement }) => {
      const text = rowElement.getChildAsComponent(
        `[xa-type="mcq-text"]`
      );
      if (rowData.toString().includes("oneworld")) {
        const modifiedString = rowData.toString().replace(/oneworld/g, '<strong>one</strong>world');
        text.getElement().innerHTML = modifiedString;
      } else {
        text.setText(rowData as string);
      }
      return rowElement;
    });

    mcqList.rowRenderer(
      ({ rowData, rowElement, index }) => {
        rowElement.updateTextViaAttrVar({
          index: `${index + 1}.`,
        });
        const input =
          rowElement.getChildAsComponent<HTMLInputElement>(
            `input[type="text"]`
          );
        const removeBtn =
          rowElement.getChildAsComponent<HTMLAnchorElement>(
            `[xa-type="remove-mcq-item"]`
          );
        input.setAttribute("name", `options`);
        input.getElement().value = rowData;
        removeBtn.on("click", () => {
          const isYes = confirm(
            "Are you sure wanted to delete option?"
          );
          if (!isYes) {
            return;
          }
          items = items.filter((_, i) => i !== index);
          updateOptions();
          mcqList.setData(items);
          listPreview.setData(items);
        });
        input.on("keyup", () => {
          items[index] = input.getElement().value;
          updateOptions();
          listPreview.setData(items);
        });
        return rowElement;
      }
    );
    mcqList.setData(items);
    listPreview.setData(items);
    updateOptions();
    if (value && "answer" in value) {
      mcqAnswer.getElement().value = value.answer;
    }
    mcqAddButton.on("click", () => {
      items.push(`Untitled ${items.length + 1}`);
      mcqList.setData(items);
      listPreview.setData(items);

      updateOptions();
    });

    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateTwoByTwoImag = (
    config: editableType,
    value?: any
  ) => {
    const input = twoByTwoImgField.getCloneAsComponent();
    const select =
      input.getChildAsComponent<HTMLSelectElement>(
        `select[name="answer"]`
      );

    if (value && "answer" in value) {
      select.getElement().value = value.answer;
    }

    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateOneByTwoImag = (
    config: editableType,
    value?: any
  ) => {
    const input = oneByTwoImgField.getCloneAsComponent();
    const select =
      input.getChildAsComponent<HTMLSelectElement>(
        `select[name="answer"]`
      );

    if (value && "answer" in value) {
      select.getElement().value = value.answer;
    }

    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  const generateBlanks = (
    config: editableType,
    value?: any
  ) => {
    const input = blanksField.getCloneAsComponent();
    let items = [];
    if (value && "options" in value) {
      if (Array.isArray(value.options))
        items = [...value.options];
      else items = [value.options];
    }
    const blanksList = new WFDynamicList<
      string,
      HTMLDivElement,
      HTMLDivElement,
      HTMLDivElement
    >(
      input.getChildAsComponent(`[xa-type="blanks-list"]`),
      {
        rowSelector: `[xa-type="blanks-item"]`,
      }
    );
    const blankAddButton = input.getChildAsComponent(
      `[xa-type="add-blanks-item"]`
    );
    const blankAnswer =
      input.getChildAsComponent<HTMLInputElement>(
        `[xa-type="answer"]`
      );
    blankAnswer.setAttribute("name", "answer");

    const updateOptions = () => {
      blankAnswer.getElement().replaceChildren();
      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        blankAnswer.getElement().appendChild(option);
      });
    };
    const previewInput =
      previewContainer.getChildAsComponent(
        `[xa-key="${config.key}"]`
      );

    const listPreview = new WFDynamicList(
      previewInput.getChildAsComponent(
        `[xa-type="blank-list"]`
      ),
      {
        rowSelector: `[xa-type="blank-item"]`,
      }
    );
    listPreview.rowRenderer(({ rowData, rowElement }) => {
      rowElement.setText(rowData as string);
      rowElement.on("click", () => {
        const blank = previewContainer
          .getElement()
          .querySelector(`[xa-type="blanks-slot"]`);
        blank.replaceChildren();
        blank.appendChild(
          rowElement.getElement().cloneNode(true)
        );
      });
      return rowElement;
    });

    blanksList.rowRenderer(
      ({ rowData, rowElement, index }) => {
        rowElement.updateTextViaAttrVar({
          index: `${index + 1}.`,
        });
        const input =
          rowElement.getChildAsComponent<HTMLInputElement>(
            `input[type="text"]`
          );
        const removeBtn =
          rowElement.getChildAsComponent<HTMLAnchorElement>(
            `[xa-type="remove-blanks-item"]`
          );
        input.setAttribute("name", `options`);
        input.getElement().value = rowData;
        removeBtn.on("click", () => {
          const isYes = confirm(
            "Are you sure wanted to delete option?"
          );
          if (!isYes) {
            return;
          }
          items = items.filter((_, i) => i !== index);
          updateOptions();
          blanksList.setData(items);
          listPreview.setData(items);
        });
        input.on("keyup", () => {
          items[index] = input.getElement().value;
          updateOptions();
          listPreview.setData(items);
        });
        return rowElement;
      }
    );
    blanksList.setData(items);
    listPreview.setData(items);
    updateOptions();
    if (value && "answer" in value) {
      blankAnswer.getElement().value = value.answer;
    }
    blankAddButton.on("click", () => {
      items.push(`Untitled ${items.length + 1}`);
      blanksList.setData(items);
      listPreview.setData(items);

      updateOptions();
    });

    input.updateTextViaAttrVar({
      title: config.label,
    });
    return input;
  };
  let _onSlideUpdate = (slide: any) => { };

  slideUpdateReq.onLoadingChange((status) => {
    if (status) {
      mainForm.disableForm();
    } else {
      mainForm.enableForm();
    }
    mainForm.updateSubmitButtonText(
      status ? "Please wait..." : "Submit"
    );
  });

  slideUpdateReq.onData((data) => {
    currentSwipeGroup = JSON.parse(data.adminUpdateSlide.data).swipeGroupValue;
    _onSlideUpdate(data.adminUpdateSlide);

    // update current swipe group after form submit. 
    const swipeGroupElt = new WFComponent<HTMLInputElement>(`[xa-type="swipeGroup"]`);
    swipeGroupElt.getElement().innerHTML = "";
    for (let i = 0; i < maxSwipeGroups; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i.toString();
      optionElement.text = `Swipe Group ${i + 1}`;
      if (i == currentSwipeGroup) {
        optionElement.selected = true;
      }
      swipeGroupElt.getElement().appendChild(optionElement);
    }
  });
  slideUpdateReq.onError(() => {
    alert("Failed to update slide");
  });

  mainForm.onFormSubmit((data) => {
    if (
      Object.values(data).filter((val: any) => val.length)
        .length === Object.values(data).length &&
      _slideId.length
    ) {
      const filteredData = {};
      Object.keys(data).forEach((key) => {
        if (!key.includes("xa-hidden") && key !== "swipeGroupValue") {
          filteredData[key] = data[key];
        } else if (key === "swipeGroupValue") {
          filteredData[key] = parseInt(data[key]);
        }
      });

      slideUpdateReq.fetch({
        slideId: _slideId,
        data: JSON.stringify(filteredData),
      });
    } else {
      alert("Please fill all details");
    }
  });
  let _deleteSlide = (slideId: string) => { };
  deleteSlide.on("click", () => {
    if (!_slideId) {
      return;
    }
    const isYes = confirm(
      "Are you sure you want to delete?"
    );
    if (isYes) {
      _deleteSlide(_slideId);
    }
  });

  return {
    slideUpdateReq,
    onDeleteSlide: (cb?: (slideId: string) => void) => {
      _deleteSlide = cb;
    },
    onSlideUpdate: (cb: (slide: Slides) => void) => {
      _onSlideUpdate = cb;
    },
    generateFields: (
      slideId: string,
      editables: editableType[],
      values: any,
      slide: WFComponent
    ) => {
      _slideId = slideId;
      formDynamicArea.getElement().replaceChildren();
      previewContainer.getElement().replaceChildren();
      previewContainer
        .getElement()
        .appendChild(slide.getElement());
      const _editables: WFComponent[] = [];
      editables.forEach((editable) => {
        switch (editable.type) {
          case "text":
            _editables.push(
              generateText(editable, values[editable.key])
            );
            break;
          case "image":
            _editables.push(
              generateImage(editable, values[editable.key])
            );
            break;
          case "video":
            _editables.push(
              generateVideo(editable, values[editable.key])
            );
            break;
          case "rt":
            _editables.push(
              generateRT(editable, values[editable.key])
            );
            break;
          case "rt_for_blanks":
            _editables.push(
              generateRTForBlanks(
                editable,
                values[editable.key]
              )
            );
            break;
          case "number":
            _editables.push(
              generateNumber(editable, values[editable.key])
            );
            break;
          case "mcq":
            _editables.push(generateMCQ(editable, values));
            break;
          case "2by2img":
            _editables.push(
              generateTwoByTwoImag(editable, values)
            );
            break;
          case "1by2img":
            _editables.push(
              generateOneByTwoImag(editable, values)
            );
            break;
          case "blanks":
            _editables.push(
              generateBlanks(editable, values)
            );
            break;
          default:
            _editables.push(generateUnknown(editable));
            break;
        }
      });
      _editables.forEach((field) => {
        formDynamicArea
          .getElement()
          .appendChild(field.getElement());
      });

      const selectedSwipeGroup = (values && values.swipeGroupValue) ? values.swipeGroupValue.toString() : "0";

      if (config.mainFormId === 'lesson-form') {
        formDynamicArea.getElement().appendChild(generateSwipeGroupSelector(selectedSwipeGroup || "0").getElement());
      }

      return _editables;
    },
  };
};

const courseManager = (data: {
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
  successTitle?: string;
  successDescription?: string;
  successButtonText?: string;
  certificationId?: string | null;
}) => {
  const courseDetails = data;
  const lessonsStore = new Map<string, Slides>([]);
  const quizStore = new Map<string, Slides>([]);
  let lessonSlides: string[] = JSON.parse(
    courseDetails.lessonsSlides
  );
  let quizSlides: string[] = JSON.parse(
    courseDetails.quizSlides
  );
  loadRTCss();

  const actionBar = new WFComponent(
    ".ad-course__publish-wrap"
  );
  const updateActionBarForNow = () => {
    actionBar.updateTextViaAttrVar({
      updatedDate: `Last updated ${dayjs().format("MM-DD-YYYY hh:mm a")}`,
    });
  };
  const updateActionBarForNowWithStatus = (
    status: string
  ) => {
    actionBar.updateTextViaAttrVar({
      updatedDate: `Last updated ${dayjs().format(
        "MM-DD-YYYY hh:mm a"
      )} (${status})`,
    });
  };

  const media = setupMediaManager();
  const formManager = setupFormManager(media);
  const formManagerQuiz = setupFormManager(media, {
    formKey: "quizDetails",
    mainFormId: "quiz-form",
    previewKey: "preview-slide-quiz",
  });
  const slideMetaData = setupSlidesMetaData();

  const slideMetaDataQuiz = setupSlidesMetaData(
    "quiz-templates"
  );

  const publishButton = new WFComponent<HTMLAnchorElement>(
    `[xa-type="publishbtn"]`
  );
  const courseTabsToggle = new WFComponent(`[xa-type="adcourse-toggle-wrap"]`);
  const courseName = new WFComponent(`[xa-type="course-name"]`);
  const courseClose = new WFComponent(`[xa-type="admin-course-close"]`);
  const basicDetailsToggle = courseTabsToggle.getChildAsComponent(`[xa-type="basic-details-toggle"]`);
  const basicFormReq = adminQL.mutation(
    AdminUpdateCourseDetailsDocument
  );
  const changeCourseStatusReq = adminQL.mutation(
    AdminUpdateCourseStatusDocument
  );
  const certificationFormReq = adminQL.mutation(
    AdminUpdateCourseCertificateDetailsDocument
  );
  const successFormReq = adminQL.mutation(
    AdminUpdateSuccessDetailsDocument
  );
  const blankSlideReq = adminQL.mutation(
    AdminCreateBlankSlideDocument
  );
  const lessonsSlidesReq = adminQL.mutation(
    AdminUpdateCourseLessonsDetailsDocument
  );
  const getLessonsSlideDetails = adminQL.query(
    AdminGetSlidesDocument
  );
  const getQuizSlideDetails = adminQL.query(
    AdminGetSlidesDocument
  );
  const certListReq = adminQL.query(
    AdminGetAllCertificationsDocument
  );
  const removeSlide = adminQL.mutation(
    AdminDeleteSlideDocument
  );
  //Quiz
  const blankSlideQReq = adminQL.mutation(
    AdminCreateBlankSlideDocument
  );
  const lessonsSlidesQReq = adminQL.mutation(
    AdminUpdateQuizLessonsDetailsDocument
  );

  const removeQSlide = adminQL.mutation(
    AdminDeleteSlideDocument
  );

  const slideUpdateReq = adminQL.mutation(
    AdminUpdateSlideDocument
  );

  const rightDetailsArea = new WFComponent(
    `[xa-type="lessons-details-container"]`
  );
  rightDetailsArea.setAttribute("style", "display:none;");
  const rightQDetailsArea = new WFComponent(
    `[xa-type="quiz-details-container"]`
  );
  rightQDetailsArea.setAttribute("style", "display:none;");

  const basicForm = new WFFormComponent<{
    "basic-course-title": string;
    tag: string;
    image: string;
    certification: string;
    "plain-course-title": string;
  }>("#basic-details");
  const basicCertField = basicForm.getChildAsComponent(`[xa-type="certificationSelect"]`);

  //Basic details preview declarations
  const basicPreview = new WFComponent(`#basic-details-preview`);
  const basicPreviewOne = basicPreview.getChildAsComponent(`[xa-type="basic-preview-1"]`);
  // const basicPreviewTwo = basicPreview.getChildAsComponent(`[xa-type="basic-preview-2"]`);
  const bPreviewTag1 = basicPreviewOne.getChildAsComponent(`[xa-type="courseTagPill"]`);
  // const bPreviewTag2 = basicPreviewTwo.getChildAsComponent(`[xa-type="courseTagPill"]`);
  const bPreviewTitle1 = basicPreviewOne.getChildAsComponent(`[xa-type="courseTitle"]`);
  // const bPreviewTitle2 = basicPreviewTwo.getChildAsComponent(`[xa-type="courseTitle"]`);
  const bPreviewThumb1 = basicPreviewOne.getChildAsComponent(`[xa-type="courseThumbnail"]`);
  // const bPreviewThumb2 = basicPreviewTwo.getChildAsComponent(`[xa-type="courseThumbnail"]`);

  //Success details preview declarations
  const successPreview = new WFComponent(`[xa-type="success-preview"]`);
  const successPreviewTitle = successPreview.getChildAsComponent(`[xa-key="heading"]`);
  const successPreviewDesc = successPreview.getChildAsComponent(`[xa-key="description"]`);
  const successPreviewBtn = successPreview.getChildAsComponent(`[xa-type="button"]`);

  //highlight preview declaration
  const highlightPreview = new WFComponent(`[xa-type="highlight-preview"]`);
  const highlightPreviewRT = highlightPreview.getChildAsComponent(`[xa-type="preview-rt"]`);

  const certificateHighlights = new WFFormComponent<{
    "certificates-highlights": string;
  }>("#certificates-highlights");
  const successDetails = new WFFormComponent<{
    successTitle: string;
    successDescription: string;
    successButtonText: string;
  }>("#success-details");
  const slideSelectionModal = new WFComponent(
    "#ad-lessons-popup"
  );
  const slideSelectionModalQuiz = new WFComponent(
    "#ad-quiz-popup"
  );
  const slideSelectionModalOpen =
    slideSelectionModal.getChildAsComponent(
      `[xa-type="open"]`
    );
  const slideSelectionModalQuizOpen =
    slideSelectionModalQuiz.getChildAsComponent(
      `[xa-type="open"]`
    );
  const openSlide = new WFComponent(
    `[xa-type="add-slide-button"]`
  );
  const openSlideQuiz = new WFComponent(
    `[xa-type="add-slide-button-quiz"]`
  );
  openSlide.on("click", () => {
    slideSelectionModalOpen.getElement().click();
  });
  openSlideQuiz.on("click", () => {
    slideSelectionModalQuizOpen.getElement().click();
  });
  const slideSelectionCloseBtn =
    slideSelectionModal.getChildAsComponent(
      ".close-notification__icon"
    );
  const slideSelectionQuizCloseBtn =
    slideSelectionModalQuiz.getChildAsComponent(
      ".close-notification__icon"
    );

  let selectedLesson = "";
  let selectedQuiz = "";

  const updateLessonDetailsForm = () => {
    const metaData = slideMetaData.getConfig(
      lessonsStore.get(selectedLesson).templateKey
    );
    const lessonDetails = lessonsStore.get(selectedLesson);
    const lessonData = lessonDetails.data ? JSON.parse(lessonDetails.data) : {};
    formManager.generateFields(
      lessonDetails.id,
      metaData.editable,
      lessonData,
      metaData.component.getCloneAsComponent()
    );
    currentSwipeGroup = lessonData.swipeGroupValue;
  };
  const updateQuizDetailsForm = () => {
    const metaData = slideMetaDataQuiz.getConfig(
      quizStore.get(selectedQuiz).templateKey
    );
    const quizDetails = quizStore.get(selectedQuiz);
    formManagerQuiz.generateFields(
      quizDetails.id,
      metaData.editable,
      JSON.parse(quizDetails.data || "{}"),
      metaData.component.getCloneAsComponent()
    );
  };
  formManager.onSlideUpdate((slide) => {
    lessonsStore.set(slide.id, slide);
  });
  formManagerQuiz.onSlideUpdate((slide) => {
    quizStore.set(slide.id, slide);
  });

  const updatedSelectedLessons = (
    skipFormUpdate = false
  ) => {
    document
      .querySelectorAll(`[xa-lesson-id]`)
      .forEach((el) => {
        el.classList.remove("active");
      });

    if (
      selectedLesson.length &&
      document.querySelector(
        `[xa-lesson-id="${selectedLesson}"]`
      )
    ) {
      document
        .querySelector(`[xa-lesson-id="${selectedLesson}"]`)
        .classList.add("active");
      if (!skipFormUpdate) updateLessonDetailsForm();
    }
  };
  const updatedSelectedQuiz = (skipFormUpdate = false) => {
    document
      .querySelectorAll(`[xa-quiz-id]`)
      .forEach((el) => {
        el.classList.remove("active");
      });

    if (
      selectedQuiz.length &&
      document.querySelector(
        `[xa-quiz-id="${selectedQuiz}"]`
      )
    ) {
      document
        .querySelector(`[xa-quiz-id="${selectedQuiz}"]`)
        .classList.add("active");
      if (!skipFormUpdate) updateQuizDetailsForm();
    }
  };

  const slideList = new WFDynamicList<
    string,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="slidesList"]`, {
    rowSelector: `[xa-type="slidesItem"]`,
  });
  const slideQList = new WFDynamicList<
    string,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="slidesList-quiz"]`, {
    rowSelector: `[xa-type="slidesItem-quiz"]`,
  });
  slideList.rowRenderer(
    ({ rowData, rowElement, index }) => {
      rowElement.setAttribute("xa-lesson-id", rowData);
      const _lesson = lessonsStore.get(rowData);
      const meta = slideMetaData.getConfig(
        _lesson.templateKey
      );
      rowElement.updateTextViaAttrVar({
        n: `${index + 1}`,
      });
      const image =
        rowElement.getChildAsComponent<HTMLImageElement>(
          `[xa-type="template-image"]`
        );
      image.setAttribute(
        "src",
        meta.img ||
        `${S3_BASE_URL}slide-templates/${_lesson.templateKey}.png`
      );
      image.setAttribute(
        "srcSet",
        meta.img ||
        `${S3_BASE_URL}slide-templates/${_lesson.templateKey}.png`
      );

      image.on("click", () => {
        if (formManager.slideUpdateReq.isLoading()) {
          return;
        }
        selectedLesson = _lesson.id;
        updatedSelectedLessons();
        rightDetailsArea.setAttribute(
          "style",
          "display:block;"
        );
      });
      updatedSelectedLessons(true);
      return rowElement;
    }
  );

  slideQList.rowRenderer(
    ({ rowData, rowElement, index }) => {
      rowElement.setAttribute("xa-quiz-id", rowData);
      const _quiz = quizStore.get(rowData);
      const meta = slideMetaDataQuiz.getConfig(
        _quiz.templateKey
      );
      rowElement.updateTextViaAttrVar({
        n: `${index + 1}`,
      });
      const image =
        rowElement.getChildAsComponent<HTMLImageElement>(
          `[xa-type="template-image"]`
        );
      image.setAttribute(
        "src",
        meta.img ||
        `${S3_BASE_URL}slide-templates/${_quiz.templateKey}.png`
      );
      image.setAttribute(
        "srcSet",
        meta.img ||
        `${S3_BASE_URL}slide-templates/${_quiz.templateKey}.png`
      );

      image.on("click", () => {
        if (formManagerQuiz.slideUpdateReq.isLoading()) {
          return;
        }
        selectedQuiz = _quiz.id;
        updatedSelectedQuiz();
        rightQDetailsArea.setAttribute(
          "style",
          "display:block;"
        );
      });
      updatedSelectedQuiz(true);
      return rowElement;
    }
  );
  getLessonsSlideDetails.onError(() => {
    alert("Failed to fetch slide details");
  });
  getLessonsSlideDetails.onData((data) => {
    // let filteredSlideData = {};

    data.adminGetSlides.forEach((data) => {
      lessonsStore.set(data.id, data);
    });

    lessonsStore.forEach((value) => {
      const swipeGroupId = value.data ? JSON.parse(value.data).swipeGroupValue : currentSwipeGroup;
      if (swipeGroupId > maxSwipeGroups) {
        maxSwipeGroups = swipeGroupId;
      }
    });

    // filter slides based on swipegroup
    [...lessonsStore.values()].forEach(entry => {
      if (entry && entry.data) {
        const data = JSON.parse(entry.data);
        const swipeGroupValue = data.swipeGroupValue;
      }
    });

    slideList.setData(lessonSlides);
    if (lessonSlides && lessonSlides.length) {
      selectedLesson = lessonSlides[0];
      updatedSelectedLessons();
      rightDetailsArea.setAttribute(
        "style",
        "display:block;"
      );
    }
  });
  getQuizSlideDetails.onError(() => {
    alert("Failed to fetch slide details");
  });
  getQuizSlideDetails.onData((data) => {
    data.adminGetSlides.forEach((data) => {
      quizStore.set(data.id, data);
    });
    slideQList.setData(quizSlides);
    if (quizSlides && quizSlides.length) {
      selectedQuiz = quizSlides[0];
      updatedSelectedQuiz();
      rightQDetailsArea.setAttribute(
        "style",
        "display:block;"
      );
    }
  });
  if (lessonSlides.length) {
    getLessonsSlideDetails.fetch({
      slidesIds: lessonSlides,
    });
  } else {
    slideList.setData([]);
  }
  if (quizSlides.length) {
    getQuizSlideDetails.fetch({
      slidesIds: quizSlides,
    });
  } else {
    slideQList.setData([]);
  }
  const sortable = new Sortable(slideList.getElement(), {
    draggable: `[xa-type="slidesItem"]`,
    mirror: {
      appendTo: slideList.getElement(),
      constrainDimensions: true,
    },
    delay: 200
  });
  const sortableQ = new Sortable(slideQList.getElement(), {
    draggable: `[xa-type="slidesItem-quiz"]`,
    mirror: {
      appendTo: slideQList.getElement(),
      constrainDimensions: true,
    },
    delay: 200
  });
  sortable.on("sortable:stop", (e) => {
    const { newIndex, oldIndex } = e;
    const next = [...lessonSlides];
    const moved = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved[0]);
    if (
      JSON.stringify(lessonSlides) ===
      JSON.stringify([...next])
    ) {
      return;
    }
    lessonSlides = [...next];
    let draggedSlideData = lessonsStore.get(lessonSlides[newIndex]);
    let updatedData;
    if (newIndex >= 1) {
      const previousSlideData = lessonsStore.get(lessonSlides[newIndex - 1]);
      updatedData = JSON.parse(draggedSlideData.data);
      updatedData.swipeGroupValue = JSON.parse(previousSlideData.data).swipeGroupValue;
    } else {
      updatedData = JSON.parse(draggedSlideData.data);
      updatedData.swipeGroupValue = 0;
    }
    lessonsSlidesReq.fetch({
      lessonId: courseDetails.id,
      lessons: JSON.stringify(lessonSlides),
    });
    slideUpdateReq.fetch({
      slideId: draggedSlideData.id,
      data: JSON.stringify(updatedData),
    });
    updateActionBarForNowWithStatus("Saving...");
    setTimeout(() => {
      slideList.setData(lessonSlides);
    }, 10);
    updatedSelectedLessons(true);
  });
  slideUpdateReq.onData((data) => {
    lessonsStore.set(data.adminUpdateSlide.id, data.adminUpdateSlide);
    currentSwipeGroup = JSON.parse(data.adminUpdateSlide.data).swipeGroupValue;
    const swipeGroupElt = new WFComponent<HTMLInputElement>(`[xa-type="swipeGroup"]`);
    swipeGroupElt.getElement().innerHTML = "";
    for (let i = 0; i < maxSwipeGroups; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i.toString();
      optionElement.text = `Swipe Group ${i + 1}`;
      if (i == currentSwipeGroup) {
        optionElement.selected = true;
      }
      swipeGroupElt.getElement().appendChild(optionElement);
    }
  });
  sortableQ.on("sortable:stop", (e) => {
    const { newIndex, oldIndex } = e;
    const next = [...quizSlides];
    const moved = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved[0]);
    if (
      JSON.stringify(quizSlides) ===
      JSON.stringify([...next])
    ) {
      return;
    }
    quizSlides = [...next];
    lessonsSlidesQReq.fetch({
      lessonId: courseDetails.id,
      quizes: JSON.stringify(quizSlides),
    });
    updateActionBarForNowWithStatus("Saving...");
    setTimeout(() => {
      slideQList.setData(quizSlides);
    }, 10);
    updatedSelectedQuiz(true);
  });

  // Lessons Tab

  //slide add
  const slideTemplateSelectBtn =
    new WFComponent<HTMLAnchorElement>(
      `[xa-type="slideTemplateSelect"]`
    );
  const slideTemplateSelectQuizBtn =
    new WFComponent<HTMLAnchorElement>(
      `[xa-type="slideTemplateSelectQuiz"]`
    );

  blankSlideReq.onError(() => {
    alert("Failed to load slide template");
    slideTemplateSelectBtn.setText("Select");
  });
  blankSlideQReq.onError(() => {
    alert("Failed to load slide template");
    slideTemplateSelectQuizBtn.setText("Select");
  });
  lessonsSlidesReq.onError(() => {
    alert("Failed to update lessons");
    slideTemplateSelectBtn.setText("Select");
  });
  lessonsSlidesQReq.onError(() => {
    alert("Failed to update lessons");
    slideTemplateSelectQuizBtn.setText("Select");
  });
  lessonsSlidesReq.onData((data) => {
    slideSelectionCloseBtn.getElement().click();
    slideTemplateSelectBtn.setText("Select");
    updateActionBarForNow();
  });
  lessonsSlidesQReq.onData((data) => {
    slideSelectionQuizCloseBtn.getElement().click();
    slideTemplateSelectQuizBtn.setText("Select");
    updateActionBarForNow();
  });
  blankSlideReq.onData((data) => {
    lessonsStore.set(
      data.adminCreateBlankSlide.id,
      data.adminCreateBlankSlide
    );

    lessonSlides.push(data.adminCreateBlankSlide.id);
    slideList.setData(lessonSlides);
    lessonsSlidesReq.fetch({
      lessonId: courseDetails.id,
      lessons: JSON.stringify(lessonSlides),
    });
    if (formManager.slideUpdateReq.isLoading()) {
      return;
    }
    selectedLesson = data.adminCreateBlankSlide.id;
    updatedSelectedLessons();
    rightDetailsArea.setAttribute(
      "style",
      "display:block;"
    );
  });
  blankSlideQReq.onData((data) => {
    quizStore.set(
      data.adminCreateBlankSlide.id,
      data.adminCreateBlankSlide
    );

    quizSlides.push(data.adminCreateBlankSlide.id);
    slideQList.setData(quizSlides);
    lessonsSlidesQReq.fetch({
      lessonId: courseDetails.id,
      quizes: JSON.stringify(quizSlides),
    });
    if (formManagerQuiz.slideUpdateReq.isLoading()) {
      return;
    }
    selectedQuiz = data.adminCreateBlankSlide.id;
    updatedSelectedQuiz();
    rightQDetailsArea.setAttribute(
      "style",
      "display:block;"
    );
  });

  formManager.onDeleteSlide((slideId) => {
    const newSlides = lessonSlides.filter(
      (d) => d !== slideId
    );
    lessonSlides = [...newSlides];
    lessonsSlidesReq.fetch({
      lessonId: courseDetails.id,
      lessons: JSON.stringify(lessonSlides),
    });
    slideList.setData(lessonSlides);
    selectedLesson = newSlides[newSlides.length - 1];
    updatedSelectedLessons();
    updateActionBarForNow();
    removeSlide.fetch({
      lessonId: courseDetails.id,
      slideId: slideId,
    });
  });

  formManagerQuiz.onDeleteSlide((slideId) => {
    const newSlides = quizSlides.filter(
      (d) => d !== slideId
    );
    quizSlides = [...newSlides];
    lessonsSlidesQReq.fetch({
      lessonId: courseDetails.id,
      quizes: JSON.stringify(quizSlides),
    });
    slideQList.setData(quizSlides);
    selectedQuiz = newSlides[newSlides.length - 1];
    updatedSelectedQuiz();
    updateActionBarForNow();
    removeQSlide.fetch({
      lessonId: courseDetails.id,
      slideId: slideId,
    });
  });

  slideTemplateSelectBtn.on("click", () => {
    if (
      blankSlideReq.isLoading() ||
      lessonsSlidesReq.isLoading()
    ) {
      return;
    }

    let maxSwipeGroup: number = 0;
    let lessonsArray = Array.from(lessonsStore.values());
    lessonsArray.forEach((lesson) => {
      const data = JSON.parse(lesson.data);
      if (data.swipeGroupValue && data.swipeGroupValue > maxSwipeGroup) {
        maxSwipeGroup = data.swipeGroupValue;
      }
    });

    blankSlideReq.fetch({
      lessonId: courseDetails.id,
      templateKey: selectedTemplate,
      type: SlideType.Lessons,
      swipeGroupValue: maxSwipeGroup
    });
    slideTemplateSelectBtn.setText("Adding...");
  });
  slideTemplateSelectQuizBtn.on("click", () => {
    if (
      blankSlideQReq.isLoading() ||
      lessonsSlidesQReq.isLoading()
    ) {
      return;
    }

    blankSlideQReq.fetch({
      lessonId: courseDetails.id,
      templateKey: selectedTemplateQuiz,
      type: SlideType.Quiz,
      swipeGroupValue: 0
    });
    slideTemplateSelectQuizBtn.setText("Adding...");
  });

  const slideTemplateInputList = new WFDynamicList<
    lessonsMetaDataType,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="slideTemplateList"]`, {
    rowSelector: `[xa-type="slideTemplateItem"]`,
  });
  const slideTemplateInputListQuiz = new WFDynamicList<
    lessonsMetaDataType,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="slideTemplateListQuiz"]`, {
    rowSelector: `[xa-type="slideTemplateItemQuiz"]`,
  });

  let selectedTemplate = "intro";
  let selectedTemplateQuiz = "mcqQuiz";

  slideTemplateInputList.rowRenderer(
    ({ rowData, rowElement }) => {
      rowElement.updateTextViaAttrVar({
        slideName: rowData.slideName,
      });
      const image = rowElement.getChildAsComponent("img");

      image.setAttribute(
        "src",
        rowData.img ||
        `${S3_BASE_URL}slide-templates/${rowData.key}.png`
      );
      image.setAttribute(
        "srcSet",
        rowData.img ||
        `${S3_BASE_URL}slide-templates/${rowData.key}.png`
      );
      if (selectedTemplate !== rowData.key) {
        rowElement.removeCssClass("is--active");
      } else {
        rowElement.addCssClass("is--active");
      }
      rowElement.on("click", () => {
        selectedTemplate = rowData.key;
        slideTemplateInputList.forceRender();
      });
      return rowElement;
    }
  );
  slideTemplateInputListQuiz.rowRenderer(
    ({ rowData, rowElement }) => {
      rowElement.updateTextViaAttrVar({
        slideName: rowData.slideName,
      });
      const image = rowElement.getChildAsComponent("img");

      image.setAttribute(
        "src",
        rowData.img ||
        `${S3_BASE_URL}slide-templates/${rowData.key}.png`
      );
      image.setAttribute(
        "srcSet",
        rowData.img ||
        `${S3_BASE_URL}slide-templates/${rowData.key}.png`
      );
      if (selectedTemplateQuiz !== rowData.key) {
        rowElement.removeCssClass("is--active");
      } else {
        rowElement.addCssClass("is--active");
      }
      rowElement.on("click", () => {
        selectedTemplateQuiz = rowData.key;
        slideTemplateInputListQuiz.forceRender();
      });
      return rowElement;
    }
  );

  slideTemplateInputList.setData(
    Array.from(slideMetaData.metaData.values())
  );
  slideTemplateInputListQuiz.setData(
    Array.from(slideMetaDataQuiz.metaData.values())
  );

  const rtEditor =
    certificateHighlights.getChildAsComponent<HTMLDivElement>(
      "#rt-editor"
    );
  const rtArea =
    certificateHighlights.getChildAsComponent<HTMLInputElement>(
      `[name="certificates-highlights"]`
    );

  /* Bind select input options */

  certListReq.fetch().then((_data) => {
    const ids = [], titles = [];

    _data.adminGetAllCertifications.forEach(certification => {
      const optionElement = document.createElement("option");
      optionElement.value = certification.id;
      optionElement.text = removeHTMLTags(certification.title)
      if (data.certificationId && data.certificationId === certification.id) {
        optionElement.selected = true;
      }

      loadCustomSelect();
      // getSkeletonLoader().hide();
      showData().show();
      publishButton.removeCssClass("is--disabled");
      Array.from(courseTabsToggle.getElement().children).
      forEach(button => {
        button.style.pointerEvents = "auto"
        button.classList.remove("is--disabled");
      });
      courseClose.removeCssClass("is--disabled");
      basicDetailsToggle.getElement().click();
      publishButton.getElement().style.pointerEvents = "auto";
      basicCertField.getElement().appendChild(optionElement);
    })
  });

  const basicTitleRTEditor =
    basicForm.getChildAsComponent<HTMLDivElement>(
      "#title-rt-editor"
    );
  const basicTitleRtArea =
    basicForm.getChildAsComponent<HTMLInputElement>(
      `[name="basic-course-title"]`
    );
  const plainCourseTitleInput =
    basicForm.getChildAsComponent<HTMLInputElement>(
      `[name="plain-course-title"]`
    )
    
  courseName.getElement().innerHTML = `${courseDetails.title}`;
  basicForm.setFromData({
    image: courseDetails.image,
    tag: courseDetails.tag,
    "basic-course-title": courseDetails.title,
    certification: data.certificationId,
    "plain-course-title": removeHTMLTags(courseDetails.title)
  });


  // Set basic preview onload 
  bPreviewThumb1.setAttribute("src", courseDetails.image ? courseDetails.image : 'https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/652657889b18f9270cf16bad_Placeholder_view_vector.svg.png');
  bPreviewThumb1.setAttribute("srcset", courseDetails.image ? courseDetails.image : 'https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/652657889b18f9270cf16bad_Placeholder_view_vector.svg.png');
  
  bPreviewTag1.getElement().innerHTML = courseDetails.tag ? courseDetails.tag : 'TAG';
  
  bPreviewTitle1.getElement().innerHTML = courseDetails.title ? courseDetails.title : 'Course Title';
  


  basicTitleRTEditor.getElement().innerHTML = courseDetails.title;

  const btitleQuillEditor = new Quill(basicTitleRTEditor.getElement(), {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "italic", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    placeholder: "Enter course title",
    theme: "snow",
  });
  btitleQuillEditor.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
    // Check if the node is a text node
    if (typeof node.data === 'string') {
      // Modify the delta to add a color attribute
      delta.forEach(function (op) {
        if (op.insert === node.data) {
          // You can apply any other styling you want here
          op.attributes = { color: '#120C80' };
        }
      });
    }
    return delta;
  });
  btitleQuillEditor.on("text-change", () => {
    basicTitleRtArea.getElement().value = btitleQuillEditor.root.innerHTML;
    plainCourseTitleInput.getElement().value = removeHTMLTags(btitleQuillEditor.root.innerHTML);
  });

  certificateHighlights.setFromData({
    "certificates-highlights":
      courseDetails.certificationDetails,
  });

  //TODO: set course highlight preview
  highlightPreviewRT.getElement().innerHTML = courseDetails.certificationDetails;

  certificateHighlights.on("input", (data) => {
    highlightPreviewRT.getElement().innerHTML = data.srcElement.innerHTML;
  });

  rtEditor.getElement().innerHTML =
    courseDetails.certificationDetails;

  const quillEditor = new Quill(rtEditor.getElement(), {
    modules: {
      toolbar: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    placeholder: "Enter certification highlights",
    theme: "snow",
  });
  quillEditor.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
    // Check if the node is a text node
    if (typeof node.data === 'string') {
      // Modify the delta to add a color attribute
      delta.forEach(function (op) {
        if (op.insert === node.data) {
          // You can apply any other styling you want here
          op.attributes = { color: '#120C80' };
        }
      });
    }
    return delta;
  });
  quillEditor.on("text-change", () => {
    rtArea.getElement().value = quillEditor.root.innerHTML;
  });

  const rtEditorSuccess =
    successDetails.getChildAsComponent<HTMLDivElement>(
      "#success-rt-editor"
    );
  const rtAreaSuccess =
    successDetails.getChildAsComponent<HTMLInputElement>(
      `[name="successDescription"]`
    );

  successDetails.setFromData({
    successDescription: courseDetails.successDescription,
    successTitle: courseDetails.successTitle,
    successButtonText: courseDetails.successButtonText,
  });
  rtEditorSuccess.getElement().innerHTML =
    courseDetails.successDescription;

  successPreviewTitle.getElement().innerHTML = courseDetails.successTitle ? courseDetails.successTitle : 'Some encouraging title';
  successPreviewBtn.getElement().innerHTML = courseDetails.successButtonText ? courseDetails.successButtonText : 'Collect Certificate';
  successPreviewDesc.getElement().innerHTML = courseDetails.successDescription ? courseDetails.successDescription : 'Some description';

  const quillEditorSuccess = new Quill(
    rtEditorSuccess.getElement(),
    {
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
      placeholder: "Enter Success Description",
      theme: "snow",
    }
  );
  quillEditorSuccess.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
    // Check if the node is a text node
    if (typeof node.data === 'string') {
      // Modify the delta to add a color attribute
      delta.forEach(function (op) {
        if (op.insert === node.data) {
          // You can apply any other styling you want here
          op.attributes = { color: '#120C80' };
        }
      });
    }
    return delta;
  });
  quillEditorSuccess.on("text-change", () => {
    rtAreaSuccess.getElement().value =
      quillEditorSuccess.root.innerHTML;
  });

  actionBar.updateTextViaAttrVar({
    updatedDate: `Last updated ${dayjs(courseDetails.updatedAt).format(
      "MM-DD-YYYY hh:mm a"
    )}`,
  });

  basicFormReq.onError(() => {
    basicForm.showErrorState();
  });
  certificationFormReq.onError(() => {
    certificateHighlights.showErrorState();
  });
  successFormReq.onError(() => {
    successDetails.showErrorState();
  });

  basicFormReq.onLoadingChange((status) => {
    if (status) {
      basicForm.disableForm();
    } else {
      basicForm.enableForm();
    }
    basicForm.updateSubmitButtonText(
      status ? "Saving..." : "Save"
    );
  });
  certificationFormReq.onLoadingChange((status) => {
    if (status) {
      certificateHighlights.disableForm();
    } else {
      certificateHighlights.enableForm();
    }
    certificateHighlights.updateSubmitButtonText(
      status ? "Saving..." : "Save"
    );
  });

  successFormReq.onLoadingChange((status) => {
    if (status) {
      successDetails.disableForm();
    } else {
      successDetails.enableForm();
    }
    successDetails.updateSubmitButtonText(
      status ? "Saving..." : "Save"
    );
  });

  basicFormReq.onData(() => {
    updateActionBarForNow();
    setTimeout(() => {
      basicForm.updateSubmitButtonText("Saved");

      setTimeout(() => {
        basicForm.updateSubmitButtonText("Save");
      }, 1000);
    }, 100);
  });
  certificationFormReq.onData(() => {
    updateActionBarForNow();
    setTimeout(() => {
      certificateHighlights.updateSubmitButtonText("Saved");

      setTimeout(() => {
        certificateHighlights.updateSubmitButtonText(
          "Save"
        );
      }, 1000);
    }, 100);
  });

  successFormReq.onData(() => {
    updateActionBarForNow();
    setTimeout(() => {
      successDetails.updateSubmitButtonText("Saved");

      setTimeout(() => {
        successDetails.updateSubmitButtonText("Save");
      }, 1000);
    }, 100);
  });


  basicForm.on("input", (data: any) => {
    if (data.target.name === 'tag') {
      bPreviewTag1.getElement().innerHTML = data.target.value;
    } else if (!data.target.name) {
      bPreviewTitle1.getElement().innerHTML = data.srcElement.innerHTML;
    }
  })

  successDetails.on("input", (data: any) => {
    if (data.target.name === 'successTitle') {
      successPreviewTitle.getElement().innerHTML = data.target.value;
    } else if (data.target.name === 'successButtonText') {
      successPreviewBtn.getElement().innerHTML = data.target.value;
    } else {
      successPreviewDesc.getElement().innerHTML = data.target.innerHTML;
    }
  });

  basicForm.onFormSubmit((basicData) => {
    basicForm.showForm();
    if (basicData.certification !== "notSelected") {
      basicFormReq.fetch({
        lessonId: courseDetails.id,
        image: basicData.image,
        tag: basicData.tag,
        title: basicData["basic-course-title"],
        certificationId: basicData.certification,
        plainTitle: basicData["plain-course-title"]
      });
    } else {
      alert("Please select a certification for this course!");
    }
  });
  certificateHighlights.onFormSubmit((certification) => {
    certificateHighlights.showForm();
    certificationFormReq.fetch({
      lessonId: courseDetails.id,
      certificationDetails:
        certification["certificates-highlights"],
    });
  });

  successDetails.onFormSubmit((successDetailsData) => {
    successDetails.showForm();
    successFormReq.fetch({
      lessonId: courseDetails.id,
      successTitle: successDetailsData.successTitle,
      successDescription:
        successDetailsData.successDescription,
      successButtonText:
        successDetailsData.successButtonText,
    });
  });
  const basicMediaField = setupMediaField(
    `[xa-type="media-selection"]`,
    courseDetails.image || "",
    media
  );
  let publishStatus = courseDetails.enabled;
  const updateStatusText = () => {
    if (publishStatus) {
      publishButton.setText("Unpublish");
    } else {
      publishButton.setText("Publish");
    }
  };
  changeCourseStatusReq.onLoadingChange((status) => {
    if (status) {
      publishButton.setText("Please wait...");
    } else {
      updateStatusText();
    }
  });
  changeCourseStatusReq.onError(() => {
    alert("Failed to update status");
    updateStatusText();
  });
  changeCourseStatusReq.onData(() => {
    updateStatusText();
  });
  publishButton.on("click", () => {
    if (changeCourseStatusReq.isLoading()) {
      return;
    }
    if (!publishStatus) {
      if (
        basicForm.formComponent
          .getElement()
          .checkValidity() &&
        certificateHighlights.formComponent
          .getElement()
          .checkValidity() &&
        successDetails.formComponent
          .getElement()
          .checkValidity()
      ) {
        const isPendingLessons = lessonSlides
          .map((d) => lessonsStore.get(d))
          .filter((d) => d.data.length === 0);
        const isPendingQuiz = quizSlides
          .map((d) => quizStore.get(d))
          .filter((d) => d.data.length === 0);
        if (isPendingLessons.length === 0) {
          if (isPendingQuiz.length === 0) {
            changeCourseStatusReq.fetch({
              lessonId: courseDetails.id,
              status: !publishStatus,
            });
            publishStatus = !publishStatus;
          } else {
            alert(
              "Please enter fill all details on quiz tab"
            );
          }
        } else {
          alert(
            "Please enter fill all details on lessons tab"
          );
        }
      } else {
        alert("Please enter complete details");
      }
    } else {
      changeCourseStatusReq.fetch({
        lessonId: courseDetails.id,
        status: !publishStatus,
      });
      publishStatus = !publishStatus;
    }
  });
  updateStatusText();

};

export default courseManager;
