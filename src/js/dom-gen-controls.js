import { createBox } from "./dom-elements";
import { findElement, displayElement } from "./utility-functions";

// generates controls and sticky container
export const generateControls = () => {
  const body = document.querySelector("body");

  const stickyContainer = createBox(body, "div", {
    classList: "sticky-container",
  })

  const controlsContainer = createBox(stickyContainer, "div", {
    classList: "controls",
  });

  // burger menu button
  const menuButton = createBox(controlsContainer, "div", {
    classList: "controls__button fa-stack",
  })

  const menuButtonCircle = createBox(menuButton, "i", {
    classList: "fas fa-circle fa-stack-2x",
  })

  const menuButtonBurger = createBox(menuButton, "i", {
    classList: "fas fa-bars fa-stack-1x fa-inverse",
  })

  // add/search extension bar
  const extensionBar = createBox(controlsContainer, "div", {
    classList: "controls__extension",
  })
  
  // search button
  const searchButton = createBox(extensionBar, "div", {
    classList: "controls__button fa-stack",
  })

  const searchButtonCircle = createBox(searchButton, "i", {
    classList: "fas fa-circle fa-stack-2x",
  })

  const searchButtonIcon = createBox(searchButton, "i", {
    classList: "fas fa-search fa-stack-1x fa-inverse",
    })
  
  // add new task button
  const addTaskButton = createBox(extensionBar, "div", {
    classList: "controls__button",
    id: "new-task-button",
  });

  createBox(addTaskButton, "i", {
    classList: "fas fa-plus-circle fa-2x",
  });
  
  // event listeners
  // expands form if none expanded
  addTaskButton.addEventListener("click", () => {
    if (findElement("#new-task-form.expanded-height")) {
      return
    } else if (findElement(".sticky-form.expanded-height")) {
      displayElement("collapse", ".sticky-form.expanded-height")
      // require timeout to achieve popup effect
      setTimeout(displayElement, 200, "expand", "#new-task-form")
    } else {
      displayElement("expand", "#new-task-form")
    }
  })

  searchButton.addEventListener("click", () => {
    if (findElement("#search-form.expanded-height")) {
      return
    } else if (findElement(".sticky-form.expanded-height")) {
      displayElement("collapse", ".sticky-form.expanded-height")
      // require timeout to achieve popup effect
      setTimeout(displayElement, 200, "expand", "#search-form")
    } else {
      displayElement("expand", "#search-form")
    }
  })
}