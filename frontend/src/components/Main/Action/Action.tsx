import React from 'react';
import './Action.css';

interface ActionProps {
  actionText: string;
  actionId: string;
}

const action: React.FC<ActionProps> = (props: ActionProps) => {
  return (
    <article className="action">
      <a href={'/' + props.actionId}>{props.actionText}</a>
    </article>
  );
};

export default action;
