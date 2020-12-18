import { createBox } from "./dom-elements";
import { findElement, displayElement } from "./utility-functions";

// generates controls and sticky container
export const generateControls = () => {
  const body = document.querySelector("body");

  const stickyContainer = createBox(body, "div", {
    classList: "sticky-container",
  });

  const controlsContainer = createBox(stickyContainer, "div", {
    classList: "controls",
  });

  // add/search extension bar
  const extensionBar = createBox(controlsContainer, "div", {
    classList: "controls__extension",
  });

  // search button
  const searchButton = createBox(extensionBar, "div", {
    classList: "controls__button controls__search-button",
  });

  const searchButtonIcon = createBox(searchButton, "i", {
    classList: "fas fa-search",
  });

  // add new task button
  const addTaskButton = createBox(extensionBar, "div", {
    classList: "controls__button controls__add-button",
    id: "new-task-button",
  });

  createBox(addTaskButton, "i", {
    classList: "fas fa-plus",
  });

  // burger menu button
  const menuButton = createBox(controlsContainer, "div", {
    classList: "controls__button controls__burger-button",
  });

  const menuButtonBurger = createBox(menuButton, "i", {
    classList: "fas fa-bars",
  });

  // event listeners
  // menu extension transitions
  let extensionToggled = false;
  menuButton.addEventListener("click", () => {
    if (!extensionToggled) {
      menuButtonBurger.classList.remove("fa-bars");
      menuButtonBurger.classList.add("fa-times");
      menuButton.classList.add("controls__burger-button--extended");
      setTimeout(
        () => extensionBar.classList.add("controls__extension--extended"),
        100
      );
      setTimeout(
        () => addTaskButton.classList.add("controls__add-button--extended"),
        200
      );
      setTimeout(
        () => searchButton.classList.add("controls__search-button--extended"),
        225
      );
    } else {
      menuButtonBurger.classList.remove("fa-times");
      menuButtonBurger.classList.add("fa-bars");
      setTimeout(
        () =>
          searchButton.classList.remove("controls__search-button--extended"),
        0
      );
      setTimeout(
        () => addTaskButton.classList.remove("controls__add-button--extended"),
        25
      );
      setTimeout(
        () => extensionBar.classList.remove("controls__extension--extended"),
        100
      );
      setTimeout(
        () => menuButton.classList.remove("controls__burger-button--extended"),
        200
      );
    }
    extensionToggled = !extensionToggled;
  });

  // expands form if none expanded
  addTaskButton.addEventListener("click", () => {
    if (findElement("#new-task-form.expanded-height")) {
      return;
    } else if (findElement(".sticky-form.expanded-height")) {
      displayElement("collapse", ".sticky-form.expanded-height");
      // require timeout to achieve popup effect
      setTimeout(displayElement, 200, "expand", "#new-task-form");
    } else {
      displayElement("expand", "#new-task-form");
    }
  });

  searchButton.addEventListener("click", () => {
    if (findElement("#search-form.expanded-height")) {
      return;
    } else if (findElement(".sticky-form.expanded-height")) {
      displayElement("collapse", ".sticky-form.expanded-height");
      // require timeout to achieve popup effect
      setTimeout(displayElement, 200, "expand", "#search-form");
    } else {
      displayElement("expand", "#search-form");
    }
  });
};
