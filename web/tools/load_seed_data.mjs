import prismaPackage from '@prisma/client';
const { PrismaClient } = prismaPackage;
import sha256 from 'sha256';
import { opendir } from 'fs/promises';
import {parse, stringify} from 'bcp-47';
import {iso6393} from 'iso-639-3';
import nReadlines from 'n-readlines';

const prisma = new PrismaClient();

const bcpMap = iso6393.reduce( (result, code) => {
  if (code.iso6391) {
    result.set(code.iso6391, code);
  } else {
    result.set(code.iso6393, code);
  }
  return result;
}, new Map());

try {
  console.log('Clearing out all old data');
  await prisma.ratings.deleteMany({});
  await prisma.annotations.deleteMany({});
  await prisma.content.deleteMany({});

  console.log('Loading data for all languages');
  const dir = await opendir(`${process.env.SEED_PATH}/sentences`);
  for await (const dirent of dir) {
    const bcpSchema = parse(dirent.name);
    const isoCode = bcpMap.get(bcpSchema.language);

    const langPath = `${process.env.SEED_PATH}/sentences/${dirent.name}`;
    const langDir = await opendir(langPath);
    console.log(`Loading data for ${isoCode.iso6393} from directory ${dirent.name}`);
    for await (const langEnt of langDir) {
      const filePath = `${langPath}/${langEnt.name}`;
      const lines = new nReadlines(filePath);
      let line;
      const data = [];
      while (line = lines.next()) {
        const content = line.toString('utf-8');
        data.push({
          language: isoCode.iso6393,
          text: content,
          fprint: sha256(content),
        });
      }
      await prisma.content.createMany({
        data: data,
        skipDuplicates: true
      });
    }
  }

  console.log('Creating milestones for all languages');
  await prisma.taskMilestones.deleteMany({});
  const counts = await prisma.content.groupBy({
    by: ['language'],
  });

  const langCounts = await prisma.content.groupBy({
    by: ['language'],
    _count: {
      text: true,
    },
  });
  const data = langCounts.flatMap( ({_count, language}) => {
    console.log(`Creating milestones for ${language}`);
    const { text } = _count;
    const tagMilestone = text < 100 ? text : Math.floor(text * .10);
    const translateMilestone = text < 100 ? text : Math.floor(text * .05);
    const milestones = [];
    milestones.push({
      primaryLang: language,
      secondaryLang: language,
      taskId: 1,
      milestoneType: 'weekly',
      milestone: tagMilestone,
      progress: 0
    });
    if (language != 'eng') {
      milestones.push({
        primaryLang: language,
        secondaryLang: 'eng',
        taskId: 2,
        milestoneType: 'weekly',
        milestone: translateMilestone,
        progress: 0
      });
    } else {
      milestones.push({
        primaryLang: language,
        secondaryLang: 'spa',
        taskId: 2,
        milestoneType: 'weekly',
        milestone: translateMilestone,
        progress: 0
      });
      milestones.push({
        primaryLang: language,
        secondaryLang: 'jpn',
        taskId: 2,
        milestoneType: 'weekly',
        milestone: translateMilestone,
        progress: 0
      });
    }
    return milestones;
  });

  await prisma.taskMilestones.createMany({
    data: data,
    skipDuplicates: true
  });
} catch (err) {
  console.log(err);
}
