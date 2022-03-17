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
