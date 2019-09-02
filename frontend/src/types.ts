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
  git_repo: string
  git_name: string
  git_branch: string
  git_path: string
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
