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
  useContent?: boolean,
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
  tasks: TaskMeta[],
}

export interface TaskMeta {
  taskCategory: TaskCategory,
  taskMode: TaskMode,
  secondaryLang: string,
}
