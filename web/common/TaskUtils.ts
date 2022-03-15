import type { TaskCategory, TaskMode } from '@features/tasks';

export async function getTaskCategoryMap(prisma) {
  const taskCategories: TaskCategory[] = await prisma.taskCategory.findMany();
  return taskCategories.reduce( (result, mode) => {
    result.set(mode.id, mode);
    return result;
  }, new Map());
}

export async function getTaskModeMap(prisma) {
  const taskModes: TaskMode[] = await prisma.taskMode.findMany();
  return taskModes.reduce( (result, mode) => {
    result.set(mode.id, mode);
    return result;
  }, new Map());
}
