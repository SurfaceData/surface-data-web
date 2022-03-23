import type { TaskMeta } from '@features/tasks';

export interface Contribution {
  // The ID of the content or annotation being answered.
  id: string,

  // The task type information.
  taskMeta: TaskMeta

  // True if the contribution is a skip.
  isSkip?: boolean,

  // If set, the text representing an annotation on top of the original
  // content.
  text?: string,

  // If set, represents a list of labels.
  labels?: string[],

  // If set, the numeric rating for an annotation.
  rating?: number,
}
