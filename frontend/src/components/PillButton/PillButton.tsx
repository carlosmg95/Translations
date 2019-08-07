import React from 'react';
import './PillButton.css';

interface PillButtonProps {
  disabled?: boolean;
  text: string;
  onClick?(): void;
  className?: string;
}

const pillButton: React.FC<PillButtonProps> = ({
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={'PillButton ' + props.className}
      type="button"
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default pillButton;
