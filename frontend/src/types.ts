export type User = {
  id: number,
  admin: boolean,
  name: string,
  allowLanguages: number[],
  allowProjects: number[]
};

export type Project = {
  id: number,
  name: string,
  languages: number[]
};

export type Language = {
  id: number,
  name: string,
  iso: string
};

export type Translation = {
  id: number,
  lang_id: number,
  lit_id: number,
  project_id: number,
  translation: string
};

export type Literal = {
  id: number,
  project_id: number,
  literal: string,
  as_in: string
}

export type Row = {
  literal: string,
  as_in: string,
  translation: string
}
