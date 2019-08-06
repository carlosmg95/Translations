const Query = {
  user(parent, { where }, { prisma }, info) {
    console.info('[info] Query: user');
    return prisma.query.user(where, info);
  },
  users(parent, { where }, { prisma }, info) {
    console.info('[info] Query: users');
    return prisma.query.users(where, info);
  },
  project(parent, { where }, { prisma }, info) {
    console.info('[info] Query: project');
    return prisma.query.project(where, info);
  },
  projects(parent, { where }, { prisma }, info) {
    console.info('[info] Query: projects');
    return prisma.query.projects(where, info);
  },
  language(parent, { where }, { prisma }, info) {
    console.info('[info] Query: language');
    return prisma.query.language(where, info);
  },
  languages(parent, { where }, { prisma }, info) {
    console.info('[info] Query: languages');
    return prisma.query.languages(where, info);
  },
  literals(parent, { where }, { prisma }, info) {
    console.info('[info] Query: literals');
    return prisma.query.literals(where, info);
  },
  translations(parent, { where }, { prisma }, info) {
    console.info('[info] Query: translations');
    return prisma.query.translations(where, info);
  },
};

export { Query as default };
