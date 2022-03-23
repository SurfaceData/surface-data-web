import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

import { getNextTaskMode } from '@common/TaskUtils';
import type { Contribution } from '@features/contributions';

const prisma = new PrismaClient();

async function handleSkip(contribution: Contribution, userId: string) {
  const { taskCategory, taskMode, primaryLang } = contribution.taskMeta;
  const nextMode = getNextTaskMode(taskCategory, taskMode);
  if (taskMode.useContent) {
    await prisma.annotations.create({
      data: {
        source: {
          connect: {
            fprint: contribution.id
          }
        },
        author: {
          connect: {
            id: userId,
          }
        },
        primaryLang: primaryLang || '',
        text: '',
        taskModeId: nextMode.id,
        taskCategoryId: taskCategory.id,
        isComplete: true,
      }
    });
    return;
  }
  await prisma.ratings.create({
    data: {
      annotation: {
        connect: {
          id: BigInt(contribution.id),
        }
      },
      user: {
        connect: {
          id: userId,
        }
      },
      rating: 0,
    }
  });
}

async function handleRealContribution(contribution: Contribution, userId: string) {
  const { taskCategory, taskMode, primaryLang } = contribution.taskMeta;
  const nextMode = getNextTaskMode(taskCategory, taskMode);
  if (taskMode.useContent) {
    if (contribution.text) {
      await prisma.annotations.create({
        data: {
          source: {
            connect: {
              fprint: contribution.id
            }
          },
          author: {
            connect: {
              id: userId,
            }
          },
          primaryLang: primaryLang || '',
          text: contribution?.text || '',
          taskModeId: nextMode.id,
          taskCategoryId: taskCategory.id,
          isComplete: false,
        }
      });
    } else if (contribution.labels) {
      await prisma.annotations.createMany({
        data: contribution.labels.map( (label) => {
          return {
            sourceFprint: contribution.id,
            authorId: userId,
            primaryLang: primaryLang || '',
            text: label,
            taskModeId: nextMode.id,
            taskCategoryId: taskCategory.id,
            isComplete: false,
          };
        }),
      });
    }
    return;
  }
  await prisma.ratings.create({
    data: {
      annotation: {
        connect: {
          id: BigInt(contribution.id),
        }
      },
      user: {
        connect: {
          id: userId,
        }
      },
      rating: contribution?.rating || 0,
    }
  });
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.userId) {
    res.status(500).end();
    return;
  }

  const contribution: Contribution = req.body;
  if (!contribution.id ||
      !contribution.taskMeta.primaryLang) {
    res.status(400).end();
    return;
  }

  if (contribution.isSkip) {
    handleSkip(contribution, session.userId);
  } else {
    handleRealContribution(contribution, session.userId);
  }

  res.status(200).end();
};

export default handler;
