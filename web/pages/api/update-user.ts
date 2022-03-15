import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const languages = req.body.languages;

  const languageCodes = languages.map( (item) => item.languageDisplay.isoCode);

  await prisma.userLanguages.upsert({
    where: {
      id: session.userId,
    },
    update: {
      language: languageCodes,
    },
    create: {
      id: session.userId,
      language: languageCodes,
    }
  });
  await prisma.userLanguageTasks.deleteMany({
    where: {
      id: session.userId,
    }
  });
  await languages.forEach( async (item) => {
    const langCode = item.languageDisplay.isoCode;
    const taskCategories = item.tasks.map( (task) => task.taskCategory.id);
    const taskModes = item.tasks.map( (task) => task.taskMode.id);
    const secondaryLangs = item.tasks.map( (task) => task.secondaryLang);

    await prisma.userLanguageTasks.upsert({
      where: {
        id_primaryLang: {
          id: session.userId,
          primaryLang: langCode,
        }
      },
      update: {
        taskCategories: taskCategories,
        taskModes: taskModes,
        secondaryLang: secondaryLangs,
      },
      create: {
        id: session.userId,
        primaryLang: langCode,
        taskCategories: taskCategories,
        taskModes: taskModes,
        secondaryLang: secondaryLangs,
      }
    });
  });
  res.status(200).end();
}
