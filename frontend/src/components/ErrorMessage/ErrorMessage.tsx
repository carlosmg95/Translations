import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  children: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (
  props: ErrorMessageProps,
) => {
  return (
    <div className="error">
      <h2>{props.children}</h2>
    </div>
  );
};

export default ErrorMessage;
