import { TaskType } from '@features/tasks';

export interface LanguageStats {
  // A BCP-47 Language Code
  language: string,

  // An Array of statistics for each task requested.
  taskStats: TaskStats[],

  // An ordered array of aggregate statistics for tasks.
  timelineStats: TimelineStats[],

  // General information about the language.
  info: LanguageInfo,
}

export interface LanguageInfo {
  // A broad description about the language and its position on the internet.
  description: string,

  // A fun motivating fact about the language.
  funFact: string,
}

export interface TaskStats {
  // The task type being detailed.
  id: TaskType,

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