const Query = {
  users(parent, { where }, { prisma }, info) {
    return prisma.query.users(
      where,
      '{ id name admin projects { id } languages { id } }',
    );
  },
  projects(parent, { where }, { prisma }, info) {
    return prisma.query.projects(
      where,
      '{ id name languages { id name iso code } literals { id } }',
    );
  },
  languages(parent, { where }, { prisma }, info) {
    return prisma.query.languages(where, '{ id name iso code }');
  },
  literals(parent, { where }, { prisma }, info) {
    return prisma.query.literals(where, '{ id project { id } as_in literal }');
  },
  translations(parent, { where }, { prisma }, info) {
    return prisma.query.translations(
      where,
      '{ id language { id } literal { id } project { id } translation }',
    );
  },
};

export { Query as default };
