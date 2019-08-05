import React from 'react';
import './TranslationRow.css';

interface TranslationRowProps {
  translationId: string;
  literalId: string;
  literal: string;
  as_in: string;
  translation: string | undefined;
  change(event: any, translationId: string): void;
  blur(translationId: string, literalId: string, translationText: string): void;
}

const translationRow: React.FC<TranslationRowProps> = (
  props: TranslationRowProps,
) => {
  return (
    <div className="translation-row">
      <p className="translation-row__item literal">{props.literal}</p>
      <p className="translation-row__item as-in">{props.as_in}</p>
      <p className="translation-row__item translation-text">
        <textarea
          onBlur={() => {
            props.blur(props.translationId, props.literalId, props.translation);
          }}
          onChange={event => {
            props.change(event, props.translationId);
          }}
          value={props.translation}
        />
      </p>
    </div>
  );
};

export default translationRow;
