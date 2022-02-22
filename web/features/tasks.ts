export interface Task {
  id: TaskType,
  label: string,
}

export enum TaskType {
  UNKNOWN = 0,
  TAG,
  TRANSLATION,
}

export function stringToTaskType(input: string): TaskType {
  return parseInt(input, 10) as TaskType;
}

export const TaskLabels = {
  [TaskType.UNKNOWN]: "",
  [TaskType.TAG]: "Content labeling",
  [TaskType.TRANSLATION]: "Translation",
};
