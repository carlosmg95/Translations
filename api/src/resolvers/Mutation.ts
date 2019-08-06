const Mutation = {
  async createProject(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createProject');
    return await prisma.mutation.createProject({ data }, info);
  },
  async createLiteralTranslation(parent, { data }, { prisma }, info) {
    console.info('[info] Mutation: createTranslation');

    const literal: string = data.literal.create.literal;
    const projectName: string = data.project.connect.name;
    const existsLiteral: boolean = await prisma.exists.Literal({
      literal,
      project: { name: projectName },
    });

    if (existsLiteral) {
      const errorMessage: string = 'The literal already exists.';
      console.error(`[error] ${errorMessage}`);
      throw new Error(errorMessage);
    }

    return await prisma.mutation.createTranslation({ data }, info);
  },
  async upsertTranslation(parent, { where, create, update }, { prisma }, info) {
    console.info('[info] Mutation: upsertTranslation');

    const translationExists: boolean = await prisma.exists.Translation(where);
    return await prisma.mutation.upsertTranslation(
      { where, create, update },
      info,
    );
  },
};

export { Mutation as default };
