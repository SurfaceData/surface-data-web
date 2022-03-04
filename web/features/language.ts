import type { Task } from '@features/tasks';

export interface Language {
  language: string,
  tasks: Task[],
}

export interface LanguageDisplay {
  isoCode: string,
  isoName: string,
  cldrName: string,
  cldrSupported: boolean,
}
