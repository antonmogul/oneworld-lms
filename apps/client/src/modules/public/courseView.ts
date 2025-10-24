import {
  WFComponent,
  WFDynamicList,
  navigate,
} from "@xatom/core";
import { publicQL } from "../../graphql";
import {
  CreateCertificateDocument,
  GetLessonProgressDocument,
  GetLessonSlidesDocument,
  GetQuizSlidesDocument,
  PublicGetAllCertificationsDocument,
  SavedItemType,
  Slides,
  UpdateLessonProgressDocument,
} from "../../graphql/graphql";
import getLoader from "../utils/getLoader";
import { ENVIRONMENT, PUBLIC_PATHS } from "../../config";
import { initSaveComponent } from "../utils/savedItemStore";

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

let certificateId = null, nextLessonId = null;
let navLoader;

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

//possible urls
//https://oneworld-lms-v3.webflow.io/user/dashboard/course-view?id=64ad08989993a967084baade&slideId=64afebc8d0ab70f54633c081
//https://oneworld-lms-v3.webflow.io/user/dashboard/course-view?id=64ad08989993a967084baade&preview=true
//https://oneworld-lms-v3.webflow.io/user/dashboard/course-view?id=64ad08989993a967084baade

export const courseViewPage = ({
  id,
  preview,
  slideId,
}: {
  id: string;
  preview?: string;
  slideId?: string;
}) => {
  setLanguageSelector();
  navLoader = new WFComponent(`.lesson_navigation__loader-wrap`);
  const closeBtn = new WFComponent(`[xa-type="close-btn"]`);
  const isPreview = preview ? true : false;
  const resumeSlideId = slideId || "";
  const lessonId = id;
  const getLessonSlidesReq = publicQL.query(
    GetLessonSlidesDocument
  );
  const getQuizSlidesReq = publicQL.query(
    GetQuizSlidesDocument
  );
  const getCourseProgressReq = publicQL.query(
    GetLessonProgressDocument
  );
  const getAllCertificationsReq = publicQL.query(
    PublicGetAllCertificationsDocument
  )
  const successHeading = new WFComponent(
    `[xa-type="successHeading"]`
  );
  const successDesc = new WFComponent(
    `[xa-type="successDesc"]`
  );
  const successBtnText = new WFComponent(
    `[xa-type="successBtnText"]`
  );

  getCourseProgressReq.onData((progressData) => {
    getLessonSlidesReq.onData((lessonSlidesData) => {
      getQuizSlidesReq.fetch({
        lessonId,
      });
      getQuizSlidesReq.onData((quizSlidesData) => {
        getAllCertificationsReq.onData((certificationData) => {
          const currentCertificationData = certificationData.publicGetAllCertifications.find(c => !!c.lesson.find(l => l.id === lessonId));
          closeBtn.on("click", () => {
            navigate(`${PUBLIC_PATHS.courseDetails}?id=${currentCertificationData.id}`);
          });
          const allSlidesData = [
            ...lessonSlidesData.getLessonSlides,
            ...quizSlidesData.getQuizSlides,
          ];
          setLessons(
            allSlidesData,
            progressData.getLessonProgress.id,
            progressData.getLessonProgress.progress,
            lessonId,
            lessonSlidesData.getLessonSlides,
            quizSlidesData.getQuizSlides,
            isPreview,
            resumeSlideId,
            currentCertificationData
          );
          successHeading.setText(
            progressData.getLessonProgress.lesson.successTitle
          );
          successDesc.getElement().innerHTML =
            progressData.getLessonProgress.lesson.successDescription;
          const totalLessons = currentCertificationData.lesson.filter(l => l.enabled).length;
          const completedLessons = currentCertificationData.lesson.filter(l => l.enabled && l.lessonProgress[0] && l.lessonProgress[0].completed).length;
          const incompleteLessons = currentCertificationData.lesson.filter(l => l.lessonProgress[0] && l.lessonProgress[0].progress >= 0 && (!l.lessonProgress[0].completed));
          const notStartedLessons = currentCertificationData.lesson.filter(l => l && (!l.lessonProgress[0]));
          if ((completedLessons + 1) !== totalLessons) {
            successBtnText.setText("Next Lesson");
            nextLessonId = notStartedLessons && notStartedLessons.length ? notStartedLessons[0].id : incompleteLessons[0].id;
          }
        })
        getAllCertificationsReq.fetch();
      });
    });
    getLessonSlidesReq.fetch({
      lessonId,
    });
  });

  getCourseProgressReq.fetch({
    lessonId,
  });
};

function setLessons(
  lessonSlidesData: Slides[],
  progressDataId: string,
  progressSlide: number,
  lessonId: string,
  lessonSlides: Slides[],
  quizSlides: Slides[],
  isPreview: boolean,
  resumeSlideId: string,
  currentCertificationData: any
) {
  const errorTiggerButton = new WFComponent(
    `[xa-type="quizWrongTrigger"]`
  );
  const errorContinueBtn = new WFComponent(
    `[xa-type="quizWrongBtn"]`
  );
  const endTriggerButton = new WFComponent(
    `[xa-type="endQuizBtn"]`
  );
  const completeTrigger = new WFComponent(
    `#courseCompleteTrigger`
  );
  const bottomNav = new WFComponent(
    `.lessons-navigation__wrapper`
  );
  const prevBtn = bottomNav.getChildAsComponent("#prev");
  const nextBtn = bottomNav.getChildAsComponent("#next");
  const nextBtnForQuiz = bottomNav.getChildAsComponent(
    `[xa-type="quizContinueBtn"]`
  );
  const lessonsMetaData = setupSlidesMetaData();
  const quizMetaData = setupSlidesMetaData(
    "quiz-templates"
  );

  let isProgressReqProcessing = false;
  const updateCourseProgressReq = publicQL.mutation(
    UpdateLessonProgressDocument
  );

  updateCourseProgressReq.onData(() => {
    isProgressReqProcessing = false;
    // nextBtn.setAttribute("style", "display: flex; pointer-events: auto;");
    // prevBtn.setAttribute("style", "display: flex; pointer-events: auto");
    // navLoader.setAttribute("style", "display: none");
    showQuizMode();
  });
  const createCertificateReq = publicQL.mutation(
    CreateCertificateDocument
  );

  let latestSlideProgress = progressSlide;
  let _currentQuizAnswer = "";

  // Constructing stack & slide data.
  let filteredSlideData = {};
  lessonSlides.forEach((lesson) => {
    if (lesson && lesson.data) {
      const data = JSON.parse(lesson.data);
      const swipeGroupValue = data.swipeGroupValue;
      if (!filteredSlideData[swipeGroupValue]) {
        filteredSlideData[swipeGroupValue] = [];
      }

      filteredSlideData[swipeGroupValue].push(lesson);
    }
  });

  let stackData = [];
  for (const swipeGroup in filteredSlideData) {
    const stackObject = { swipeGroupValue: null, lessons: [] };
    stackObject.swipeGroupValue = swipeGroup
    for (const lesson in filteredSlideData[swipeGroup]) {
      stackObject.lessons.push(filteredSlideData[swipeGroup][lesson]);
    }

    stackData.push(stackObject);
  }

  if (quizSlides && quizSlides.length) {

    
    let formattedQuiz = [];
    quizSlides.forEach((quiz) => {
      let formattedQuizData = quiz;
      let quizData = JSON.parse(quiz.data);
      let quizDataOptions = quizData.options;
      let modifiedQuizOptions = quizDataOptions.map(str => str.replace(/oneworld/g, '<strong>one</strong>world'));

      quizData.options = modifiedQuizOptions;
      formattedQuizData.data = quizData;
      formattedQuiz.push(formattedQuizData);
    });

    // Adding quiz slides to last stack.
    const quizObject = { swipeGroupValue: null, lessons: [] };
    quizObject.swipeGroupValue = 'quiz'
    for (const slide in quizSlides) {
      quizObject.lessons.push(formattedQuiz[slide]);
    }
    stackData.push(quizObject);
  }

  const stackListWrapper = new WFComponent<HTMLElement>(`#lesson-slider`);
  const lessonStackList = new WFDynamicList<{
    swipeGroupValue: number;
    lessons: [];
  },
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement
  >(`[xa-type="stackList"]`, {
    rowSelector: `[xa-type="stackItem"]`
  });

  lessonStackList.rowRenderer(({ rowData, rowElement }) => {
    rowElement.setAttribute("swipe-group", rowData.swipeGroupValue.toString());

    const list = new WFDynamicList<
      {
        id: string;
        data: string;
        lessonId: string;
        templateKey: string;
        type: string;
      },
      HTMLDivElement,
      HTMLDivElement,
      HTMLDivElement
    >(rowElement, {
      rowSelector: `[xa-type="slide-item"]`,
    });
    list.rowRenderer(({ rowData, rowElement }) => {
      //rowData.id => slide id, type is lessons
      //
      let metaData;
      metaData = lessonsMetaData.getConfig(
        rowData.templateKey
      );
      if (!metaData) {
        metaData = quizMetaData.getConfig(
          rowData.templateKey
        );
      }
      if (!metaData) {
        throw new Error("Invalid row data");
      }
      const template =
        metaData.component.getCloneAsComponent() as WFComponent;
      if (
        template
          .getElement()
          .querySelector(`[xa-type="favouritingIcon"]`)
      )
        initSaveComponent(
          rowData.id,
          SavedItemType.Slide,
          template.getChildAsComponent(
            `[xa-type="favouritingIcon"]`
          )
        );
      const templateData = JSON.parse(rowData.data);
      if (rowData.templateKey === "outro") {
        const nextBtn = template.getChildAsComponent(
          `[xa-key="buttontext"]`
        );
        nextBtn.on("click", () => {
          navigateForward();
        });
        const lottieAnim = (window as any).Webflow.require(
          "lottie"
        ).lottie.loadAnimation({
          container: template
            .getChildAsComponent(`[xa-type="confetee"]`)
            .getElement(),
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/64b6248f84d27e4bfd2c9209_animation_lk7v1o6x.json",
        });
      }
      metaData.editable.forEach((editable) => {
        switch (editable.type) {
          case "text":
            const _text = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );
            _text.setText(templateData[editable.key]);
            break;
          case "image":
            const _img = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );
            _img.setAttribute(
              "src",
              templateData[editable.key]
            );
            _img.setAttribute(
              "srcset",
              templateData[editable.key]
            );

            break;
          case "video":
            const _video =
              template.getChildAsComponent<HTMLVideoElement>(
                `[xa-key="${editable.key}"]`
              );
            const videoPlayButton =
              template.getChildAsComponent<HTMLAnchorElement>(
                `[href="#popup_fw_video"]`
              );
            videoPlayButton.setAttribute(
              "xa-video-url",
              templateData[editable.key]
            );
            _video.getElement().pause();
            // _video.getElement().src = templateData[editable.key];
            _video
              .getChildAsComponent("source")
              .setAttribute(
                "src",
                templateData[editable.key]
              );
            _video
              .getChildAsComponent("source")
              .setAttribute(
                "srcset",
                templateData[editable.key]
              );
            _video.getElement().onload = () => {
              _video
                .getElement()
                .play()
                .then(console.log)
                .catch(console.error);
            };
            _video.getElement().load();
            _video
              .getElement()
              .play()
              .then(console.log)
              .catch(console.error);

            break;
          case "rt":
            const _rt = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );

            _rt.getElement().innerHTML =
              templateData[editable.key];

            break;
          case "rt_for_blanks":
            const generateTextForPreview = (html: string) => {
              return html.replace(
                "_____",
                `<span xa-type="blanks-slot" class="blank_answer" style="min-width: 70px;display: inline-block;"></span>`
              );
            };
            const _rtPreview = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );
            _rtPreview.getElement().innerHTML =
              generateTextForPreview(
                templateData[editable.key]
              );
            const linkTags =
              _rtPreview.getChildAsComponents("a");
            const popupLinks = linkTags.filter((tag: any) => {
              return !!(
                tag.href && tag.href.includes("#popup")
              );
            });
            for (let tag of popupLinks) {
              tag.on("click", () => {
                // TODO: open popup
              });
            }
            break;
          case "number":
            const _number = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );
            _number.setText(templateData[editable.key]);
            break;
          case "mcq":
            let mcqItems = [];
            const mcqAnswer = templateData.answer;
            let mcqSelectedAnswer = "";
            if (templateData && "options" in templateData) {
              if (Array.isArray(templateData.options))
                mcqItems = [...templateData.options];
              else mcqItems = [templateData.options];
            }
            const _mcqPreview = template.getChildAsComponent(
              `[xa-key="${editable.key}"]`
            );
            const _mcqListPreview = new WFDynamicList(
              _mcqPreview,
              {
                rowSelector: `[xa-type="mcq-item"]`,
              }
            );
            _mcqListPreview.rowRenderer(
              ({ rowData, rowElement }) => {
                rowElement.setAttribute(
                  "style",
                  "cursor:pointer;"
                );
                const mcqCircle =
                  rowElement.getChildAsComponent(
                    ".quiz-answer__circle"
                  );
                if (mcqSelectedAnswer === rowData) {
                  mcqCircle.setAttribute(
                    "style",
                    "border-width:8px;"
                  );
                }
                rowElement.on("click", () => {
                  mcqSelectedAnswer = rowData as string;
                  _currentQuizAnswer = rowData as string;
                  _mcqListPreview.forceRender();
                });
                const text = rowElement.getChildAsComponent(
                  `[xa-type="mcq-text"]`
                );
                let modifiedString
                if (rowData.toString().includes("oneworld")) {
                  modifiedString = rowData.toString().replace(/oneworld/g, '<strong>one</strong>world');
                  text.getElement().innerHTML = modifiedString;
                } else {
                  text.setText(rowData as string);
                }
                return rowElement;
              }
            );
            _mcqListPreview.setData(mcqItems);
            break;
          case "2by2img":
            const twoByTwoAnswer = templateData.answer;
            const _twoByTwoImgPreview =
              template.getChildAsComponent(
                `[xa-key="${editable.key}"]`
              );
            const _2by2img1 =
              _twoByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img1"]`
              );
            const _2by2img1Overlay =
              _2by2img1.getChildAsComponent(".fade-overlay");
            const _2by2img2 =
              _twoByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img2"]`
              );
            const _2by2img2Overlay =
              _2by2img2.getChildAsComponent(".fade-overlay");
            const _2by2img3 =
              _twoByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img3"]`
              );
            const _2by2img3Overlay =
              _2by2img3.getChildAsComponent(".fade-overlay");
            const _2by2img4 =
              _twoByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img4"]`
              );
            const _2by2img4Overlay =
              _2by2img4.getChildAsComponent(".fade-overlay");
            let _selected2by2Img = "";
            const _2by2UpdateTile = () => {
              _2by2img1Overlay.setAttribute(
                "style",
                "display:none;"
              );
              _2by2img2Overlay.setAttribute(
                "style",
                "display:none;"
              );
              _2by2img3Overlay.setAttribute(
                "style",
                "display:none;"
              );
              _2by2img4Overlay.setAttribute(
                "style",
                "display:none;"
              );
              if (_selected2by2Img === "1") {
                _2by2img1Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
              if (_selected2by2Img === "2") {
                _2by2img2Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
              if (_selected2by2Img === "3") {
                _2by2img3Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
              if (_selected2by2Img === "4") {
                _2by2img4Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
            };
            [
              _2by2img1,
              _2by2img2,
              _2by2img3,
              _2by2img4,
            ].forEach((img, index) => {
              img.on("click", () => {
                _selected2by2Img = `${index + 1}`;
                _currentQuizAnswer = `${index + 1}`;

                _2by2UpdateTile();
              });
            });
            break;
          case "1by2img":
            const oneByTwoAnswer = templateData.answer;
            const _oneByTwoImgPreview =
              template.getChildAsComponent(
                `[xa-key="${editable.key}"]`
              );

            const _1by2img1 =
              _oneByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img1"]`
              );
            const _1by2img1Overlay =
              _1by2img1.getChildAsComponent(".fade-overlay");
            const _1by2img2 =
              _oneByTwoImgPreview.getChildAsComponent(
                `[xa-type="q-img2"]`
              );
            const _1by2img2Overlay =
              _1by2img2.getChildAsComponent(".fade-overlay");

            let _selected1by2Img = "";
            const _1by2UpdateTile = () => {
              _1by2img1Overlay.setAttribute(
                "style",
                "display:none;"
              );
              _1by2img2Overlay.setAttribute(
                "style",
                "display:none;"
              );

              if (_selected1by2Img === "1") {
                _1by2img1Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
              if (_selected1by2Img === "2") {
                _1by2img2Overlay.setAttribute(
                  "style",
                  "display:block;"
                );
              }
            };
            [_1by2img1, _1by2img2].forEach((img, index) => {
              img.on("click", () => {
                _selected1by2Img = `${index + 1}`;
                _currentQuizAnswer = `${index + 1}`;

                _1by2UpdateTile();
              });
            });
            break;
          case "blanks":
            let blanksItems = [];
            const blanksAnswer = templateData.answer;
            let selectedBlankAnswer = "";
            if (templateData && "options" in templateData) {
              if (Array.isArray(templateData.options))
                blanksItems = [...templateData.options];
              else blanksItems = [templateData.options];
            }
            const _blanksPreview =
              template.getChildAsComponent(
                `[xa-key="${editable.key}"]`
              );

            const _blanksList = new WFDynamicList(
              _blanksPreview.getChildAsComponent(
                `[xa-type="blank-list"]`
              ),
              {
                rowSelector: `[xa-type="blank-item"]`,
              }
            );
            _blanksList.rowRenderer(
              ({ rowData, rowElement }) => {
                rowElement.setText(rowData as string);
                rowElement.on("click", () => {
                  selectedBlankAnswer = rowData as string;
                  _currentQuizAnswer = rowData as string;

                  const blank = template
                    .getElement()
                    .querySelector(`[xa-type="blanks-slot"]`);
                  blank.replaceChildren();
                  blank.appendChild(
                    rowElement.getElement().cloneNode(true)
                  );
                });
                return rowElement;
              }
            );
            _blanksList.setData(blanksItems);
            break;
          default:
            console.log(editable, "unknown");
            break;
        }
      });

      const linkTagsRT =
        template.getChildAsComponents<HTMLAnchorElement>("a");

      const popupLinksRT: WFComponent<HTMLAnchorElement>[] =
        linkTagsRT.filter(
          (tag: WFComponent<HTMLAnchorElement>) => {
            return (
              tag.getAttribute("href") &&
              tag.getAttribute("href").includes("#popup")
            );
          }
        );

      const popupContainer = new WFComponent<HTMLDivElement>(
        `.popup-container`
      );
      for (let tag of popupLinksRT) {
        tag.on("click", () => {
          // TODO: open popup

          const popupSelector = tag.getAttribute("href");
          const isVideo = popupSelector.includes("_video");
          const popupElt =
            document.querySelector(popupSelector);
          if (popupElt) {
            const popupComponent =
              new WFComponent<HTMLDivElement>(popupElt);
            initSaveComponent(
              rowData.id,
              SavedItemType.Slide,
              popupComponent.getChildAsComponent(
                `[xa-type="favouritingIcon"]`
              )
            );
            if (isVideo) {
              // const videoDiv = popupComponent.getChildAsComponent(`[xa-type="popupVideo"]`);
              const video =
                popupComponent.getChildAsComponent<HTMLVideoElement>(
                  `video`
                );
              video.getElement().replaceChildren();
              video.removeAttribute("autoplay");
              video.removeAttribute("loop");
              video.setAttribute("controls", "");
              video.getElement().style.objectFit = "contain";
              const source = document.createElement("source");
              source.src = tag.getAttribute("xa-video-url");
              source.srcset =
                tag.getAttribute("xa-video-url");
              video.getElement().appendChild(source);
            }
            const popupEltInner =
              popupComponent.getChildAsComponent(
                `[xa-type="popupInner"]`
              );
            popupContainer
              .getElement()
              .appendChild(popupComponent.getElement());
            popupEltInner.setAttribute("style", "");
            popupComponent.addCssClass("active");
            setTimeout(() => {
              popupEltInner.addCssClass("active");
            }, 50);

            const popupClose =
              popupComponent.getChildAsComponent(
                ".course-nav__close-link"
              );
            const popupOverlay = popupComponent.getChildAsComponent(
              ".popup_overlay"
            );
            popupClose.on("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              popupEltInner.removeCssClass("active");
              setTimeout(() => {
                popupComponent.removeCssClass("active");
              }, 500);
            });

            popupOverlay.on("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              popupEltInner.removeCssClass("active");
              setTimeout(() => {
                popupComponent.removeCssClass("active");
              }, 500);
            });
          }
        });
      }

      return template as any;
    });
    list.setData(rowData.lessons);
    return rowElement;
  });
  lessonStackList.setData(stackData);
  stackListWrapper.removeCssClass("hide");
  getLoader().hide();
  /* To Add skeleton loader */

  // Handle course/quiz navigation
  let stacksWrapper = document.querySelector(`[xa-type="stackList"]`);
  let cardStacks = Array.from(
    stacksWrapper.querySelectorAll(".stack-lesson-cards")
  );
  let currentStackIndex = 0, currentSlideIndex = 0;
  let lastStackIndex = stackData.length - 1;
  // let lastSlideIndex;
  let currentStack = cardStacks[currentStackIndex];
  let cards: any = Array.from(
    currentStack.querySelectorAll(
      "#lesson-slider .lesson-card__container"
    )
  );
  const isResumeFromSlideId = resumeSlideId.length > 0;

  let resumeStackIndex = 0, resumeSlideIndex = 0, progressSlideIndex = 0;

  // Calculate resume stack & slide index.
  let allSlides = lessonSlides.concat(quizSlides);
  let resumeSlide;


  allSlides.forEach((slide, index) => {
    if (index === progressSlide - 1 && progressSlide != 0) {
      resumeSlide = slide;
    }
  });

  const resumeSavedSlide = allSlides.find((s) => s.id === resumeSlideId);
  if (resumeSavedSlide) {
    resumeSlide = resumeSavedSlide;
  }

  stackData.forEach((stack, index) => {
    stack.lessons.forEach((slide, _index) => {
      if (resumeSlide && slide.id === resumeSlide.id) {
        if (stack.lessons[_index + 1]) {
          resumeStackIndex = index;
          resumeSlideIndex = _index + 1;
        } else {
          resumeStackIndex = index + 1;
          resumeSlideIndex = 0;
        }
      }
    })
  });

  const progressBar: any =
    document.querySelector(".progress-bar");

  let currentIndex = resumeSlideIndex ? resumeSlideIndex: isPreview ? 0 : Math.max(resumeSlideIndex, 0);
  currentSlideIndex = progressSlide === 0 ? 0 : progressSlide;
  progressSlideIndex = progressSlide ? progressSlide : 0;
  currentStackIndex = resumeStackIndex ? resumeStackIndex : isPreview ? 0 : Math.max(resumeStackIndex, 0);
  currentStack = cardStacks[currentStackIndex];
  latestSlideProgress = progressSlideIndex;
  cards = Array.from(
    currentStack.querySelectorAll(
      "#lesson-slider .lesson-card__container"
    )
  );

  if (progressSlideIndex === allSlides.length - 1) {
    if (!resumeSlideId) {
      updateCourseProgressReq.fetch({
        lessonProgressId: progressDataId,
        progress: progressSlideIndex - 1,
        isCompleted: true,
      });
      completeTrigger.getElement().click();
    }
  }

  let prevButton: any = document.getElementById("prev");
  let nextButton: any = document.getElementById("next");

  const progress = (progressSlideIndex * 100) / (allSlides.length);
  progressBar.style.width = `${progress}%`;

  function updateStacks() {
    for (let i = 0; i < cardStacks.length; i++) {
      if (i === currentStackIndex) {
        cardStacks[i].classList.remove("inactive");
        cardStacks[i].classList.add("active");
      } else {
        cardStacks[i].classList.add("inactive");
        cardStacks[i].classList.remove("active");
      }
      if (i < currentStackIndex) {
        cardStacks[i].classList.add("offscreen-left");
      } else {
        cardStacks[i].classList.remove("offscreen-left");
      }
    }
  }

  function updateCardStyles() {
    cards.forEach((card, index) => {
      if (currentStackIndex === cardStacks.length - 1 && quizSlides && quizSlides.length) {
        //quiz mode

        //quiz slide overflow fix
        const quizSlidesWrapper =
          new WFComponent<HTMLDivElement>(
            `[swipe-group="quiz"]`
          );
        const topBar = new WFComponent<HTMLDivElement>(
          ".course-top-bar"
        );
        quizSlidesWrapper.getElement().style.minHeight =
          "725px";
        topBar.getElement().style.marginBottom = "0";

        if (index < currentIndex) {
          card.style.opacity = 0;
          card.style.pointerEvents = "none";
          card.style.transform = `translateY(0px) scale(1)`;
        } else if (index == currentIndex) {
          card.style.opacity = 1;
          card.style.pointerEvents = "auto";
          card.style.transform = `translateY(0px) scale(1)`;
        } else {
          card.style.opacity = 0;
          card.style.pointerEvents = "none";
          card.style.transform = `translateY(0px) scale(1)`;
        }
      } else {
        //lesson mode
        if (index < currentIndex) {
          //card exits offscreen
          card.style.transform = `translate(-250%, 150px) rotate(-40deg)`;
          card.style.opacity = 0;
          card.style.pointerEvents = "none";
        } else {
          card.style.pointerEvents = "auto";

          const offsetBottom = 20 * (index - currentIndex);

          card.style.transform = `translateY(${Math.max(
            0,
            offsetBottom
          )}px) scale(${1 - 0.05 * (index - currentIndex)
            })`;

          if (index - currentIndex > 5) {
            card.style.pointerEvents = "none";
            card.style.opacity = 0;
          } else if (index - currentIndex < 3 && index - currentIndex > 0) {
            card.style.pointerEvents = "none";
            card.style.opacity = 1;
          } else if (index - currentIndex == 0) {
            card.style.opacity = 1 - 0.2 * (index - currentIndex);
          } else {
            card.style.opacity =
              1 - 0.2 * (index - currentIndex);
          }
          //hide quiz card
          if (index >= lessonSlides.length) {
            card.style.pointerEvents = "none";
            card.style.opacity = 0;
          }
        }
      }
      card.style.zIndex = 4 - index + currentIndex;
    });

    prevButton.disabled =
      currentIndex === 0 && currentStackIndex === 0;
    nextButton.disabled =
      currentIndex === cards.length - 1 &&
      currentStackIndex === cardStacks.length - 1;

    const totalCards = cardStacks.reduce(
      (total, stack) =>
        total +
        stack.querySelectorAll(
          "#lesson-slider .lesson-card__container"
        ).length,
      0
    );

    const progress = (progressSlideIndex * 100) / (allSlides.length - 1);

    progressBar.style.width = `${progress}%`;
  }

  function navigateToNextStack() {
    currentStackIndex++;
    currentStack = cardStacks[currentStackIndex];
    cards = Array.from(currentStack.querySelectorAll('.lesson-card__container'));
    currentIndex = 0;
    updateStacks();
    updateCardStyles();
  }

  function navigateToPreviousStack() {
    currentStackIndex--;
    currentStack = cardStacks[currentStackIndex];
    cards = Array.from(currentStack.querySelectorAll('.lesson-card__container'));
    currentIndex = cards.length - 1;
    updateStacks();
    updateCardStyles();
  }

  prevButton.addEventListener("click", navigateBackward);
  nextButton.addEventListener("click", navigateForward);

  document.addEventListener("keydown", function (event) {
    if (!isProgressReqProcessing) {
      if (event.key === "ArrowRight" || event.key === " ") {
          navigateForward();
      } else if (event.key === "ArrowLeft") {
        navigateBackward();
      }
    }
  });

  const showQuizMode = () => {
    if (currentStackIndex === cardStacks.length - 1 && quizSlides && quizSlides.length) {
      navLoader.addCssClass("hide");
      nextBtn.setAttribute("style", "display:none");
      prevBtn.setAttribute("style", "display:none");
      nextBtnForQuiz.removeCssClass("hide");
    } else {
      if (isProgressReqProcessing) {
        nextBtn.setAttribute("style", "display:none; pointer-events: none;");
        prevBtn.setAttribute("style", "display:none; pointer-events: none;"); 
        // navLoader.setAttribute("style", "display: flex");
        navLoader.removeCssClass("hide");
      } else {
        nextBtn.setAttribute("style", "display:flex");
        prevBtn.setAttribute("style", "display:flex");
        // navLoader.setAttribute("style", "display: none");
        navLoader.addCssClass("hide");
      }
      nextBtnForQuiz.addCssClass("hide");
    }
  };
  showQuizMode();

  window.addEventListener('resize', () => {
    showQuizMode();
  });

  const resetButton = () => {
    nextBtnForQuiz.removeCssClass("well-done");
    nextBtnForQuiz.removeCssClass("oops");
    nextBtnForQuiz
      .getChildAsComponent(`.quiz-button__text`)
      .setText("Continue");
  };

  // Handles quiz answer success state
  const showSuccessState = () => {
    nextBtnForQuiz.addCssClass("well-done");
    nextBtnForQuiz
      .getChildAsComponent(`.quiz-button__text`)
      .setText("Well done!");

    setTimeout(() => {
      resetButton();
    }, 2000);
  };

  // Handles quiz answer error state
  const showErrorState = () => {
    nextBtnForQuiz.addCssClass("oops");
    nextBtnForQuiz
      .getChildAsComponent(`.quiz-button__text`)
      .setText("Oops!");

    setTimeout(() => {
      errorTiggerButton.getElement().click();
    }, 800);
    setTimeout(() => {
      resetButton();
    }, 2000);
  };

  // Handles end of course
  endTriggerButton.on("click", () => {
    if (certificateId) {
      navigate(
        `${PUBLIC_PATHS.courseHightlights}?id=${certificateId}`
      );
    } else if (nextLessonId) {
      navigate(
        `${PUBLIC_PATHS.viewCourse}?id=${nextLessonId}`
      );
    } else {
      navigate(
        `${PUBLIC_PATHS.dashboardMain}`
      );
    }
  });

  // Handles course outro 
  const checkAnRenderOutroMode = () => {
    const currentCards = stackData[currentStackIndex].lessons;
    const slide = currentCards[currentIndex];
    if (slide && slide.templateKey === "outro") {
      bottomNav.setAttribute(
        "style",
        "opacity:0;pointer-events: none;"
      );
    } else {
      bottomNav.setAttribute(
        "style",
        "opacity:1;pointer-events: auto;"
      );
    }
  };

  function navigateForward() {
    let isWrong = false;
    if (currentStackIndex === cardStacks.length - 1 && quizSlides && quizSlides.length) {
      //quiz mode

      // Check if quiz answer is right or wrong.
      const _quiz =
        quizSlides[currentIndex];
      if (_quiz) {
        const _data = JSON.parse(_quiz.data);
        const _answer = _data.answer;
        if (_currentQuizAnswer === "") {
          alert("Please choose answer");
          return;
        }
        if (_answer !== _currentQuizAnswer) {
          isWrong = true;
          _currentQuizAnswer = "";
          showErrorState();
        } else {
          progressSlideIndex++;
          showSuccessState();
        }
      }
    } else {
      progressSlideIndex++;
    }

    _currentQuizAnswer = "";
    if (currentIndex < cards.length - 1 || currentStackIndex < cardStacks.length - 1) {
      if (!isWrong) {
        currentIndex++;
        currentSlideIndex++;
        if (currentIndex > cards.length - 1 && currentStackIndex < cardStacks.length - 1) {
          navigateToNextStack();
        } else {
          updateCardStyles();
        }
      }
      
      if (progressSlideIndex <= allSlides.length && progressSlideIndex > latestSlideProgress) {
        if (!isWrong) {
          isProgressReqProcessing = true;
          latestSlideProgress++;
          updateCourseProgressReq.fetch({
            lessonProgressId: progressDataId,
            progress: progressSlideIndex,
            isCompleted: false,
          });
        }
      }
    } else if (progressSlideIndex === allSlides.length && progressSlideIndex > latestSlideProgress) {
      if (!isWrong) {
        const successBtnText = new WFComponent(
          `[xa-type="successBtnText"]`
        );
        isProgressReqProcessing = true;
        latestSlideProgress++;
        updateCourseProgressReq.fetch({
          lessonProgressId: progressDataId,
          progress: progressSlideIndex - 1,
          isCompleted: true,
        });
        const totalLessons = currentCertificationData.lesson.filter(l => l.enabled).length;
        const completedLessons = currentCertificationData.lesson.filter(l => l.enabled && l.lessonProgress[0] && l.lessonProgress[0].completed).length;
        const incompleteLessons = currentCertificationData.lesson.filter(l => l.lessonProgress[0] && l.lessonProgress[0].progress >= 0 && (!l.lessonProgress[0].completed));
        const notStartedLessons = currentCertificationData.lesson.filter(l => l && (!l.lessonProgress[0]));
        if ((completedLessons + 1) === totalLessons) {
          createCertificateReq
            .fetch({
              lessonId,
            })
            .then((data) => {
              certificateId = data.createCertificate.id;
            });
          currentSlideIndex++;
          completeTrigger.getElement().click();
          progressBar.style.width = `100%`;
        } else {
          successBtnText.setText("Next Lesson");
          nextLessonId = notStartedLessons && notStartedLessons.length ? notStartedLessons[0].id : incompleteLessons[0].id;
          currentSlideIndex++;
          completeTrigger.getElement().click();
          progressBar.style.width = `100%`;
        }
        return;
      }
    }
    showQuizMode();
    checkAnRenderOutroMode();
  }
  nextBtnForQuiz.on("click", navigateForward);


  function navigateBackward() {
    if (currentStackIndex === lastStackIndex && stackData[lastStackIndex].lessons.length - 1 === currentIndex) {
      if (currentStackIndex === cardStacks.length - 1) {
        alert("Course completed! Collect certificate.");
        return;
      }
    }
    if (quizSlides && quizSlides.length && currentStackIndex === cardStacks.length - 1) {
      alert("Can't navigate back while quiz is running");
      return;
    }
    progressSlideIndex--;
    if (currentIndex > 0 || currentStackIndex > 0) {
      currentIndex--;
      if (currentIndex < 0 && currentStackIndex > 0) {
        navigateToPreviousStack();
      } else {
        updateCardStyles();
      }
    }
    showQuizMode();
    checkAnRenderOutroMode();
  }

  updateCardStyles();
  updateStacks();


  // Popup Bubble Template Open/Close on '+' icon
  try {
    const lessonSlider = document.querySelector("#lesson-slider");
    const pbSlides = lessonSlider.querySelectorAll('[xa-type="slide-item"][xa-template-key="special2"]');

    pbSlides.forEach((slide) => {
    const pbToggles = slide.querySelectorAll(`[xa-type="bubbleExpander"]`);

    pbToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const popupLink = toggle.parentElement.querySelector('a');
        if (popupLink) {
          popupLink.click();
        }
      });
    });

    });

  } catch (e) {
    console.log(e);
  }
    
}

const setLanguageSelector = () => {
  if (!Weglot) {
    return;
  }

  const list = document.getElementsByClassName("nav_language_dd-list")[0];
  list.innerHTML = "";

  const changeLanguage = (lang: string) => {
    Weglot.switchTo(lang);
    list.innerHTML = "";
    setLanguages();
  };

  const setLanguages = () => {
    let availableLanguages = [];
    if (ENVIRONMENT === "Production") {
      availableLanguages = ["en", "fr"]
    } else {
      availableLanguages = ["en", "ar", "ja", "fr"]
    }
    for (let i = 0; i < availableLanguages.length; i++) {
      let lang = availableLanguages[i];
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "nav_language_dd-list_item w-inline-block";
      a.tabIndex = 0;
      a.href = "#";
      a.onclick = () => {
        changeLanguage(lang)
      };
      const img = document.createElement("img");
      img.loading = "lazy";
      img.className = "nav_language_dd-icon";
      const div = document.createElement("div");
      div.className = "body-large";
      if (lang === "en") {
        img.src = "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg";
        img.srcset = "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg";
        div.innerText = "English"
      } else if (lang === "ar") {
        img.src = "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg";
        img.srcset = "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg";
        div.innerText = "العربية"
      } else if (lang === "ja") {
        img.src = "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg";
        img.srcset = "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg";
        div.innerText = "日本語"
      } else if (lang === "fr") {
        img.src = "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg";
        img.srcset = "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg";
        div.innerText = "français"
      }
      a.appendChild(img);
      a.appendChild(div);
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  setLanguages();
}

