import log from '../utils/log';

const throwError = (message?: string): void => {
  const errorMessage = message || 'Error ocurred.';
  log.error(`${errorMessage}`);
  throw new Error(errorMessage);
};

const Mutation = {
  async addUserToProject(parent, { project, users }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });

    if (!projectExists) {
      throwError("The projects doesn't exists.");
    }

    users.forEach(user => {
      prisma.mutation.updateUser({
        where: {
          name: user.name,
        },
        data: {
          projects: {
            connects: {
              name: project.name,
            },
          },
        },
      });
    });

    return await prisma.mutation.updateProject(
      {
        where: {
          name: project.name,
        },
        data: {
          users: {
            connect: users.map(user => ({ name: user.name })),
          },
        },
      },
      `{
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
        }
        translations {
          id
        }
      }`,
    );
  },
  async createProject(parent, { data }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: data.name,
    });

    const newProject = {
      ...data,
      users: {
        connect: data.users,
      },
      languages: {
        connect: data.languages,
      },
    };

    if (projectExists) throwError('The name cannot be repeated.');
    else log.mutation('Mutation: createProject');

    return await prisma.mutation.createProject(
      { data: newProject },
      `{
        id
        name
        languages {
          id
          name
          iso
          code
        }
        literals {
          id
        }
        users {
          id
          name
        }
        translations {
          id
        }
      }`,
    );
  },
  async createLiteralTranslation(parent, { data }, { prisma }, info) {
    const literal: string = data.literal.literal;
    const projectName: string = data.project.name;
    const existsLiteral: boolean = await prisma.exists.Literal({
      literal,
      project: { name: projectName },
    });

    const newTranslation = {
      ...data,
      project: {
        connect: data.project,
      },
      language: {
        connect: data.language,
      },
      literal: {
        create: {
          ...data.literal,
          project: {
            connect: data.literal.project,
          },
        },
      },
    };

    if (existsLiteral) throwError('The literal already exists.');
    else log.mutation('Mutation: createTranslation');

    return await prisma.mutation.createTranslation(
      { data: newTranslation },
      `{
        id
        translation
        literal {
          id
          as_in
          literal
        }
      }`,
    );
  },
  async upsertTranslation(parent, { where, create, update }, { prisma }, info) {
    const translationExists: boolean = await prisma.exists.Translation(where);
    if (!translationExists) {
      const languageId: string = create.language.id;
      const literalId: string = create.literal.id;
      const projectName: string = create.project.name;

      const languageExists: boolean = await prisma.exists.Language({
        id: languageId,
      });
      const literalExists: boolean = await prisma.exists.Literal({
        id: literalId,
        project: { name: projectName },
      });
      const projectExists: boolean = await prisma.exists.Project({
        name: projectName,
      });

      if (!languageExists || !literalExists || !projectExists)
        throwError("It can't connect with the requiered elements.");
    }

    const newTranslation = {
      ...create,
      project: {
        connect: create.project,
      },
      language: {
        connect: create.language,
      },
      literal: {
        connect: create.literal,
      },
    };

    log.mutation('Mutation: upsertTranslation');

    return await prisma.mutation.upsertTranslation({
      where,
      create: newTranslation,
      update,
    });
  },
};

export { Mutation as default };
