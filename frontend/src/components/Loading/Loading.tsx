import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import './Loading.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

interface loadingProps {
  errorMessage?: string;
  errorCode?: number;
}

const loading: React.FC<loadingProps> = (props: loadingProps) => {
  if (props.errorMessage) {
    return <ErrorMessage code={props.errorCode} message={props.errorMessage} />;
  }
  return (
    <div className="Loading">
      <div className="message">
        <p className="text">Loading</p>
        <SyncLoader size={10} color={'#36d7b7'} margin={'3px'} />
      </div>
    </div>
  );
};

export default loading;
