const Mutation = {
  async createProject(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createProject');
    return await prisma.mutation.createProject({ data });
  },
  async upsertTranslation(parent, { where, create, update }, { prisma }, info) {
    console.info('[info] Mutation: upsertTranslation');
    return await prisma.mutation.upsertTranslation({ where, create, update }, info);
  }
};

export { Mutation as default };
