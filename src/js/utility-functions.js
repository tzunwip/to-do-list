// returns next date of target day of the week
const getNextDayDate = (targetDay) => {
  const today = new Date()
  const todayDay = today.getDay()
  let dayOffset = targetDay - todayDay

  if (dayOffset < 0) dayOffset += 7

  let nextDate = new Date()
  nextDate.setDate(today.getDate() + dayOffset)
  nextDate.setHours(23, 59, 59)

  return nextDate
}

// get last date of month
const getMonthEndDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  return new Date(year, month + 1, 0)
}

// get break dates for each section
export const getBreakDates = () => {
  const now = new Date()
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  const workweek = getNextDayDate(5)
  workweek.setHours(23, 59, 59, 999)
  const weekend = getNextDayDate(0)
  weekend.setHours(23, 59, 59, 999)
  const todayPlusSevenDays = new Date().setDate(endOfDay.getDate() + 7)
  const monthEnd = getMonthEndDate(new Date(todayPlusSevenDays))
  monthEnd.setHours(23, 59, 59, 999)

  const breakDateArray = {
    now: now.toJSON(),
    endOfDay: endOfDay.toJSON(),
    workweek: workweek.toJSON(),
    weekend: weekend.toJSON(),
    monthEnd: monthEnd.toJSON(),
  }

  return breakDateArray
}

export const getVerboseDate = (date, options, locale = "default") => {
  if (date) {
    return new Intl.DateTimeFormat(locale, options).format(new Date(date))
  } else {
    return date
  }
}

export const getRandomISODate = () => {
  let start = new Date().setDate(new Date().getDate() - 14)
  let end = new Date().setMonth(new Date().getMonth() + 3)
  let randomInterval = (end - start) * Math.random()
  let randomDate = convertHTMLDateToISO(start + Math.floor(randomInterval))
  
  return randomDate
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// takes lowerBound and/or upperBound dates and returns formatted object
export const assembleDueDateCriteria = (lowerBound, upperBound) => {
  let obj = {dueDate: {}}

  if (lowerBound) {
    obj.dueDate["lowerBound"] = lowerBound
  }
  if (upperBound) {
    obj.dueDate["upperBound"] = upperBound
  }

  return obj
}

export const convertHTMLDateToISO = (htmlDate) => {
  if (htmlDate) {
    htmlDate = new Date(htmlDate)
    htmlDate.setHours(0, 0, 0, 0)
    return htmlDate.toISOString();
  } else {
    return htmlDate;
  }
};

export const convertISODateToMs = (ISODate) => {
  if (ISODate) {
    ISODate = new Date(ISODate)
    return ISODate.getTime()
  }
}

export const isSearchMode = () => {
  const overdue = document.querySelector(".overdue")
  return overdue ? false : true;
}

export const findElement = (string) => {
  const element = document.querySelector(string)
  return  element ? true : false;
};

export const removeElement = (string) => {
  const element = document.querySelector(string)
  if (element) {
    element.remove()
  }
}

export const displayElement = (command, element) => {
  const collapsedClass = "collapsed-height"
  const expandedClass = "expanded-height"

  // searches for element if input is string type
  if (typeof element == "string") {
    element = document.querySelector(element)
  }

  // does nothing is element is empty
  if (!element) return

  //
  if (command == "expand") {
    element.classList.add(expandedClass)
    element.classList.remove(collapsedClass)
  } else if (command == "collapse") {
    element.classList.add(collapsedClass)
    element.classList.remove(expandedClass)
  } else if (command == "toggle") {
    element.classList.toggle(collapsedClass)
    element.classList.toggle(expandedClass)
  }
}