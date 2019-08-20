import log from '../utils/log';
import { LiteralResponse, ProjectResponse } from '../type-res';

const throwError = (message?: string): void => {
  const errorMessage = message || 'Error ocurred.';
  log.error(`${errorMessage}`);
  throw new Error(errorMessage);
};

const Mutation = {
  async addLanguageToProject(parent, { project, language }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });
    const languageExists: boolean = await prisma.exists.Language({
      id: language.id,
    });

    if (!projectExists || !languageExists)
      throwError('The language cannot be added to the project.');
    else log.mutation('Mutation: addLanguageToProject');

    return await prisma.mutation.updateProject(
      {
        where: {
          name: project.name,
        },
        data: {
          languages: {
            connect: { id: language.id },
          },
        },
      },
      ProjectResponse,
    );
  },
  async addUserToProject(parent, { project, user }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });
    const userExists: boolean = await prisma.exists.User({
      id: user.id,
    });

    if (!projectExists || !userExists)
      throwError('The user cannot be added to the project.');
    else log.mutation('Mutation: addUserToProject');

    prisma.mutation.updateUser({
      where: {
        id: user.id,
      },
      data: {
        projects: {
          connects: {
            name: project.name,
          },
        },
      },
    });

    return await prisma.mutation.updateProject(
      {
        where: {
          name: project.name,
        },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      },
      ProjectResponse,
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
      ProjectResponse,
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
      LiteralResponse,
    );
  },
  async removeLanguageFromProject(
    parent,
    { project, language },
    { prisma },
    info,
  ) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });
    const languageExists: boolean = await prisma.exists.Language({
      id: language.id,
    });

    if (!projectExists || !languageExists)
      throwError('The language cannot be removeed from the project.');
    else log.mutation('Mutation: removeLanguageFromProject');

    prisma.mutation.deleteManyTranslations({
      where: {
        project: {
          name: project.name,
        },
        language: {
          id: language.id,
        },
      },
    });

    return await prisma.mutation.updateProject(
      {
        where: {
          name: project.name,
        },
        data: {
          languages: {
            disconnect: { id: language.id },
          },
        },
      },
      ProjectResponse,
    );
  },
  async removeUserFromProject(parent, { project, user }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });
    const userExists: boolean = await prisma.exists.User({
      id: user.id,
    });

    if (!projectExists || !userExists)
      throwError('The user cannot be removeed from the project.');
    else log.mutation('Mutation: removeUserFromProject');

    prisma.mutation.updateUser({
      where: {
        id: user.id,
      },
      data: {
        projects: {
          disconnect: {
            name: project.name,
          },
        },
      },
    });

    return await prisma.mutation.updateProject(
      {
        where: {
          name: project.name,
        },
        data: {
          users: {
            disconnect: { id: user.id },
          },
        },
      },
      ProjectResponse,
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
