export type User = {
    admin: boolean,
    allowLanguages: string[]
};

export type Language = {
    id: string,
    name: string,
    iso: string
};

export type Translation = {
    id: string,
    lang_id: string,
    lit_id: string,
    translation: string
};

export type Literal = {
    id: string,
    literal: string,
    as_in: string
}

export type TranslateRow = {
    literal: string,
    as_in: string,
    translation: string
}
