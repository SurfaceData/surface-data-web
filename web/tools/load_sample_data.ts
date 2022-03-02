const { PrismaClient } = require("@prisma/client");
const sha256 = require("sha256");

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
      sourceLang: source.language,
      targetLang: source.language,
      text: label,
      annotType: 1,
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
      sourceLang: source.language,
      targetLang: target.language,
      text: target.text,
      annotType: 2,
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
  taskType,
  milestoneType,
  milestone,
  progress
) => {
  return await prisma.taskMilestones.create({
    data: {
      language: sourceLang,
      targetLang: targetLang,
      taskId: taskType,
      milestoneType: milestoneType,
      milestone: milestone,
      progress: progress
    }
  });
}

const insertLanguageDetail = async(language, description) => {
  return await prisma.languageDetails.create({
    data: {
      language: language,
      description: description
    }
  });
}

const insertLanguageFunFact = async(language, funfact) => {
  return await prisma.languageFunFacts.create({
    data: {
      language: language,
      fact: funfact
    }
  });
}

(async () => {
  // Always use the test user.
  let user = await prisma.user.findUnique({
    where: {
      email: "fozziethebeat@hey.com"
    }
  });

  // Clear all relevant data.
  await prisma.ratings.deleteMany({});
  await prisma.annotations.deleteMany({});
  await prisma.content.deleteMany({});
  await prisma.taskMilestones.deleteMany({});
  await prisma.languageDetails.deleteMany({});
  await prisma.languageFunFacts.deleteMany({});

  // Insert the content.
  const enContent1 = await insertContent('I have cats', 'en');
  const enContent2 = await insertContent('You have dogs', 'en');
  const enContent3 = await insertContent('Mame has plastic', 'en');
  const enContent4 = await insertContent('Trees have apples', 'en');

  const jaContent1 = await insertContent('私は猫を飼っています', 'ja');
  const jaContent2 = await insertContent('猫がいます', 'ja');
  const jaContent3 = await insertContent('あなたは犬を飼っています', 'ja');
  const jaContent4 = await insertContent('マメはプラスチックを持っています', 'ja');

  const esContent1 = await insertContent('tengo gatos', 'es');

  // Insert the annotations.
  const en1Good = await insertQualityLabel(enContent1, "good");
  const en2Okay = await insertQualityLabel(enContent2, "okay");
  const en3Good = await insertQualityLabel(enContent3, "good");
  const en4Good = await insertQualityLabel(enContent4, "good");

  const en1ja1 = await insertTranslation(enContent1, jaContent1);
  const en1ja2 = await insertTranslation(enContent1, jaContent2);
  const en2ja3 = await insertTranslation(enContent2, jaContent3);
  const en3ja4 = await insertTranslation(enContent3, jaContent4);

  const en1es1 = await insertTranslation(enContent1, esContent1);

  const ja1en3 = await insertTranslation(jaContent1, enContent3);

  // Insert sample ratings.
  await insertRating(en1ja1, user, 2);
  await insertRating(en4Good, user, 1);

  // Insert milestones.
  await insertMilestone("en", "en", 1, "weekly", 1000, 825);
  await insertMilestone("ja", "ja", 1, "weekly", 1000, 0);
  await insertMilestone("es", "es", 1, "weekly", 1000, 0);

  await insertMilestone("en", "ja", 2, "weekly", 200, 139);
  await insertMilestone("ja", "en", 2, "weekly", 200, 28);

  await insertMilestone("en", "es", 2, "weekly", 200, 10);
  await insertMilestone("es", "en", 2, "weekly", 200, 30);

  // Insert language info.
  await insertLanguageDetail(
    'en', "A West Germanic language of the Indo-European language family");
  await insertLanguageDetail('ja', "The primary language of Japan");
  await insertLanguageDetail('es', "A romance language");

  await insertLanguageFunFact('en', '1.5 billion speakers');
  await insertLanguageFunFact('ja', '128 million speakers');
  await insertLanguageFunFact('es', '500 million speakers');
})();
