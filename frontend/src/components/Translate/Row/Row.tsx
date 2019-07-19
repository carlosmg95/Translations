import React from 'react';
import './Row.css';
import { TranslateRow } from '../../../types';

interface RowProps {
  translateRow: TranslateRow;
  changed(event: any, literal: string): void;
}

const row: React.FC<RowProps> = (props: RowProps) => {
  return (
    <tr className="literal__row">
      <td>{props.translateRow.literal}</td>
      <td>{props.translateRow.as_in}</td>
      <td>
        <input
          type="text"
          value={props.translateRow.translation}
          onChange={event => props.changed(event, props.translateRow.literal)}
        />
      </td>
    </tr>
  );
};

export default row;
