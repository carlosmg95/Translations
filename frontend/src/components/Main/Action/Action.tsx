import React from 'react';
import './Action.css';

interface ActionProps {
    actionName: string
}

const action: React.FC<ActionProps> = (props) => {
    return (
        <article className="action">
            <p>{props.actionName}</p>
        </article>
    );
};

export default action;