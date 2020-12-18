import { createBox } from "./dom-elements";
import { populateModifyForm } from "./dom-gen-forms";
import { data } from "./data-controller";
import {
  getVerboseDate,
  findElement,
  capitalizeFirstLetter,
  displayElement,
} from "./utility-functions";

// card factory function
export const Card = (parent) => {
  // generate dom elements
  const container = createBox(parent, "div", {
    classList: "card",
  });

  const checkmarkButton = createBox(container, "button", {
    classList: "card__check",
    ariaLabel: "Toggle Completed",
  });

  const checkmarkIcon = createBox(checkmarkButton, "i");

  const titleElement = createBox(container, "h3", {
    classList: "card__title",
  });

  const controlsContainer = createBox(container, "div", {
    classList: "card__control-container",
  });

  const deleteCardButton = createBox(controlsContainer, "button", {
    classList: "card__delete-button",
    type: "button",
    ariaLabel: "Delete Task",
  });

  const deleteTaskIcon = createBox(deleteCardButton, "i", {
    classList: "fas fa-times",
  });

  const modifyCardButton = createBox(controlsContainer, "button", {
    classList: "card__modify-button",
    type: "button",
    ariaLabel: "Modify Task",
  });

  const modifyTaskIcon = createBox(modifyCardButton, "i", {
    classList: "fas fa-pencil-alt",
  });

  const tagsContainer = createBox(container, "div", {
    classList: "card__tag-container",
  });

  const dueDateElement = createBox(tagsContainer, "span", {
    classList: "card__tag card__due-date",
  });

  const priorityElement = createBox(tagsContainer, "span", {
    classList: "card__tag card__priority",
  });

  const projectElement = createBox(tagsContainer, "span", {
    classList: "card__tag card__project",
  });

  const notesElement = createBox(container, "p", {
    classList: "card__notes",
  });

  const cardDisplayIndicator = createBox(container, "i", {
    classList: "card__display-indicator fas fa-caret-up rotate-180",
  });

  // toggle card expanded/collapsed
  container.addEventListener("click", () => {
    displayElement("toggle", notesElement);
    setTimeout(() => cardDisplayIndicator.classList.toggle("rotate-180"), 50);
  });

  // toggle completed event listener
  checkmarkButton.addEventListener("click", (e) => {
    e.stopPropagation();
    onClickCheckAction(checkmarkIcon, container.getAttribute("data-unique-id"));
    container.classList.toggle("card--checked");
  });

  // delete button event listener
  deleteCardButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete Task?")) {
      container.remove();
      data.deleteTask(container.getAttribute("data-unique-id"));
    }
  });

  // calls action to expand and populate modify task form
  modifyCardButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const uid = container.getAttribute("data-unique-id");
    populateModifyForm(uid, populateCard);

    // expands search-form if main is
    if (findElement("#modify-task-form.expanded-height")) {
      return;
    } else {
      displayElement("collapse", ".sticky-form.expanded-height");
      setTimeout(displayElement, 200, "expand", "#modify-task-form");
    }
  });

  // populates card information with task object input
  const populateCard = (newTaskObj, options = {}) => {
    container.id = newTaskObj.uid;
    if (newTaskObj.isChecked) container.classList.add("card--checked");
    if ("display" in options) displayElement(options.display, notesElement);
    container.setAttribute("data-unique-id", newTaskObj.uid);
    setCheckStyles(checkmarkIcon, newTaskObj.isCompleted);
    titleElement.textContent = newTaskObj.title;
    setDueDateTagStyles(dueDateElement, newTaskObj.dueDate);
    setPriorityTagStyles(priorityElement, newTaskObj.priority);
    setProjectTagStyles(projectElement, newTaskObj.project);
    notesElement.textContent = newTaskObj.notes || "No notes";
  };

  return {
    populateCard,
  };
};

// checkmark button related functions and variables
const checkedClasses = ["far", "fa-check-square", "checked"];
const uncheckedClasses = ["far", "fa-square"];

const setCheckStyles = (targetElement, setChecked) => {
  if (setChecked) {
    setElementClass(targetElement, uncheckedClasses, checkedClasses);
  } else {
    setElementClass(targetElement, checkedClasses, uncheckedClasses);
  }
};

const onClickCheckAction = (targetElement, uid) => {
  const isChecked = targetElement.classList.contains("checked");
  setCheckStyles(targetElement, !isChecked);
  data.modifyTask({ uid, isCompleted: !isChecked });
};

// priority tag related function
const setPriorityTagStyles = (targetElement, inputPriority) => {
  if (!inputPriority) {
    targetElement.classList.add("display-none");
  } else {
    targetElement.classList.remove("display-none");

    const priorityClasses = [
      "card__priority--low",
      "card__priority--medium",
      "card__priority--high",
    ];
    const newPriorityClass = [`card__priority--${inputPriority}`];

    setElementClass(targetElement, priorityClasses, newPriorityClass);
    targetElement.textContent = capitalizeFirstLetter(inputPriority);
  }
};

// due date tag related functions
const setDueDateTagStyles = (targetElement, inputValue) => {
  if (!inputValue) {
    targetElement.classList.add("display-none");
  } else {
    targetElement.classList.remove("display-none");
    targetElement.textContent = getVerboseDate(inputValue, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

// project tag related function
const setProjectTagStyles = (targetElement, inputValue) => {
  if (!inputValue) {
    targetElement.classList.add("display-none");
  } else {
    targetElement.classList.remove("display-none");
    targetElement.textContent = inputValue;
  }
};

// utility functions
const setElementClass = (targetElement, oldClasses = [], newClasses = []) => {
  targetElement.classList.remove(...oldClasses);
  targetElement.classList.add(...newClasses);
};
