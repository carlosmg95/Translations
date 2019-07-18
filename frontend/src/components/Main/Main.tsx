import React from 'react';
import Action from './Action/Action'
import './Main.css';

interface MainProps {
    actions:string[]
}

const main: React.FC<MainProps> = (props) => {
    const actions: JSX.Element[] = props.actions.map((action: string, index: number): JSX.Element => {
        return <Action actionName={action} key={index} />
    });
    return (
        <main>
            <section id="overview">
                <h1>Add your translations</h1>
            </section>
            <section id="actions">
                <h1 className="section-title">What do you want to do?</h1>
                <div className="action__list">
                    {actions}
                </div>
            </section>
        </main>
    );
};

export default main;