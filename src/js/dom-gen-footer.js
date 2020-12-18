import { createBox } from "./dom-elements";

export const generateFooter = () => {
  const body = document.querySelector("body");

  const footer = createBox(body, "footer", { classList: "footer" });

  const githubIcon = createBox(footer, "a", {
    classList: "footer__icon",
    href: `https://www.github.com/tzunwip/to-do-list`,
    target: "_blank",
  });

  createBox(githubIcon, "i", {
    classList: "fab fa-github fa-2x",
  });
};
