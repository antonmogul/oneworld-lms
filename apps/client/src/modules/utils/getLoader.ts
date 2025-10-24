import { WFComponent } from "@xatom/core";

let loader: WFComponent<HTMLDivElement> = null;

const getLoader = () => {
  if (loader === null) {
    loader = new WFComponent<HTMLDivElement>(
      ".dashboard-loader-wrap"
    );
  }

  return {
    component: loader,
    show: () => {
      loader.setAttribute(
        "style",
        "display:flex;opacity:1;"
      );
    },
    hide: () => {
      setTimeout(() => {
        loader.setAttribute("style", "opacity:0;");
        setTimeout(() => {
          loader.setAttribute(
            "style",
            "opacity:0;display:none;"
          );
        }, 200);
      }, 10);
    },
  };
};

export default getLoader;
