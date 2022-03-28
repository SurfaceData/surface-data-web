import prismaPackage from '@prisma/client';
const { PrismaClient } = prismaPackage;

import sha256 from 'sha256';

const prisma = new PrismaClient();

const insertContent = async (text, language) => {
  return await prisma.content.create({
    data: {
      language: language,
      text: text,
      fprint: sha256(text),
    }
  });
}

const insertQualityLabel = async (source, label) => {
  return await prisma.annotations.create({
    data: {
      source: {
        connect: {
          fprint: source.fprint
        }
      },
      primaryLang: source.language,
      text: label,
      taskModeId: 3,
      taskCategoryId: 1,
    }
  });
}

const insertTranslation = async (source, target) => {
  return await prisma.annotations.create({
    data: {
      source: {
        connect: {
          fprint: source.fprint
        }
      },
      primaryLang: target.language,
      text: target.text,
      taskModeId: 2,
      taskCategoryId: 2,
    }
  });
}

const insertTranslationWithUser = async (source, target, user) => {
  return await prisma.annotations.create({
    data: {
      source: {
        connect: {
          fprint: source.fprint
        }
      },
      primaryLang: target.language,
      text: target.text,
      taskModeId: 2,
      taskCategoryId: 2,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });
}


const insertRating = async (annotation, user, rating) => {
  return await prisma.ratings.create({
    data: {
      annotation: {
        connect: {
          id: annotation.id,
        }
      },
      user: {
        connect: {
          id: user.id
        }
      },
      rating: rating
    }
  });
}

const insertMilestone = async (
  sourceLang,
  targetLang,
  taskCategoryId,
  taskModeId,
  milestoneType,
  milestone,
  progress
) => {
  return await prisma.taskMilestones.create({
    data: {
      primaryLang: targetLang,
      secondaryLang: sourceLang,
      taskCategoryId: taskCategoryId,
      taskModeId: taskModeId,
      milestoneType: milestoneType,
      milestone: milestone,
      progress: progress
    }
  });
}

// Always use the test user.
let user = await prisma.user.findUnique({
  where: {
    email: 'fozziethebeat@hey.com'
  }
});

await prisma.taskCategory.deleteMany();
await prisma.taskMode.deleteMany();

await prisma.taskMilestones.deleteMany();
await prisma.ratings.deleteMany();
await prisma.annotations.deleteMany();
await prisma.content.deleteMany();

// Insert task types.
await prisma.taskMode.createMany({
  data: [
    {
      id: 1, 
      shortName: 'Create', 
      fullName: 'Create', 
      description: 'Create new content' ,
      useContent: true,
    },
    {
      id: 2, 
      shortName: 'Verify',
      fullName: 'Verify', 
      description: 'Verify that content meets quality guidelines',
      useContent: false,
    },
    {
      id: 3,
      shortName: 'Rate',
      fullName: 'Rate',
      description: 'Rate the accuracy of an annotation',
      useContent: false,
    },
  ],
});
await prisma.taskCategory.create({
  data: {
    id: 1,
    shortName: 'QualityTag',
    fullName: 'Quality Tag',
    description: 'Apply quality tags to content',
    modes: {
      connect: [
        { id: 1 } ,
        { id: 3 },
      ],
    }
  }
})
await prisma.taskCategory.create({
  data: {
    id: 2,
    shortName: 'Translate',
    fullName: 'Translate',
    description: 'Translate content between languages',
    modes: {
      connect: [
        { id: 1 } ,
        { id: 2 },
      ],
    },
  }
});

// Insert the content.
const enContent1 = await insertContent('I have cats', 'eng');
const enContent2 = await insertContent('You have dogs', 'eng');
const enContent3 = await insertContent('Mame has plastic', 'eng');
const enContent4 = await insertContent('Trees have apples', 'eng');

for (var i = 0; i < 7; i++) {
  await insertContent(`'English Content ${i}`, 'eng');
}

const jaContent1 = await insertContent('私は猫を飼っています', 'jpn');
const jaContent2 = await insertContent('猫がいます', 'jpn');
const jaContent3 = await insertContent('あなたは犬を飼っています', 'jpn');
const jaContent4 = await insertContent('マメはプラスチックを持っています', 'jpn');

const esContent1 = await insertContent('tengo gatos', 'spa');

// Insert the annotations.
const en1Good = await insertQualityLabel(enContent1, 'good');
const en2Okay = await insertQualityLabel(enContent2, 'okay');
const en3Good = await insertQualityLabel(enContent3, 'good');
const en4Good = await insertQualityLabel(enContent4, 'good');

const en1ja1 = await insertTranslation(enContent1, jaContent1);
const en1ja2 = await insertTranslation(enContent1, jaContent2);
const en2ja3 = await insertTranslation(enContent2, jaContent3);
const en3ja4 = await insertTranslationWithUser(enContent3, jaContent4, user);

const en1es1 = await insertTranslation(enContent1, esContent1);

const ja1en3 = await insertTranslation(jaContent1, enContent3);

// Insert sample ratings.
await insertRating(en1ja1, user, 2);
await insertRating(en4Good, user, 1);

// Insert milestones.
await insertMilestone('eng', 'eng', 1, 1, 'weekly', 1000, 825);
await insertMilestone('eng', 'eng', 1, 3, 'weekly', 1000, 825);

await insertMilestone('jpn', 'jpn', 1, 1, 'weekly', 1000, 0);
await insertMilestone('jpn', 'jpn', 1, 3, 'weekly', 1000, 0);

await insertMilestone('spa', 'spa', 1, 1, 'weekly', 1000, 0);
await insertMilestone('spa', 'spa', 1, 3, 'weekly', 1000, 0);

await insertMilestone('eng', 'jpn', 2, 1,'weekly', 200, 139);
await insertMilestone('eng', 'jpn', 2, 2, 'weekly', 200, 139);
await insertMilestone('jpn', 'eng', 2, 1, 'weekly', 200, 28);
await insertMilestone('jpn', 'eng', 2, 2, 'weekly', 200, 28);

await insertMilestone('eng', 'spa', 2, 1, 'weekly', 200, 10);
await insertMilestone('eng', 'spa', 2, 2, 'weekly', 200, 10);
await insertMilestone('spa', 'eng', 2, 1, 'weekly', 200, 30);
await insertMilestone('spa', 'eng', 2, 2, 'weekly', 200, 30);
