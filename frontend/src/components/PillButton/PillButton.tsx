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
  text,
  className,
}) => {
  return (
    <button
      className={'PillButton ' + className}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default pillButton;
