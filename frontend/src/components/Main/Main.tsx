import React from 'react';
import './Main.css';
import Action from './Action/Action';
import { Project } from '../../types';

interface MainProps {
  actions: [string, string][];
  projects: Project[];
  selectProject(event: any): void;
}

const main: React.FC<MainProps> = (props: MainProps) => {
  const projects: JSX.Element = (
    <select onChange={props.selectProject}>
      {props.projects.map((project: Project) => {
        return (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        );
      })}
    </select>
  );

  const actions: JSX.Element[] = props.actions.map(
    (action: [string, string]): JSX.Element => {
      let text, id: string;
      [id, text] = action;
      return <Action actionId={id} actionText={text} key={id} />;
    },
  );
  return (
    <main>
      <section className="overview">
        <h1>Add your translations</h1>
      </section>
      <section id="projects">
        <h1 className="section-title">Choose your project</h1>
        <div className="select__project">{projects}</div>
      </section>
      <section id="actions">
        <h1 className="section-title">What do you want to do?</h1>
        <div className="action__list">{actions}</div>
      </section>
    </main>
  );
};

export default main;
