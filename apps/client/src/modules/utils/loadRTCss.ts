const loadRTCss = () => {
  const head = document.getElementsByTagName("head")[0];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://cdn.quilljs.com/1.0.0/quill.snow.css";
  link.media = "all";
  head.appendChild(link);
};

export default loadRTCss;
