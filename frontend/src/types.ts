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
  literals: Literal[]
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

export type Row = {
  literal: string,
  as_in: string,
  translation: string
}
