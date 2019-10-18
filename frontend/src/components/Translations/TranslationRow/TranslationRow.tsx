import React from 'react';
import './TranslationRow.css';
import { User } from '../../../types';

interface TranslationRowProps {
  translationId: string;
  literalId: string;
  literal: string;
  as_in: string;
  translation: string | undefined;
  user: User;
  changeTranslation(event: any, translationId: string): void;
  changeAsIn(event: any, translationId: string): void;
  saveTranslation(
    translationId: string,
    literalId: string,
    translationText: string,
  ): void;
  saveLiterals(literalId: string, as_in: string): void;
  removeLiteral(literalId: string, literal: string): void;
}

const translationRow: React.FC<TranslationRowProps> = (
  props: TranslationRowProps,
) => {
  return (
    <div className="translation-row">
      {props.user.admin ? (
        <p
          className="delete-btn"
          onClick={() => {
            props.removeLiteral(props.literalId, props.literal);
          }}
        >
          X
        </p>
      ) : (
        <></>
      )}
      <p className="translation-row__item literal">{props.literal}</p>
      <p className="translation-row__item as-in">
        {props.user.admin ? (
          <textarea
            className="translation-input"
            onBlur={() => {
              props.saveLiterals(props.literalId, props.as_in);
            }}
            onChange={event => {
              props.changeAsIn(event, props.literalId);
            }}
            value={props.as_in}
          />
        ) : (
          props.as_in
        )}
      </p>
      <p className="translation-row__item translation-text">
        <textarea
          className="translation-input"
          onBlur={() => {
            props.saveTranslation(
              props.translationId,
              props.literalId,
              props.translation,
            );
          }}
          onChange={event => {
            props.changeTranslation(event, props.literalId);
          }}
          value={props.translation}
        />
      </p>
    </div>
  );
};

export default translationRow;
