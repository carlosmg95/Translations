import log from '../utils/log';

const LITERAL_PER_PAGE: number = 0.1;

const Query = {
  // Functions
  async getLiteralsPages(parent, { where }, { prisma }, info) {
    const literalsAggregate = await prisma.query.literalsConnection(
      { where },
      '{ aggregate { count }}',
    );
    const literalsCount: number = literalsAggregate.aggregate.count;
    const pages: number = Math.ceil(literalsCount / LITERAL_PER_PAGE);
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
  literals(parent, { where }, { prisma }, info) {
    log.query('Query: literals');
    return prisma.query.literals(where, info);
  },
  translations(parent, { where }, { prisma }, info) {
    log.query('Query: translations');
    return prisma.query.translations(where, info);
  },
};

export { Query as default };
