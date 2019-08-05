import React from 'react';
import './TranslateRow.css';

interface TranslateRowProps {
  literal: string;
  as_in: string;
  translation: string | undefined;
  //changed(event: any, literal: string): void;
}

const row: React.FC<TranslateRowProps> = (props: TranslateRowProps) => {
  return (
    <tr className="literal__row">
      <td>{props.literal}</td>
      <td>{props.as_in}</td>
      <td>
        <input type="text" value={props.translation} />
      </td>
    </tr>
  );
};

export default row;
