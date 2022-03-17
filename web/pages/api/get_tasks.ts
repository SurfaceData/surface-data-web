import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

import { getTaskCategoryMap, getTaskModeMap } from '@common/TaskUtils';
import type { Task, TaskCategory, TaskMode } from '@features/tasks';

const prisma = new PrismaClient();

const taskModeMap = await getTaskModeMap(prisma, 'shortName');
const taskCategoryMap = await getTaskCategoryMap(prisma, 'shortName', true);

interface RequestParams {
  primary: string,
  secondary: string,
  category: string, 
  mode: string, 
}

async function fetchTasksFromAnnotations(
  userId: string,
  primary: string,
  secondary: string,
  taskCategory: TaskCategory,
  taskMode: TaskMode) : Task[] {
  const annotations = await prisma.annotations.findMany({
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
  taskMode: TaskMode) : Task[] {
  const nextModeIndex = taskCategory.modes.findIndex( (m) => m.id === taskMode.id) + 1;
  const nextMode = taskCategory.modes[nextModeIndex];

  const content = await prisma.content.findMany({
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const { primary, secondary, category, mode } = req.query as RequestParams;
  const taskCategory = taskCategoryMap.get(category); 
  const taskMode = taskModeMap.get(mode); 

  let tasks: Task[] = [];
  if (!taskMode.useContent) {
    tasks = await fetchTasksFromAnnotations(
      session.userId, primary, secondary, taskCategory, taskMode);
  } else {
    tasks = await fetchTasksFromContent(
      session.userId, primary, secondary, taskCategory, taskMode);
  }

  res.status(200).json(tasks);
  return;
}
