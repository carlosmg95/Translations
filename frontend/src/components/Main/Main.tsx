import React from 'react';
import Action from './Action/Action'
import './Main.css';

interface MainProps {
    actions: [string, string][]
}

const main: React.FC<MainProps> = (props: MainProps) => {
    const actions: JSX.Element[] = props.actions.map((action: [string, string]): JSX.Element => {
        let text, id: string;
        [id, text] = action;
        return <Action actionId={id} actionText={text} key={id} />
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