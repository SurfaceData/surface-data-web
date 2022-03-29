module.exports = {
  locales: ['en', 'ja', 'es', 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'translations/locales/{locale}/messages',
      include: [
        'components',
        'pages',
      ],
    },
  ],
  format: 'po',
};
