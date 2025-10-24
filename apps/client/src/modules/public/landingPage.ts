import { ENVIRONMENT } from "../../config";

export const landingPage = () => {
    
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