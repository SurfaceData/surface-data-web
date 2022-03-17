import type { LanguageDisplay } from '@features/language';

export interface Task {
  id: string,
  secondaryText: string,
  primaryText?: string,
}

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
  taskCategory: TaskCategory,
  taskMode: taskMode,
  secondaryLang: LanguageDisplay,
}
