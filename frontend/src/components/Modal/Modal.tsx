import React from 'react';
import './Modal.css';
import PillButton from '../PillButton/PillButton';

interface modalProps {
  title: string;
  children: JSX.Element | JSX.Element[] | string;
  acceptFunction(): void;
  cancelFunction(): void;
  acceptButtonText?: string;
}

const modal: React.FC<modalProps> = (props: modalProps) => {
  return (
    <div className="Modal">
      <div className="modal-content">
        <h1>{props.title}</h1>
        <div className="modal-body">{props.children}</div>
        <div className="modal-buttons">
          <PillButton
            className="cancel"
            text="Cancel"
            onClick={props.cancelFunction}
          />
          <PillButton
            text={props.acceptButtonText || 'Upload'}
            onClick={props.acceptFunction}
          />
        </div>
      </div>
    </div>
  );
};

export default modal;
