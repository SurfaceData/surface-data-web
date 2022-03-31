import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Prisma, PrismaClient } from "@prisma/client";

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
      language: languageCodes as Prisma.JsonArray,
    },
    create: {
      id: userId,
      language: languageCodes as Prisma.JsonArray,
    }
  });
  await prisma.userLanguageTasks.deleteMany({
    where: {
      id: userId,
    }
  });
  await languages.forEach( async (item) => {
    const langCode = item.languageDisplay?.isoCode || '';
    const taskMeta = item?.tasks?.map(({taskCategory, taskMode, secondaryLang}) => {
      return {
        category: taskCategory.id,
        mode: taskMode.id,
        secondary: secondaryLang,
      };
    }) || [];
    const taskMetaJson = taskMeta as Prisma.JsonArray;

    await prisma.userLanguageTasks.upsert({
      where: {
        id_primaryLang: {
          id: userId,
          primaryLang: langCode,
        }
      },
      update: {
        taskMeta: taskMetaJson,
      },
      create: {
        id: userId,
        primaryLang: langCode,
        taskMeta: taskMetaJson,
      }
    });
  });
  res.status(200).end();
}

export default handler;
