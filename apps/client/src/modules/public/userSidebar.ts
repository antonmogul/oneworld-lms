import { WFComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { GetAllNotificationsDocument, GetUserNotificationLastSeenDocument, UserMeDocument } from "../../graphql/graphql";
import { ENVIRONMENT, PUBLIC_PATHS, S3_BASE_URL } from "../../config";
import { logoutPublicAuth } from "../../auth/public";
import dayjs from "dayjs";

export const userSidebar = () => {
  const userMeReq = publicQL.query(UserMeDocument);
  const userLastSeenReq = publicQL.query(GetUserNotificationLastSeenDocument);
  const allNotificationsReq = publicQL.query(GetAllNotificationsDocument);
  const path = window.location.pathname;
  try {
    const settingsIconParentM = new WFComponent(`[xa-type="settingsIconM"]`);
    const settingsIconM = settingsIconParentM.getChildAsComponent(`.settings`);
    const userInitialsText = new WFComponent(`[xa-var="userInitialsText"]`);
    const userInitialsTextM = new WFComponent(`[xa-var="userInitialsTextM"]`);

    // executes only on settings page.
    if (path === PUBLIC_PATHS.settings) {
      settingsIconM.addCssClass("filled");
      const airlineNameM = new WFComponent(`[xa-type="airline_nameM"]`);
      const profileNameMobile = new WFComponent(`[wized="user_name_mobile"]`);
      const profilePopUpLogoutLinkMobile = new WFComponent(
        "#signOutM"
      );
      const bellIconParentM = new WFComponent(`[xa-type="notificationIconM"]`);
      const bellIconM = bellIconParentM.getChildAsComponent(".notification");
      const bellIconDotM = bellIconM.getElement().querySelector(".notification-dot");
      let allNotifications = [], newCounter = 0;

      userMeReq.fetch().then((data) => {
        airlineNameM.setText(`${data.userMe.airline}`);
        airlineNameM.getElement().innerHTML = `${data.userMe.airline}`;
        profileNameMobile.setText(`${data.userMe.firstName} ${data.userMe.lastName}`);
        const initials = getInitials(`${data.userMe.firstName} ${data.userMe.lastName}`);
        userInitialsText.setText(initials);
        userInitialsTextM.setText(initials);
        profilePopUpLogoutLinkMobile.on("click", () => {
          setTimeout(() => {
            logoutPublicAuth();
            navigate(PUBLIC_PATHS.signIn);
          }, 500);
        });

        if (bellIconParentM) {
          allNotificationsReq.onData((data) => {
            allNotifications = data.getAllNotifications;
  
            userLastSeenReq.onData((_data) => {
              const lastSeen = _data.getUserNotificationLastSeen;
  
              for (let index in allNotifications) {
                const t = dayjs(lastSeen).diff(allNotifications[index].createdAt, "milliseconds");
                if (t <= 0)
                  newCounter += 1;
              }
  
              if (newCounter > 0) {
                // bellIconDot.classList.add("show");
                bellIconDotM.classList.add("show");
              }
            });
            userLastSeenReq.fetch();
  
          });
          allNotificationsReq.fetch();
  
        }
      });
    }
    // end of settings page
    
    const profileName = new WFComponent(".profile-name");
    const airlineName = new WFComponent(`[xa-type="airline_name"]`);
    const airlineNameM = new WFComponent(`[xa-type="airline_nameM"]`);
    const profileNameMobile = new WFComponent(`[wized="user_name_mobile"]`);

    //dashboard icon
    const dashboardIconParent = new WFComponent(`[xa-type="dashboardIcon"]`);
    const dashboardIcon = dashboardIconParent.getChildAsComponent(".dashboard");
    const dashboardIconParentM = new WFComponent(`[xa-type="dashboardIconM"]`);
    const dashboardIconM = dashboardIconParentM.getChildAsComponent(".dashboard");

    //Courses Icon
    const coursesIconParent = new WFComponent(`[xa-type="coursesIcon"]`);
    const coursesIcon = coursesIconParent.getChildAsComponent(".course");
    const coursesIconParentM = new WFComponent(`[xa-type="coursesIconM"]`);
    const coursesIconM = coursesIconParentM.getChildAsComponent(".course");

    //certification icon
    const certificationIconParent = new WFComponent(`[xa-type="certificationIcon"]`);
    const certificationIcon = certificationIconParent.getChildAsComponent(".certifications");
    const certificationIconParentM = new WFComponent(`[xa-type="certificationIconM"]`);
    const certificationIconM = certificationIconParentM.getChildAsComponent(".certifications");

    // saved icon
    const savedIconParent = new WFComponent(`[xa-type="savedIcon"]`);
    const savedIcon = savedIconParent.getChildAsComponent(".saved");
    const savedIconParentM = new WFComponent(`[xa-type="savedIconM"]`);
    const savedIconM = savedIconParentM.getChildAsComponent(".saved");

    // notification icon
    const bellIconParent = new WFComponent(`[xa-type="notificationIcon"]`);
    const bellIcon = bellIconParent.getChildAsComponent(".notification");
    const bellIconDot = bellIcon.getElement().querySelector(".notification-dot");
    const bellIconParentM = new WFComponent(`[xa-type="notificationIconM"]`);
    const bellIconM = bellIconParentM.getChildAsComponent(".notification");
    const bellIconDotM = bellIconM.getElement().querySelector(".notification-dot");

    let allNotifications = [], newCounter = 0;

    if (path === PUBLIC_PATHS.dashboardMain) {
      dashboardIcon.addCssClass("filled");
      dashboardIconM.addCssClass("filled");
    } else if (path === PUBLIC_PATHS.certificates || path === PUBLIC_PATHS.certificationDetails) {
      certificationIcon.addCssClass("filled");
      certificationIconM.addCssClass("filled");
    } else if (path === PUBLIC_PATHS.saved) {
      savedIcon.addCssClass("filled");
      savedIconM.addCssClass("filled");
    } else if (path === PUBLIC_PATHS.notifications) {
      bellIcon.addCssClass("filled");
      bellIconM.addCssClass("filled");
    } else if (path === PUBLIC_PATHS.courseList || path === PUBLIC_PATHS.courseDetails) {
      const menuItem = new WFComponent<HTMLAnchorElement>(`#coursesLink`);
      menuItem.addCssClass("w--current");
    }


    if (profileName) {
      const profilePopUpSettingsLink = new WFComponent(
        ".profile-pop_link_settings"
      );
      const profilePopUpLogoutLink = new WFComponent(
        "#signOutD"
      );
      const profilePopUpLogoutLinkMobile = new WFComponent(
        "#signOutM"
      );
      userMeReq.onData((data) => {
        profileName.setText(
          `${data.userMe.firstName} ${data.userMe.lastName}`
        );
        airlineName.setText(`${data.userMe.airline}`);
        airlineNameM.setText(`${data.userMe.airline}`);
        airlineName.getElement().innerHTML = `${data.userMe.airline}`;
        airlineNameM.getElement().innerHTML = `${data.userMe.airline}`;
        profileNameMobile.setText(`${data.userMe.firstName} ${data.userMe.lastName}`);
        const initials = getInitials(`${data.userMe.firstName} ${data.userMe.lastName}`);
        userInitialsText.setText(initials);
        userInitialsTextM.setText(initials);
        setLanguageSelector();
      });
      profilePopUpSettingsLink.on("click", () => {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.dashboardMain);
        }, 2000);
      });
      profilePopUpLogoutLink.on("click", () => {
        setTimeout(() => {
          logoutPublicAuth();
          navigate(PUBLIC_PATHS.signIn);
        }, 500);
      });
      profilePopUpLogoutLinkMobile.on("click", () => {
        setTimeout(() => {
          logoutPublicAuth();
          navigate(PUBLIC_PATHS.signIn);
        }, 500);
      });
      userMeReq.fetch();

      if (bellIconParent) {
        allNotificationsReq.onData((data) => {
          allNotifications = data.getAllNotifications;

          userLastSeenReq.onData((_data) => {
            const lastSeen = _data.getUserNotificationLastSeen;

            for (let index in allNotifications) {
              const t = dayjs(lastSeen).diff(allNotifications[index].createdAt, "milliseconds");
              if (t <= 0)
                newCounter += 1;
            }

            if (newCounter > 0) {
              bellIconDot.classList.add("show");
              bellIconDotM.classList.add("show");
            }
          });
          userLastSeenReq.fetch();

        });
        allNotificationsReq.fetch();

      }
    }
  } catch (err) {
    console.log(
      "🚀 ~ file: userSidebar.ts:31 ~ userSidebar ~ err:",
      err
    );
  }
};

function getInitials(name) {
  const words = name.split(' ');
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  return initials;
}

const setLanguageSelector = () => {
  if (!Weglot) {
    return;
  }

  const languageIconMobile = new WFComponent<HTMLImageElement>(`[xa-type="languageFlagM"]`);
  const languageNameMobile = new WFComponent(`[xa-type="languageNameM"]`);
  const languageIcon = new WFComponent(`[xa-type="languageFlag"]`);
  const languageName = new WFComponent(`[xa-type="languageName"]`);

  const list = document.getElementsByClassName("nav_language_dd-list")[1];
  const listMobile = document.getElementsByClassName("nav_language_dd-list")[0];
  list.innerHTML = "";
  listMobile.innerHTML = "";

  const setCurrentLanguage = () => {
    const currentLang = Weglot.getCurrentLang();
    switch(currentLang) {
      case "en":
        languageIconMobile.setAttribute("src", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg");
        languageIconMobile.setAttribute("srcSet", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg");
        languageNameMobile.setText("English");
        languageIcon.setAttribute("src", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg");
        languageIcon.setAttribute("srcSet", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364c3b2f4db3fb4cea4466_Flag_of_the_United_Kingdom.svg");
        languageName.setText("English");
        break;
      case "ar":
        languageIconMobile.setAttribute("src", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg");
        languageIconMobile.setAttribute("srcSet", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg");
        languageNameMobile.setText("العربية");
        languageIcon.setAttribute("src", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg");
        languageIcon.setAttribute("srcSet", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc64b9f0ed92a42ac4377_Flag_of_the_United_Arab_Emirates.svg");
        languageName.setText("العربية");
        break;
      case "ja":
        languageIconMobile.setAttribute("src", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg");
        languageIconMobile.setAttribute("srcSet", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg");
        languageNameMobile.setText("日本語");
        languageIcon.setAttribute("src", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg");
        languageIcon.setAttribute("srcSet", "https://assets.website-files.com/649b0f170f230b872d875a1a/651fc658dc3b882cea203661_Flag_of_Japan.svg");
        languageName.setText("日本語");
        break;
      case "fr":
        languageIconMobile.setAttribute("src", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg");
        languageIconMobile.setAttribute("srcSet", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg");
        languageNameMobile.setText("français");
        languageIcon.setAttribute("src", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg");
        languageIcon.setAttribute("srcSet", "https://uploads-ssl.webflow.com/649b0f170f230b872d875a1a/65364dfb7c5d2b1ad51b89b3_Flag_of_France_official%20(1).svg");
        languageName.setText("français");
        break;
      
    }
  };

  const changeLanguage = (lang: string) => {
    Weglot.switchTo(lang);
    list.innerHTML = "";
    listMobile.innerHTML = "";
    setLanguages();
    setCurrentLanguage();
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
      const clonedLi: any = li.cloneNode(true);
      clonedLi.childNodes[0].onclick = () => {
        changeLanguage(lang)
      };
      listMobile.appendChild(clonedLi);
      setCurrentLanguage();
    }
  }

  setLanguages();
}

