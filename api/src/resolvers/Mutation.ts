const Mutation = {
  async createProject(parent, { data }, { prisma }, info) {
    return await prisma.mutation.createProject({ data }, '{ name users { name } languages { name } }');
  },
};

export { Mutation as default };
