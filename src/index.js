import { generateHome } from "./js/dom-gen-main";
import { generateControls } from "./js/dom-gen-controls";
import { generateFooter } from "./js/dom-gen-footer";
import {
  createNewTaskForm,
  createModifyTaskForm,
  createSearchForm,
} from "./js/dom-gen-forms";
import { data } from "./js/data-controller";
import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
import "./css/normalize.css";
import "./css/backgrounds.css";
import "./css/main.css";

const initialize = (() => {
  data.getDataFromStorage();
  generateHome();
  generateControls();
  createNewTaskForm();
  createModifyTaskForm();
  createSearchForm();
  generateFooter();
})();
