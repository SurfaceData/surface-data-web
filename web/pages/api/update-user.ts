import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const languages = req.body.languages;

  await prisma.userLanguages.upsert({
    where: {
      id: session.userId,
    },
    update: {
      language: languages.map( (item) => item.language),
    },
    create: {
      id: session.userId,
      language: languages.map( (item) => item.language),
    }
  });
  languages.forEach( async (language) => {
    await prisma.userLanguageTasks.upsert({
      where: {
        id_language: {
          id: session.userId,
          language: language.language,
        }
      },
      update: {
        annotType: language.tasks,
      },
      create: {
        id: session.userId,
        language: language.language,
        annotType: language.tasks,
      }
    });
  });
  res.status(200);
}
