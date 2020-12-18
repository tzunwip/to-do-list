import { createBox } from "./dom-elements";
import { Card } from "./dom-gen-card";
import { data } from "./data-controller";
import {
  getBreakDates,
  assembleDueDateCriteria,
  getVerboseDate,
  displayElement,
  findElement,
} from "./utility-functions";

// generates home layout
export const generateHome = () => {
  const body = document.querySelector("body");
  let main;

  if (findElement("main")) {
    main = document.querySelector("main");

    // clears main
    main.innerHTML = "";
  } else {
    main = createBox(body, "main");
  }

  // section break dates
  const breakDates = getBreakDates();

  const overdue = generateSection(main, {
    title: "Overdue",
    classList: "overdue",
    criteria: assembleDueDateCriteria(false, breakDates.now),
  });

  // add chevron collapsed/expanded indicator
  const overdueChevron = createBox(overdue.header, "i", {
    classList: "fas fa-chevron-down",
  });

  // hides overdue tasks on load
  displayElement("collapse", overdue.cardContainer);

  // onclick expands overdue tasks section and rotates chevron
  overdue.header.addEventListener("click", () => {
    displayElement("toggle", overdue.cardContainer);
    overdueChevron.classList.toggle("rotate-180");
  });

  // no due date tasks section
  const noDueDate = generateSection(main, {
    title: "No Due Date",
    classList: "no-date",
    criteria: assembleDueDateCriteria("", ""),
  });

  // add chevron collapsed/expanded indicator
  const noDueDateChevron = createBox(noDueDate.header, "i", {
    classList: "fas fa-chevron-down",
  });

  // hides no due date tasks by default
  displayElement("collapse", noDueDate.cardContainer);

  // onclick expands no due date tasks section and rotates chevron
  noDueDate.header.addEventListener("click", () => {
    displayElement("toggle", noDueDate.cardContainer);
    noDueDateChevron.classList.toggle("rotate-180");
  });

  // today's tasks section
  const today = generateSection(main, {
    title: "Today",
    classList: "today",
    criteria: assembleDueDateCriteria(breakDates.now, breakDates.endOfDay),
  });

  // returns ordering of weekday and weekend sections
  // as earlierDate and laterDate
  const weekCriteria = returnWeekCriteria(
    breakDates.endOfDay,
    breakDates.workweek,
    breakDates.weekend
  );

  // generates earlier week/weekend section only if there are
  // days remaining in section after today
  if (breakDates.endOfDay !== weekCriteria.earlierDays.dueDate.upperBound) {
    const earlyWeek = generateSection(main, {
      title: weekCriteria.earlierTitle,
      classList: "early-week",
      criteria: weekCriteria.earlierDays,
    });
  }

  // later week/weekend section
  const lateWeek = generateSection(main, {
    title: weekCriteria.laterTitle,
    classList: "late-week",
    criteria: weekCriteria.laterDays,
  });

  // gets long month name
  const verboseMonth = getVerboseDate(breakDates.monthEnd, { month: "long" });

  // next month section
  const month = generateSection(main, {
    title: `${verboseMonth}`,
    classList: "month",
    criteria: assembleDueDateCriteria(
      weekCriteria.laterDays.dueDate.upperBound,
      breakDates.monthEnd
    ),
  });

  // remaining tasks with due date
  const restDated = generateSection(main, {
    title: `Later`,
    classList: "others",
    criteria: assembleDueDateCriteria(breakDates.monthEnd),
  });
};

// generates individual sections
// input {criteria, classList}
// returns object of dom elements in section
const generateSection = (parent, input) => {
  const searchResult = data.getSearch(input.criteria);

  const container = createBox(parent, "section", {
    classList: `home-section ${input.classList}`,
  });

  const header = createBox(container, "div", {
    classList: `home-section__header ${input.classList}__header`,
  });

  const title = createBox(header, "h3", {
    classList: `home-section__title ${input.classList}__title`,
    textContent: input.title,
  });

  const trafficLights = createTrafficLights(header, searchResult);
  trafficLights.classList.add(`${input.classList}__priority-counter`);

  const cardContainer = createBox(container, "div", {
    classList: `home-section__card-container ${input.classList}__card-container`,
  });

  // does not display overdue or undated sections if empty
  if (
    (input.classList == "overdue" || input.classList == "no-date") &&
    searchResult.length == 0
  ) {
    container.classList.add("display-none");
  } else if (searchResult.length == 0) {
    createBox(cardContainer, "p", {
      classList: "home-section__empty",
      textContent: "No tasks here",
    });
  } else {
    generateCards(cardContainer, searchResult, { display: "collapse" });
  }

  return {
    container,
    header,
    title,
    cardContainer,
  };
};

// generates and populates multiple cards
// dataArray is an array of task objects
// options passed on to populateCard to customise
// card default behaviour
export const generateCards = (parent, dataArray, options) => {
  dataArray.forEach((obj) => {
    const newCard = Card(parent);

    newCard.populateCard(obj, options);
  });
};

// returns weekend/weekday break dates in chronological order
const returnWeekCriteria = (endOfDay, dayOne, dayTwo) => {
  let earlierDate;
  let laterDate;
  let earlierTitle;
  let laterTitle;

  if (dayOne < dayTwo) {
    earlierTitle = "This Week";
    laterTitle = "Weekend";
    earlierDate = dayOne;
    laterDate = dayTwo;
  } else {
    earlierTitle = "Sunday";
    laterTitle = "Next Monday to Friday";
    earlierDate = dayTwo;
    laterDate = dayOne;
  }

  return {
    earlierDays: assembleDueDateCriteria(endOfDay, earlierDate),
    laterDays: assembleDueDateCriteria(earlierDate, laterDate),
    earlierTitle,
    laterTitle,
  };
};

// generates search results title and cards
export const generateSearchResults = (inputArray) => {
  const main = document.querySelector("main");
  main.innerHTML = "";
  createBox(main, "h2", {
    classList: "search-results__header",
    textContent: "Search Results",
  });
  generateCards(main, inputArray, { display: "expand" });
};

// generates section priority counter traffic lights
const createTrafficLights = (parent, searchResult) => {
  let priorityCounter = { high: 0, medium: 0, low: 0, none: 0 };

  searchResult.forEach((task) => {
    priorityCounter[task.priority || "none"]++;
  });

  const container = createBox(parent, "div", {
    classList: "priority-counter",
  });

  for (let key in priorityCounter) {
    // skips generating light for zero values
    if (!priorityCounter[key]) continue;

    const light = createBox(container, "div", {
      classList: `priority-counter__light priority-counter__light--${key}`,
    });

    const numberText = createBox(light, "span", {
      textContent: priorityCounter[key],
    });
  }

  return container;
};
