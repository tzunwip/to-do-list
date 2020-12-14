import { generateHome } from "./js/dom-gen-main";
import { generateControls } from "./js/dom-gen-controls";
import { generateFooter } from "./js/dom-gen-footer";
import { createNewTaskForm, createModifyTaskForm, createSearchForm } from "./js/dom-gen-forms";

const initialize = (() => {
  generateHome();
  generateControls();
  createNewTaskForm()
  createModifyTaskForm()
  createSearchForm()
  generateFooter();
})();