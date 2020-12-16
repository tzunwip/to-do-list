import { createBox, createDatalistElement, createSelectElement } from "./dom-elements";
import { data } from "./data-controller";
import { displayElement, convertHTMLDateToISO, getVerboseDate, isSearchMode } from "./utility-functions";
import { generateHome, generateSearchResults } from "./dom-gen-main";

// creates sticky-form used to add new task
export const createNewTaskForm = () => {
  const newTaskStickyForm = StickyForm("new-task-form", "sticky-form");

  // populate new task form
  newTaskStickyForm.formHeader.textContent = "New Task";

  // new-task-form event listeners
  newTaskStickyForm.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formInputs = e.target.elements;

    // pushes form inputs to data.addTask()
    // data.addTask() returns validated Task() object
    const newTaskObj = data.addTask({
      title: formInputs.title.value,
      project: formInputs.project.value,
      dueDate: formInputs.dueDate.value,
      priority: formInputs.priority.value,
      notes: formInputs.notes.value,
    });

    // check for valid return from data.addTask()
    if (newTaskObj) {
      // form remains present with title and notes textarea emptied
      formInputs.title.value = "";
      formInputs.notes.value = "";

      generateHome()

      // scrolls in to view and expands newly generated card
      // expands section if collapsed
      const newCard = document.getElementById(newTaskObj.uid)
      if (newCard.parentNode.classList.contains("collapsed-height")) {
        displayElement("expand", newCard.parentNode)
      }
      displayElement("expand", newCard.querySelector(".card__notes"))
      newCard.scrollIntoView(true);
    }
  });

  newTaskStickyForm.closeButton.addEventListener("click", () => {
    if (isSearchMode()) {
      displayElement("collapse", "#new-task-form")
      setTimeout(displayElement, 200, "expand", "#search-form")
    } else {
      displayElement("collapse", "#new-task-form")
    }
  })

  const stickyContainer = document.querySelector(".sticky-container");
  stickyContainer.appendChild(newTaskStickyForm.form);
};

// creates sticky-form used to modify existing tasks
export const createModifyTaskForm = () => {
  const modifyTaskStickyForm = StickyForm("modify-task-form", "sticky-form");

  // modify-task-form event listeners
  modifyTaskStickyForm.closeButton.addEventListener("click", () => {
    if (isSearchMode()) {
      displayElement("collapse", "#modify-task-form")
      setTimeout(displayElement, 200, "expand", "#search-form")
    }
    displayElement("collapse", "#modify-task-form")
  })

  const stickyContainer = document.querySelector(".sticky-container");
  stickyContainer.appendChild(modifyTaskStickyForm.form);
};

// populates modify task form
export const populateModifyForm = (uid, populateCardCallback) => {
  const formNode = document.querySelector("#modify-task-form")
  // gets task object from data controller
  const inputTaskObj = data.getSearch({uid})[0]

  // define modify task form dom elements
  const formHeader = formNode.querySelector(".sticky-form__header") ;
  const titleTextArea = formNode.querySelector(".sticky-form__title") ;
  const projectTextArea = formNode.querySelector(".sticky-form__project") ;
  const dueDateInput = formNode.querySelector(".sticky-form__due-date") ;
  const priorityOptions =  {
    high: formNode.querySelector("#modify-task-form-priority-input option[value=high]"),
    medium: formNode.querySelector("#modify-task-form-priority-input option[value=medium]"),
    low: formNode.querySelector("#modify-task-form-priority-input option[value=low]"),
    none: formNode.querySelector(`#modify-task-form-priority-input option[value=""]`),
    selected: formNode.querySelector("#modify-task-form-priority-input option[selected]"), // targets the option currently selected
  };
  const notesTextArea = formNode.querySelector(".sticky-form__notes") ;

  // fill/select modify task form input fields
  formHeader.textContent = "Modify Task";

  titleTextArea.defaultValue = inputTaskObj.title;
  titleTextArea.value = inputTaskObj.title;

  projectTextArea.value = inputTaskObj.project;
  projectTextArea.defaultValue = inputTaskObj.project;

  // "sv" locale returns YYYY-MM-DD format date
  const dueDateLocal = getVerboseDate(inputTaskObj.dueDate, {}, "sv")
  dueDateInput.value = dueDateLocal
  dueDateInput.defaultValue = dueDateLocal

  // deselects any selected option attribute
  if (priorityOptions.selected) {
    priorityOptions.selected.defaultSelected = false
  }
  priorityOptions[inputTaskObj.priority || "none"].defaultSelected = true;

  notesTextArea.value = inputTaskObj.notes;
  notesTextArea.defaultValue = inputTaskObj.notes;

  // adds updated modify form submit action event listener
  // !! do not use addEventListener as multiple submit actions can be layered
  formNode.onsubmit = (e) => modifyFormSubmitAction(e, uid, populateCardCallback)
}

// action called on modify task form submit button click
const modifyFormSubmitAction = (e, uid, populateCardCallback) => {
  e.preventDefault();

  const formInputs = e.target.elements;

  // constructs modified task object and sends to data-controller
  const modifiedTaskObj = data.modifyTask({
    uid,
    title: formInputs.title.value,
    project: formInputs.project.value,
    dueDate: formInputs.dueDate.value,
    priority: formInputs.priority.value,
    notes: formInputs.notes.value,
  });

  displayElement("collapse", "#modify-task-form")

  // displays search form if in search mode
  // else generates home page
  if (modifiedTaskObj && isSearchMode()) {
    // populates card and expands card
    populateCardCallback(modifiedTaskObj, {display: "expand"})
    // shows form
    setTimeout(displayElement, 200, "expand", "#search-form")
  } else if (modifiedTaskObj) {
    // generates entire main with home layout
    generateHome()
    
    // scrolls to modified card, expands card and section 
    const modifiedCard = document.getElementById(modifiedTaskObj.uid)
    if (modifiedCard.parentNode.classList.contains("collapsed-height")) {
      displayElement("expand", modifiedCard.parentNode)
    }
    displayElement("expand", modifiedCard.querySelector(".card__notes"))
    modifiedCard.scrollIntoView(true);
  }
}

// creates search-form
export const createSearchForm = () => {
  // search-form dom elements
  const formClass = "sticky-form";
  const formName = "search-form";
  const newSearchForm = StickyForm(formName, formClass);

  // appends additional date input to search for upperBound dates
  const toDueDateContainer = createBox(false, "div", {
    classList: `${formClass}__due-date-to-container`,
  });

  const toDueDateLabel = createBox(toDueDateContainer, "label", {
    htmlFor: `${formName}-due-date-input-to`,
    textContent: "To:",
    ariaLabel: "Due Date to",
  });

  const toDueDateInput = createBox(toDueDateContainer, "input", {
    classList: `${formClass}__due-date-to`,
    type: "date",
    id: `${formName}-due-date-input-to`,
    name: "dueDateTo",
  });

  toDueDateInput.addEventListener("input", () => {
    if (newSearchForm.dueDateInput.value > toDueDateInput.value) {
      toDueDateInput.setCustomValidity("End Date cannot be earlier than Start Date")
    }
  })

  // inserts upperBound date input after lowerBound date input
  newSearchForm.form.insertBefore(
    toDueDateContainer,
    newSearchForm.dueDateInput.parentNode.nextSibling
  );

  // task project dropdown selection
  const projectContainer = createBox(false, "div", {
    classList: `${formClass}__project-container`,
  })

  const projectLabel = createBox(projectContainer, "label", {
    htmlFor: `${formName}-project`,
    textContent: "Project",
  })

  // gets array of all existing project names
  const projectNameArray = data.getTagNameArray("project")

  // adds dropdown option to search all priorites
  // and search none
  projectNameArray.unshift({value: "allValues", text: "All"})
  projectNameArray.push({value: "", text: "None"})

  // generates existing project dropdown selection element
  const projectSelect = createSelectElement(
    projectContainer,
    {
      classList: `${formClass}__project-select`,
      name: "project",
      id: `${formName}-project`
    },
    projectNameArray
  );

  newSearchForm.form.insertBefore(
    projectContainer,
    newSearchForm.dueDateInput.parentNode
  );

  // amends first dropdown option from "" to "All"
  newSearchForm.prioritySelect[""].value = "allValues";
  newSearchForm.prioritySelect[""].textContent = "All";

  const noPriorityOption = createBox(false, "option", {
    value: "",
    textContent: "None",
  })

  // appends no priority option after low option
  newSearchForm.prioritySelect.selectElement.insertBefore(noPriorityOption, newSearchForm.prioritySelect["low"].nextSibling)

  // modifies/removes existing form template elements
  newSearchForm.formHeader.textContent = "Search"
  newSearchForm.titleTextArea.name = "text";
  newSearchForm.titleTextArea.placeholder = "Search title and notes...";
  newSearchForm.titleTextArea.ariaLabel = "Search for title and notes";
  newSearchForm.titleTextArea.required = false;
  newSearchForm.projectTextArea.remove();
  newSearchForm.dueDateLabel.textContent = "From:";
  newSearchForm.dueDateLabel.htmlFor = `${formName}-due-date-input-from`;
  newSearchForm.dueDateInput.id = `${formName}-due-date-input-from`;
  newSearchForm.dueDateInput.name = "dueDateFrom";
  newSearchForm.notesTextArea.remove();
  newSearchForm.submitButton.textContent = "Search";

  // search-form event listeners
  newSearchForm.form.addEventListener("submit", (e) => {
    e.preventDefault()
    window.scrollTo(0,0)

    const formInputs = e.target.elements

    const searchCriteria = {
      text: formInputs.text.value || "allValues",
      project: formInputs.project.value,
      dueDate: {
        lowerBound: convertHTMLDateToISO(formInputs.dueDateFrom.value),
        upperBound: convertHTMLDateToISO(formInputs.dueDateTo.value),
      },
      priority: formInputs.priority.value,
    };
    if (!formInputs.dueDateFrom.value && !formInputs.dueDateTo.value) {
      searchCriteria.dueDate = "allValues"
    }

    const searchResults = data.getSearch(searchCriteria)
    generateSearchResults(searchResults)
  })

  newSearchForm.closeButton.addEventListener("click", () => {
    if (!isSearchMode()) {
      displayElement("collapse", newSearchForm.form)
    } else {
      displayElement("collapse", newSearchForm.form)
      generateHome()
      window.scrollTo(0,0)
    }

    newSearchForm.form.reset();
  })

  const stickyContainer = document.querySelector(".sticky-container")
  stickyContainer.appendChild(newSearchForm.form);
};

// Form factory function
const StickyForm = (formName, formClass, display = "collapse") => {
  // Form dom elements
  const form = createBox(false, "form", {
    classList: `${formName} ${formClass}`,
    id: formName,
  });
  displayElement(display, form)

  const formHeader = createBox(form, "h3", {
    classList: `${formClass}__header`,
  });

  const titleTextArea = createBox(form, "input", {
    classList: `${formClass}__title`,
    required: true,
    ariaLabel: "Title Input",
    name: "title",
    type: "text",
    autocomplete: "off",
    placeholder: "Title...",
  });

  const projectTextArea = createBox(form, "input", {
    classList: `${formClass}__project`,
    ariaLabel: "Project Input",
    name: "project",
    type: "list",
    placeholder: "Project...",
    list: "project-datalist",
  });

  const projectDatalist = createDatalistElement(form, {
    id: "project-datalist",
  }, data.getTagNameArray("project"))

  const dueDateContainer = createBox(form, "div", {
    classList: `${formClass}__due-date-container`,
  });

  const dueDateLabel = createBox(dueDateContainer, "label", {
    htmlFor: `${formName}-due-date-input`,
    textContent: "Due Date:",
  });

  const dueDateInput = createBox(dueDateContainer, "input", {
    classList: `${formClass}__due-date`,
    type: "date",
    id: `${formName}-due-date-input`,
    name: "dueDate",
  });

  const priorityContainer = createBox(form, "div", {
    classList: `${formClass}__priority-container`,
  });

  const priorityLabel = createBox(priorityContainer, "label", {
    htmlFor: `${formName}-priority-input`,
    textContent: "Priority:",
  });

  const prioritySelect = createSelectElement(
    priorityContainer,
    {
      id: `${formName}-priority-input`,
      name: "priority",
    },
    [
      { value: "", textContent: "None" },
      { value: "high", textContent: "High" },
      { value: "medium", textContent: "Medium" },
      { value: "low", textContent: "Low" },
    ]
  );

  const notesTextArea = createBox(form, "textarea", {
    classList: `${formClass}__notes`,
    ariaLabel: "Additional Notes Input",
    name: "notes",
    placeholder: "Notes...",

  });

  const controlsContainer = createBox(form, "div", {
    classList: `${formClass}__controls-container`,
  });

  const submitButton = createBox(controlsContainer, "button", {
    type: "submit",
    textContent: "Save",
  });

  const resetButton = createBox(controlsContainer, "button", {
    type: "reset",
    textContent: "Reset",
  });

  const closeButton = createBox(controlsContainer, "button", {
    type: "button",
    textContent: "Close",
  });

  return {
    form,
    formHeader,
    titleTextArea,
    projectTextArea,
    dueDateLabel,
    dueDateInput,
    prioritySelect,
    notesTextArea,
    submitButton,
    closeButton,
  };
};
