export const PagesResponse = `
{
  pages
}
`;

export const LiteralResponse = `
{
  id
  literal
  as_in
}
`;

export const ProjectResponse = `
{
  id
  name
  git_repo
  git_name
  git_branch
  git_path
  users {
    id
    name
  }
  languages {
    id
    iso
    code
    name
  }
  translations {
    id
    translation
    language {
      iso
    }
    literal {
      id
      literal
      as_in
    }
  }
  literals {
    id
    literal
    as_in
  }
}
`;

export const TranslationResponse = `
{
  id
  translation
  literal {
    id
    as_in
    literal
  }
  language {
    id
    iso
  }
}
`;

export const UserResponse = `
{
  id
  name
  admin
  projects {
    id
    name
  }
  languages {
    id
    name
  }
}
`;
