export type User = {
  id: string
  name: string
  admin: Boolean
  projects: Project[]
  languages: Language[]
}

export type Project = {
  id: string
  name: string
  users: User[]
  languages: Language[]
  translations: Translation[]
  literals: Literal[]
}

export type Language = {
  id: string
  name: string
  iso: string
  code: string
  projects: Project[]
  users: User[]
  translations: Translation[]
}

export type Translation = {
  id: string
  language: Language
  literal: Literal
  project: Project
  translation: string
}

export type Literal = {
  id: string
  project: Project
  translations: Translation[]
  literal: string
  as_in: string
}
/*
export type User = {
  id: string,
  admin: boolean,
  name: string,
  allowLanguages: string[],
  allowProjects: string[]
};

export type Project = {
  id: string,
  name: string,
  languages: Language[],
  literals: Literal[],
  users: User[],
  translations: Translation[]
};

export type Language = {
  id: string,
  name: string,
  iso: string,
  code: string
};

export type Translation = {
  id: string,
  lang_id: string,
  lit_id: string,
  project_id: string,
  translation: string
};

export type Literal = {
  id: string,
  project_id: string,
  literal: string,
  as_in: string
}
*/
export type LiteralTranslation = {
  literalId: string;
  translationId: string;
  literal: string,
  as_in: string,
  translation: string,
  state?: Filter
}

export enum Filter {
  ALL,
  TRANSLATED,
  NO_TRANSLATED,
}
