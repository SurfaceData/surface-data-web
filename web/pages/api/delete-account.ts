import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user.email) {
    res.status(500);
    return;
  }
  const deleteUser = await prisma.user.delete({
    where: {
      email: session.user.email,
    }
  });
  res.status(200).end();
}

export default handler;
