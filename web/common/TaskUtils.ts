import type { TaskCategory, TaskMode } from '@features/tasks';

export async function getTaskCategoryMap(prisma, key='id', includeModes=false) {
  const taskCategories: TaskCategory[] = await prisma.taskCategory.findMany({
    include: {
      modes: includeModes
    }
  });
  return taskCategories.reduce( (result, mode) => {
    result.set(mode[key], mode);
    return result;
  }, new Map());
}

export async function getTaskModeMap(prisma, key = 'id') {
  const taskModes: TaskMode[] = await prisma.taskMode.findMany();
  return taskModes.reduce( (result, mode) => {
    result.set(mode[key], mode);
    return result;
  }, new Map());
}
