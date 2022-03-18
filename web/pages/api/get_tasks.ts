import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { Task, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

let taskModeMap: Map<string, TaskMode>;
let taskCategoryMap: Map<string, TaskCategory>
(async() => {
  taskModeMap = await getTaskModeMap(prisma, 'shortName');
  taskCategoryMap = await getTaskCategoryMap(prisma, 'shortName', true);
})();

async function fetchTasksFromAnnotations(
  userId: string,
  primary: string,
  secondary: string,
  taskCategory: TaskCategory,
  taskMode: TaskMode) : Promise<Task[]> {
  const annotations = await prisma.annotations.findMany({
    take: 10,
    // Fetch annotations where the user hasn't given a rating.
    where: {
      primaryLang: primary,
      taskCategoryId: taskCategory.id,
      taskModeId: taskMode.id,
      source: {
          language: secondary,
      },
      ratings: {
        none: {
          user: {
            id: userId
          }
        }
      }
    },
    // Select the key fields needed for contribution.
    select: {
      id: true,
      // Nest data about the source content.
      source: {
        select: {
          text: true,
        }
      },
      text: true,
    }
  });
  return annotations.map( (result) => {
    return {
      id: result.id.toString(),
      secondaryText: result.source.text,
      primaryText: result.text
    } as Task;
  });
}

async function fetchTasksFromContent(
  userId: string,
  primary: string,
  secondary: string,
  taskCategory: TaskCategory,
  taskMode: TaskMode) : Promise<Task[]> {
  if (!taskCategory.modes) {
    return [];
  }
  const nextModeIndex = taskCategory.modes.findIndex( (m) => m.id === taskMode.id) + 1;
  const nextMode = taskCategory.modes[nextModeIndex];

  const content = await prisma.content.findMany({
    take: 10,
    // Fetch annotations where the user hasn't given a rating.
    where: {
      language: secondary,
      annotations: {
        none: {
          primaryLang: primary,
          taskCategoryId: taskCategory.id,
          taskModeId: nextMode.id,
        }
      }
    },
    // Select the key fields needed for contribution.
    select: {
      fprint: true,
      text: true,
    }
  });
  return content.map( (result) => {
    return {
      id: result.fprint,
      secondaryText: result.text,
    } as Task;
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.userId) {
    res.status(500);
    return;
  }

  const primary = req.query['primary'] as string;
  const secondary = req.query['secondary'] as string;
  const category = req.query['category'] as string;
  const mode = req.query['mode'] as string;

  const taskCategory = taskCategoryMap.get(category); 
  const taskMode = taskModeMap.get(mode); 

  if (!taskCategory || !taskMode) {
    res.status(500);
    return;
  }

  let tasks: Task[] = [];
  const userId = session.userId as string;

  if (!taskMode.useContent) {
    tasks = await fetchTasksFromAnnotations(
      userId, primary, secondary, taskCategory, taskMode);
  } else {
    tasks = await fetchTasksFromContent(
      userId, primary, secondary, taskCategory, taskMode);
  }

  res.status(200).json(tasks);
  return;
}

export default handler;
