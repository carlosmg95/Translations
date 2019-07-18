export type User = {
    admin: boolean,
    allowLanguages: number[]
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
    translation: string
};

export type Literal = {
    id: number,
    literal: string,
    as_in: string
}

export type TranslateRow = {
    literal: string,
    as_in: string,
    translation: string
}
