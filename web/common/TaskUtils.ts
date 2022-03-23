import { PrismaClient } from '@prisma/client'

import type { TaskCategory, TaskMode } from '@features/tasks';

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

export async function getTaskCategoryMap(
  prisma: PrismaClient,
  key="id",
  includeModes=false) {
  const taskCategories: TaskCategory[] = await prisma.taskCategory.findMany({
    include: {
      modes: includeModes
    }
  });
  return taskCategories.reduce( (result, mode) => {
    result.set(getProperty(mode, key as keyof TaskCategory) , mode);
    return result;
  }, new Map());
}

export async function getTaskModeMap(
  prisma: PrismaClient,
  key = 'id') {
  const taskModes: TaskMode[] = await prisma.taskMode.findMany();
  return taskModes.reduce( (result, mode) => {
    result.set(getProperty(mode, key as keyof TaskMode), mode);
    return result;
  }, new Map());
}

export function getNextTaskMode(
  category: TaskCategory, mode: TaskMode): TaskMode {
  // If no modes are defined, we can't return anything sensible.  So we assume
  // the next mode will be the null end state mode.
  if (!category.modes) {
    return {
      id: 0
    } as TaskMode;
  }
  const nextModeIndex = category.modes.findIndex( (m) => m.id === mode.id) + 1;
  // When no next mode exists, we've gone through all possible modes.  Return
  // the null end state mode.
  if (nextModeIndex >= category.modes.length) {
    return {
      id: 0
    } as TaskMode;
  }
  return category.modes[nextModeIndex];
}
