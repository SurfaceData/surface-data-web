import type { Task } from '@features/tasks';

export interface Language {
  language: string,
  tasks: Task[],
}
