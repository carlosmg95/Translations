import React from 'react';
import './NewLiteralRow.css';
import PillButton from '../PillButton/PillButton';

interface NewLiteralRowProps {
  addNewLiteral(): void;
  changeLiteral(event: any, key: string): void;
  literal: string;
  translation: string;
  as_in: string;
  errorMessage: string;
}

const NewLiteralRow: React.FC<NewLiteralRowProps> = (
  props: NewLiteralRowProps,
) => {
  return (
    <div className="new-literal-row">
      <p className="new-literal-row__item literal">
        <input
          className="translation-input"
          type="text"
          placeholder="new literal"
          value={props.literal}
          onChange={event => props.changeLiteral(event, 'literal')}
        />
        {props.errorMessage ? (
          <small className="error-message-sm">{props.errorMessage}</small>
        ) : (
          ''
        )}
      </p>
      <p className="new-literal-row__item as-in">
        <input
          className="translation-input"
          type="text"
          placeholder="as in"
          value={props.as_in}
          onChange={event => props.changeLiteral(event, 'as_in')}
        />
      </p>
      <p className="new-literal-row__item translation-text">
        <textarea
          className="translation-input"
          placeholder="translation"
          value={props.translation}
          onChange={event => props.changeLiteral(event, 'translation')}
        />
      </p>
      <p className="new-literal-row__item btn add-literal">
        <PillButton
          className="create-btn"
          text="Create"
          onClick={props.addNewLiteral}
        />
      </p>
    </div>
  );
};

export default NewLiteralRow;
