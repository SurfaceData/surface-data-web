import type { LanguageDisplay } from '@features/language';
import type { TaskCategory, TaskMode } from '@features/tasks';

export interface LanguageStats {
  // The full language details,
  language: LanguageDisplay,

  // An Array of statistics for each task requested.
  taskStats: TaskStats[],

  // An ordered array of aggregate statistics for tasks.
  timelineStats: TimelineStats[],
}

export interface TaskStats {
  // Task type metadata.
  secondaryLang: LanguageDisplay,
  taskCategory: TaskCategory,
  taskMode: TaskMode,

  // The next numeric milestone to be achieved.
  nextMilestone: number,

  // The amount of progress towards the next milestone.
  progress: number,

  // The type of milestone being reported.
  // Options are:
  //  - "weekly"
  //  - "cumulative"
  milestoneType: string,
}

export interface TimelineStats {
  // A datetime string for the task stats recorded.
  date: string,

  taskTotals: TaskStats[],
}
