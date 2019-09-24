import React from 'react';
import './PillButton.css';

interface PillButtonProps {
  disabled?: boolean;
  text: string;
  onClick?(): void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const pillButton: React.FC<PillButtonProps> = ({
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={'PillButton ' + props.className}
      type={props.type || 'button'}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default pillButton;
