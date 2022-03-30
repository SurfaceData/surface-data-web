import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

import type { LanguageTasks } from '@features/tasks';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.userId) {
    res.status(500);
    return;
  }
  const userId = session.userId as string;
  const languages: LanguageTasks[] = req.body.languages;

  const languageCodes = languages.map( (item) => item.languageDisplay?.isoCode || '');

  await prisma.userLanguages.upsert({
    where: {
      id: userId,
    },
    update: {
      language: languageCodes,
    },
    create: {
      id: userId,
      language: languageCodes,
    }
  });
  await prisma.userLanguageTasks.deleteMany({
    where: {
      id: userId,
    }
  });
  await languages.forEach( async (item) => {
    const langCode = item.languageDisplay?.isoCode || '';
    const taskCategories = item.tasks.map( (task) => task.taskCategory.id);
    const taskModes = item.tasks.map( (task) => task.taskMode.id);
    const secondaryLangs = item.tasks.map( (task) => task.secondaryLang);

    await prisma.userLanguageTasks.upsert({
      where: {
        id_primaryLang: {
          id: userId,
          primaryLang: langCode,
        }
      },
      update: {
        taskCategories: taskCategories,
        taskModes: taskModes,
        secondaryLang: secondaryLangs,
      },
      create: {
        id: userId,
        primaryLang: langCode,
        taskCategories: taskCategories,
        taskModes: taskModes,
        secondaryLang: secondaryLangs,
      }
    });
  });
  res.status(200).end();
}

export default handler;
