import React, { useState, Dispatch, SetStateAction } from 'react';
import './NewLiteralRow.css';
import PillButton from '../../PillButton/PillButton';

interface NewLiteralRowProps {
  addNewLiteral(): Promise<string>;
  changeLiteral(event: any, key: string): void;
}

const NewLiteralRow: React.FC<NewLiteralRowProps> = (
  props: NewLiteralRowProps,
) => {
  const [errorState, setErrorState]: [
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  return (
    <div className="new-literal-row">
      <p className="new-literal-row__item literal">
        <input
          type="text"
          placeholder="new literal"
          onChange={event => props.changeLiteral(event, 'literal')}
        />
        {errorState ? (
          <small className="error-message-sm">{errorState}</small>
        ) : (
          ''
        )}
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
        <PillButton
          className="create-btn"
          text="Create"
          onClick={() => {
            props
              .addNewLiteral()
              .then(() => {
                setErrorState('');
                window.location.reload();
              })
              .catch(e => {
                const errorMessage: string = e.message.replace(
                  /^.+:\s(.+)$/,
                  '$1',
                );
                setErrorState(errorMessage);
              });
          }}
        />
      </p>
    </div>
  );
};

export default NewLiteralRow;
