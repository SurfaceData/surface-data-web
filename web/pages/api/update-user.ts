import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  await prisma.user.update({
    where: {
      email: session.user.email
    },
    data: {
      languages: req.body.languages
    }
  });
  res.status(200);
}
