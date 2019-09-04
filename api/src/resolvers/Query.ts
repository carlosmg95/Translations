import log from '../utils/log';

const LITERAL_PER_PAGE: number = 3;

enum Filter {
  ALL,
  TRANSLATED,
  NO_TRANSLATED,
}

const Query = {
  // Functions
  async getLiteralsPages(parent, { where, filter, search }, { prisma }, info) {
    where = prepareLiteralsWhere(where, filter, search);

    const literalsAggregate = await prisma.query.literalsConnection(
      { where },
      '{ aggregate { count }}',
    );
    const literalsCount: number = literalsAggregate.aggregate.count;
    const pages: number = Math.ceil(literalsCount / LITERAL_PER_PAGE) || 1;
    log.query('Query: getLiteralsPages');
    return { pages };
  },
  // Types
  user(parent, { where }, { prisma }, info) {
    log.query('Query: user');
    return prisma.query.user(where, info);
  },
  users(parent, { where }, { prisma }, info) {
    log.query('Query: users');
    return prisma.query.users(where, info);
  },
  project(parent, { where }, { prisma }, info) {
    log.query('Query: project');
    return prisma.query.project(where, info);
  },
  projects(parent, { where }, { prisma }, info) {
    log.query('Query: projects');
    return prisma.query.projects(where, info);
  },
  language(parent, { where }, { prisma }, info) {
    log.query('Query: language');
    return prisma.query.language(where, info);
  },
  languages(parent, { where }, { prisma }, info) {
    log.query('Query: languages');
    return prisma.query.languages(where, info);
  },
  literals(parent, { where, page, filter, search }, { prisma }, info) {
    log.query('Query: literals');

    let args = {
      where: prepareLiteralsWhere(where, filter, search),
      first: LITERAL_PER_PAGE,
      skip: (page - 1) * LITERAL_PER_PAGE,
    };

    return prisma.query.literals(args, info);
  },
  translations(parent, { where }, { prisma }, info) {
    log.query('Query: translations');
    return prisma.query.translations(where, info);
  },
};

const prepareLiteralsWhere = (where, filter: Filter, search: string) => {
  if (filter === Filter.NO_TRANSLATED) {
    where = {
      ...where,
      AND: [
        {
          OR: [
            {
              literal_contains: search,
            },
            {
              as_in_contains: search,
            },
            {
              translations_some: {
                translation_contains: search,
              },
            },
          ],
        },
        {
          OR: [
            {
              translations_some: {
                translation: '',
                language: {
                  id: where.language.id,
                },
              },
            },
            {
              translations_none: {
                language: {
                  id: where.language.id,
                },
              },
            },
          ],
        },
      ],
    };
  } else if (filter === Filter.TRANSLATED) {
    where = {
      ...where,
      AND: {
        OR: [
          {
            literal_contains: search,
          },
          {
            as_in_contains: search,
          },
          {
            translations_some: {
              translation_contains: search,
            },
          },
        ],
        translations_some: {
          translation_not: '',
          language: {
            id: where.language.id,
          },
        },
      },
    };
  } else {
    where = {
      ...where,
      OR: [
        {
          literal_contains: search,
        },
        {
          as_in_contains: search,
        },
        {
          translations_some: {
            translation_contains: search,
          },
        },
      ],
    };
  }

  delete where.language;

  return where;
};

export { Query as default };
