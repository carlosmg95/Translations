import React from 'react';
import './TranslateRow.css';
import { Row } from '../../../types';

interface RowProps {
  row: Row;
  changed(event: any, literal: string): void;
}

const row: React.FC<RowProps> = (props: RowProps) => {
  console.log({ props });
  return (
    <tr className="literal__row">
      <td>{props.row.literal}</td>
      <td>{props.row.as_in}</td>
      <td>
        <input
          type="text"
          value={props.row.translation}
          onChange={event => props.changed(event, props.row.literal)}
        />
      </td>
    </tr>
  );
};

export default row;
