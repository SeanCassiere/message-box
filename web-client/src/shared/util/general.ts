import removeMd from "remove-markdown";

import { ITask } from "../interfaces/Task.interfaces";

export function truncateTextByLength(
  textString: string,
  options: { maxLength: number; includesDots: boolean } = { maxLength: 100, includesDots: true }
) {
  let returnString = textString;
  const { maxLength, includesDots } = options;

  if (textString.length > maxLength) {
    returnString = textString.substring(0, maxLength); // truncate
    if (includesDots) {
      returnString += "...";
    }
  }

  return returnString;
}

export function markdownToForHtmlInsert(markdownInput: string) {
  const text = removeMd(markdownInput);
  const convertNewLines = text.replaceAll(/\n/g, "<br />");
  return convertNewLines;
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
