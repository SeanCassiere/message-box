import removeMd from "remove-markdown";

import { ITask } from "../interfaces/Task.interfaces";

export function truncateTextByLength(
  textString: string,
  options: { maxLength: number; includesDots: boolean } = { maxLength: 100, includesDots: false }
) {
  let returnString = textString;

  if (textString.length > options.maxLength) {
    returnString = textString.substring(0, options.maxLength); // truncate
    if (options.includesDots) {
      returnString += "...";
    }
  }

  return returnString;
}

export function markdownToForHtmlInsert(
  markdownInput: string,
  options: { doNotBreakLines: boolean } = { doNotBreakLines: false }
) {
  const text = removeMd(markdownInput);

  let returnText = "";
  if (options.doNotBreakLines) {
    returnText = text;
  } else {
    returnText = text.replaceAll(/\n/g, "<br />");
  }
  return returnText;
}

export function sortTasksByDateForColumn(tasks: ITask[]) {
  const inCompleteTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);
  const sortedTasks = (sortableTasks: ITask[]) => {
    return sortableTasks.sort((a, b) => {
      if (Date.parse(a.dueDate) < Date.parse(b.dueDate)) {
        return -1;
      }
      if (Date.parse(a.dueDate) > Date.parse(b.dueDate)) {
        return 1;
      }
      return 0;
    });
  };
  return [...sortedTasks(inCompleteTasks), ...sortedTasks(completedTasks)];
}
