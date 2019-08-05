const Mutation = {
  async createProject(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createProject');
    return await prisma.mutation.createProject({ data }, info);
  },
  async createLiteralTranslation(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createTranslation');

    const literal: string = data.literal.create.literal;
    const projectName: string = data.project.connect.name;
    const existeLiteral: boolean = await prisma.exists.Literal({
      literal,
      project: { name: projectName },
    });

    if (existeLiteral) throw new Error('The literal already exists.');

    return await prisma.mutation.createTranslation({ data }, info);
  },
  async upsertTranslation(parent, { where, create, update }, { prisma }, info) {
    console.info('[info] Mutation: upsertTranslation');
    return await prisma.mutation.upsertTranslation(
      { where, create, update },
      info,
    );
  },
};

export { Mutation as default };
