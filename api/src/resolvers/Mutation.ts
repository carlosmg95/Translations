import * as simplegit from 'simple-git/promise';
import * as shell from 'shelljs';
import log from '../utils/log';
import { LiteralResponse, ProjectResponse, UserResponse } from '../type-res';

const GIT_USER: string = process.env.GIT_USER;
const GIT_PASS: string = process.env.GIT_PASS;

type i18n = {
  [key: string]: string;
};

const throwError = (message?: string): void => {
  const errorMessage = message || 'Error ocurred.';
  log.error(`${errorMessage}`);
  throw new Error(errorMessage);
};

const createLangJSON = (project, languageIso): i18n => {
  let i18n: i18n = {};
  project.literals.forEach(literal => {
    const translation = project.translations.find(
      translation =>
        translation.language.iso === languageIso &&
        translation.literal.id === literal.id,
    );
    const translationText: string =
      translation && translation.translation
        ? translation.translation
        : literal.literal;
    i18n = { ...i18n, [literal.literal]: translationText };
  });
  return i18n;
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
  async addLanguageToUser(parent, { user, language }, { prisma }, info) {
    const userExists: boolean = await prisma.exists.User({
      name: user.name,
    });
    const languageExists: boolean = await prisma.exists.Language({
      id: language.id,
    });

    if (!userExists || !languageExists)
      throwError('The language cannot be added to the user.');
    else log.mutation('Mutation: addLanguageToUser');

    return await prisma.mutation.updateUser(
      {
        where: {
          name: user.name,
        },
        data: {
          languages: {
            connect: { id: language.id },
          },
        },
      },
      UserResponse,
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
      git_repo: data.git_repo.replace(/^https*:\/\//, ''),
      git_path: data.git_path.replace(/^\//, ''),
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
  async pushTranslations(parent, { project, language }, { prisma }, info) {
    const projectExists: boolean = await prisma.exists.Project({
      name: project.name,
    });

    if (!projectExists) throwError("The project doesn't exist.");
    else log.mutation('Mutation: pushTranslations');

    project = await prisma.query.project(
      { where: { name: project.name } },
      ProjectResponse,
    );
    const { git_repo, git_name, git_branch, git_path } = project;

    const git = simplegit();

    const path: string = `/tmp/${git_name}`;
    const remote: string = `https://${GIT_USER}:${GIT_PASS}@${git_repo}`;

    shell.rm('-Rf', path);

    await git.clone(remote, path, [
      '--single-branch',
      '--branch',
      'pruebaPush',
    ]);

    shell.exec(
      `echo '${JSON.stringify(
        createLangJSON(project, language.iso),
        null,
        2,
      )}' > ${path}/${git_path}/${language.iso}.json`,
    );

    await git.cwd(path);
    await git.add(`${git_path}/${language.iso}.json`);
    await git.commit(`Adds new ${language.iso} translations`);
    await git.push('origin', git_branch);

    shell.rm('-Rf', path);

    return true;
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
  async removeLanguageFromUser(parent, { user, language }, { prisma }, info) {
    const userExists: boolean = await prisma.exists.User({
      name: user.name,
    });
    const languageExists: boolean = await prisma.exists.Language({
      id: language.id,
    });

    if (!userExists || !languageExists)
      throwError('The language cannot be removeed from the user.');
    else log.mutation('Mutation: removeLanguageFromUser');

    return await prisma.mutation.updateUser(
      {
        where: {
          name: user.name,
        },
        data: {
          languages: {
            disconnect: { id: language.id },
          },
        },
      },
      UserResponse,
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
