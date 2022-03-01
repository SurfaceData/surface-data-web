import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ensure BigInt can be serialized to JSON.  We convert to string by default.
BigInt.prototype.toJSON = function() {       
    return this.toString()
}

interface RequestParams {
  sl: string,
  tl: number,
  annotType: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const { sl, tl, annotType } = req.query as RequestParams;

  const annotations = await prisma.annotations.findMany({
    // Fetch annotations where the user hasn't given a rating.
    where: {
      sourceLang: sl,
      targetLang: tl || '',
      annotType: parseInt(annotType, 10),
      ratings: {
        none: {
          user: {
            id: session.userId
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
          language: true
        }
      },
      targetLang: true,
      text: true,
      annotType: true,
    }
  });

  res.status(200).json(annotations);
}
