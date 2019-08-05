import React from 'react';
import './NewLiteralRow.css';

interface NewLiteralRowProps {
  addNewLiteral(): void;
  changeLiteral(event: any, key: string): void;
}

const newLiteralRow: React.FC<NewLiteralRowProps> = (
  props: NewLiteralRowProps,
) => {
  return (
    <div className="new-literal-row">
      <p className="new-literal-row__item literal">
        <input
          type="text"
          placeholder="new literal"
          onChange={event => props.changeLiteral(event, 'literal')}
        />
      </p>
      <p className="new-literal-row__item as-in">
        <input
          type="text"
          placeholder="as in"
          onChange={event => props.changeLiteral(event, 'as_in')}
        />
      </p>
      <p className="new-literal-row__item translation-text">
        <textarea
          placeholder="translation"
          onChange={event => props.changeLiteral(event, 'translation')}
        />
      </p>
      <p className="new-literal-row__item btn add-literal">
        <button
          type="button"
          className="create-btn"
          onClick={() => {
            props.addNewLiteral();
          }}
        >
          Create
        </button>
      </p>
    </div>
  );
};

export default newLiteralRow;
