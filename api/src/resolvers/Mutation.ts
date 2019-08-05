const Mutation = {
  async createProject(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createProject');
    return await prisma.mutation.createProject({ data }, info);
  },
};

export { Mutation as default };
