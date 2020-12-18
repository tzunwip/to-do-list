import {
  getVerboseDate,
  convertHTMLDateToISO,
  convertISODateToMs,
  getRandomISODate,
} from "./utility-functions";

// data controller
export const data = (() => {
  let _dataArray = [];
  let uidCounter = 0;
  let tagIndex = {
    priority: { high: [], medium: [], low: [] },
    project: {},
  };

  // task factory function, assigns unique id
  const Task = ({
    title = "",
    project = "",
    dueDate = "",
    priority = "",
    notes = "",
  }) => {
    const uid = uidCounter++;

    return {
      uid,
      title,
      project,
      dueDate: convertHTMLDateToISO(dueDate),
      priority,
      notes,
      isCompleted: false,
    };
  };

  const addTask = (inputObj) => {
    const newTaskObj = Task(inputObj);

    _insertTask(newTaskObj);
    _updateTagIndex({ new: { ...newTaskObj } });

    return newTaskObj;
  };

  const deleteTask = (inputUid) => {
    const targetIndex = _getIndex(inputUid);

    _updateTagIndex({ old: _dataArray[targetIndex] });
    _pruneTagIndex();
    _dataArray.splice(targetIndex, 1);
  };

  const modifyTask = (inputTask) => {
    const index = _getIndex(inputTask.uid);
    let modifiedTask = { ..._dataArray[index] };

    deleteTask(inputTask.uid);

    // formats date if date exists and not Date format
    if ("dueDate" in inputTask && !(inputTask.dueDate instanceof Date)) {
      inputTask.dueDate = convertHTMLDateToISO(inputTask.dueDate);
    }

    for (let key in inputTask) {
      if (key !== "uid") {
        modifiedTask[key] = inputTask[key];
      }
    }

    _insertTask(modifiedTask);
    _updateTagIndex({ new: modifiedTask });
    _pruneTagIndex();

    return inputTask;
  };

  const _getIndex = (uid) => {
    return _dataArray.findIndex((obj) => obj.uid == uid);
  };

  const getAll = () => {
    return _dataArray;
  };

  // inserts taskObj in to _dataArray
  // by date then priority if existing date found
  const _insertTask = (taskObj) => {
    let insertIndex;

    if (_dataArray.length == 0) {
      _dataArray.push(taskObj);
    } else if (taskObj.dueDate && _dataArray[0].dueDate > taskObj.dueDate) {
      _dataArray.unshift(taskObj);
    } else {
      insertIndex = _findInsertIndex(taskObj);
      // findIndex returns -1 if no matches found
      // push taskObj to end of array if -1
      // else insert in to insertIndex
      if (insertIndex == -1) {
        _dataArray.push(taskObj);
      } else {
        _dataArray.splice(insertIndex, 0, taskObj);
      }
    }
  };

  const _findInsertIndex = (taskObj) => {
    return _dataArray.findIndex((curObj) => {
      // assign empty dueDates Infinity
      // undated tasks should inserted towards
      // end of array
      let curObjDueDate = curObj.dueDate
        ? convertISODateToMs(curObj.dueDate)
        : Infinity;
      let taskObjDueDate = taskObj.dueDate
        ? convertISODateToMs(taskObj.dueDate)
        : Infinity;

      if (curObjDueDate == taskObjDueDate) {
        // compares numeric values of priority
        const curObjPriority = _returnNumericPriority(curObj.priority);
        const taskObjPriority = _returnNumericPriority(taskObj.priority);
        return curObjPriority <= taskObjPriority;
      } else {
        return curObjDueDate > taskObjDueDate;
      }
    });
  };

  // converts priority to numeric value
  const _returnNumericPriority = (inputPriority) => {
    if (inputPriority) inputPriority = inputPriority.toLowerCase();
    switch (inputPriority) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  // returns array containing matching results
  // searchCriteria parameter format {key: ["search", "strings",...],}
  // dueDate key requires {lowerBound, upperBound} input
  const getSearch = (searchCriteria) => {
    let resultsArray = [..._dataArray];

    for (let key in searchCriteria) {
      resultsArray = resultsArray.filter((task) => {
        return _isMatching(key, task, searchCriteria);
      });
    }

    return resultsArray;
  };

  const getTagIndex = () => {
    return tagIndex;
  };

  // search logic
  // special logic for dueDate
  const _isMatching = (key, task, searchCriteria) => {
    const criteria = searchCriteria[key];

    if (criteria === "allValues") {
      return true;
    } else if (key === "dueDate") {
      if (!task[key] && !criteria.lowerBound && !criteria.upperBound) {
        return true;
      } else if (!task[key]) {
        // rejects empty task dueDate strings
        return false;
      } else if (!("lowerBound" in criteria) || !criteria.lowerBound) {
        return task[key] <= criteria.upperBound;
      } else if (!("upperBound" in criteria) || !criteria.upperBound) {
        return task[key] >= criteria.lowerBound;
      } else {
        return (
          task[key] >= criteria.lowerBound && task[key] <= criteria.upperBound
        );
      }
    } else if (key === "text") {
      const localeDate = getVerboseDate(task.dueDate, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const string = `${task.title} ${task.notes} ${localeDate} ${task.priority} priority ${task.project} project`.toLowerCase();

      return string.includes(criteria.toLowerCase());
    } else if (!criteria || !task[key]) {
      return criteria == task[key]; // cannot use === as uid may be number/string
    } else {
      return (
        task[key].toString().toLowerCase() === criteria.toString().toLowerCase()
      );
    }
  };

  // updates tagIndex uid arrays
  // obj parameter format {new: <new Task>, old: <old Task>}
  const _updateTagIndex = (obj) => {
    for (let key in tagIndex) {
      // removes oldObj uid from tagIndex properties
      // rejects empty or undefined values
      if (obj.old && key in obj.old && obj.old[key]) {
        let oldTagValue = obj.old[key];
        let {
          [key]: { [oldTagValue]: oldTagArray },
        } = tagIndex;

        const oldTargetIndex = oldTagArray.indexOf(obj.old.uid);

        oldTagArray.splice(oldTargetIndex, 1);
      }

      // adds newObj uid to tagIndex properties
      // rejects empty or undefined values
      if (obj.new && key in obj.new && obj.new[key]) {
        let newTagValue = obj.new[key];
        let {
          [key]: { [newTagValue]: newTagArray },
        } = tagIndex;

        // pushes uid to array if key exists
        // else creates key with new array
        if (obj.new[key] in tagIndex[key]) {
          newTagArray.push(obj.new.uid);
        } else {
          tagIndex[key][newTagValue] = [obj.new.uid];
        }
      }
    }
  };

  // deletes keys with empty arrays in tagIndex
  const _pruneTagIndex = () => {
    const excludedKeys = ["priority"];

    for (let tagIndexKey in tagIndex) {
      if (excludedKeys.includes(tagIndexKey)) continue;

      for (let tagItemKey in tagIndex[tagIndexKey]) {
        if (tagIndex[tagIndexKey][tagItemKey].length == 0) {
          delete tagIndex[tagIndexKey][tagItemKey];
        }
      }
    }
  };

  const getTagNameArray = (tag) => {
    return Object.keys(data.getTagIndex()[tag]).map((name) => {
      return {
        value: name,
        text: name,
      };
    });
  };

  return {
    addTask,
    deleteTask,
    modifyTask,
    getAll,
    getSearch,
    getTagIndex,
    getTagNameArray,
  };
})();

data.addTask({
  title: "task 0",
  notes: "some notes 1",
  project: "",
  dueDate: getRandomISODate(),
  priority: "high",
});
for (let i = 0; i < 10; i++) {
  data.addTask({
    title: "title 1",
    notes: "some notes 1",
    project: "",
    dueDate: getRandomISODate(),
    priority: "high",
  });
  data.addTask({
    title: "title 2",
    notes: "",
    project: "shopping",
    dueDate: getRandomISODate(),
    priority: "",
  });
  data.addTask({
    title: "title 3",
    notes: "some notes 3",
    project: "sports",
    dueDate: "",
    priority: "low",
  });
  data.addTask({
    title: "title 3",
    notes: "some notes 3",
    project: "sports",
    dueDate: "",
    priority: "medium",
  });
}
