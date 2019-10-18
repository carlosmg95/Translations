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
  main_language
  languages {
    id
    iso
    code
    name
  }
  users {
    id
    name
  }
  translations {
    id
    translation
    language {
      id
      iso
    }
    literal {
      id
    }
  }
  literals {
    id
    literal
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
