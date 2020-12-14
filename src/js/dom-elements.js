export const createBox = (parent, tag, attributes = {}) => {
  const newBox = document.createElement(`${tag}`);

  // checks if any input attributes exist, else skip to appendChild
  if (attributes) {
    // iterates over each key:value pair and assigns attributes
    // using existing DOMElement properties or setAttribute method
    for(let key in attributes) {
      let value = attributes[key];

      if (key in newBox) {
        newBox[key] = value;
      } else {
        newBox.setAttribute(key, value);
        console.log(newBox);
        console.log(`used setAttribute for ${key}: ${value}`);
      };
    };
  };

  if (parent) parent.appendChild(newBox);

  return newBox;
};

export const createSelectElement = (parent, selectProps, optionArray) => {
  const selectElement = createBox(parent, "select", { ...selectProps });

  const optionElements = {};

  optionArray.forEach((obj) => {
    const option = createBox(selectElement, "option", { ...obj });

    optionElements[obj.value] = option;
  });

  return { selectElement, ...optionElements };
};