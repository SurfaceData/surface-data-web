import type { LanguageDisplay } from '@features/language';

export interface TaskMode {
  id: number,
  shortName?: string,
  fullName?: string,
  description?: string,
}

export interface TaskCategory {
  id: number,
  shortName?: string,
  fullName?: string,
  description?: string,
  modes?: TaskMode[],
}

export interface LanguageTasks {
  language: string,
  languageDisplay: LanguageDisplay,
  tasks: Task[],
}

export interface Task {
  id: TaskType,
  label?: string,
  secondaryLang: LanguageDisplay,
}

export enum TaskType {
  TAG = 1,
  TRANSLATION,
}

export const Tasks = [ TaskType.TAG, TaskType.TRANSLATION ];

export function stringToTaskType(input: string): TaskType {
  return parseInt(input, 10) as TaskType;
}

export const TaskLabels = {
  [TaskType.TAG]: "Content Quality Rating",
  [TaskType.TRANSLATION]: "Translation",
};

export const TaskDescriptions = {
  [TaskType.TAG]: "Determine whether content meets basic quality standards in your language.",
  [TaskType.TRANSLATION]: "Translate words, phrases, and sentences between languages.",
};
