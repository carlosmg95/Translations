import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  code: number;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (
  props: ErrorMessageProps,
) => {
  return (
    <div className="ErrorMessage">
      <div className="error">
        <h2>{props.code}</h2>
        <small>{props.message}</small>
      </div>
    </div>
  );
};

export default ErrorMessage;
