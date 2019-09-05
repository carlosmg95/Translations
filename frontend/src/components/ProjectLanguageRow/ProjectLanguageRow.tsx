import React, { useState, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import './ProjectLanguageRow.css';
import PillButton from '../PillButton/PillButton';
import Modal from '../Modal/Modal';
import Loading from '../Loading/Loading';
import LanguageFlag from '../LanguageFlag/LanguageFlag';
import { Language, Project } from '../../types';
import { LiteralResponse } from '../../types-res';
import { changeQueryValues } from '../../utils/functions';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface ProjectLanguageRowProps {
  project: Project;
  language: Language;
  allowed: boolean;
  updateInfo: boolean;
  literalsImported(): void;
  pushFunction(pushResult: Promise<any>): void;
}

const ProjectLanguageRow: React.FC<ProjectLanguageRowProps> = (
  props: ProjectLanguageRowProps,
) => {
  const [uploadFileState, setUploadFileState]: [
    // If the modal is open
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const [contentFileState, setContentFileState]: [
    // The content of the upload file
    string,
    Dispatch<SetStateAction<string>>,
  ] = useState('');

  const [overwriteState, setOverwriteState]: [
    // If the new literals have to overwrite the old ones
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const [totalLiteralsState, setTotalLiteralsState]: [
    // Number literals
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(-1);

  const [translatedLiteralsState, setTranslatedLiteralsState]: [
    // Number of translated literals
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(-1);

  const [porcentajeState, setPorcentajeState]: [
    // Porcentaje of translated literals
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(-1);

  const PUSH_TRANSLATIONS = gql`
    mutation PushTranslations(
      $project: ProjectWhereUniqueInput!
      $language: LanguageWhereUniqueInput!
    ) {
      pushTranslations(project: $project, language: $language)
    }
  `;

  const IMPORT_NEW_LITERALS = gql`
    mutation ImportLiterals(
      $data: [I18nCreateInput!]!
      $overwrite: Boolean!
      $project: ProjectWhereUniqueInput!
      $language: LanguageWhereUniqueInput!
    ) {
      importLiterals(
        data: $data
        overwrite: $overwrite
        project: $project
        language: $language
      )
    }
  `;

  const GET_DATA = gql`
    query GetData {
      all: literals(
        where: {
          project: { name: "${props.project.name}" },
          language: { id: "${props.language.id}" }
        },
        page: 0,
        filter: 0
        search: ""
      ) ${LiteralResponse}
      translated: literals(
        where: {
          project: { name: "${props.project.name}" },
          language: { id: "${props.language.id}" }
        },
        page: 0,
        filter: 1
        search: ""
      ) ${LiteralResponse}
    }
  `;

  const [push] = useMutation(PUSH_TRANSLATIONS);
  const [addLiterals] = useMutation(IMPORT_NEW_LITERALS);
  const { data, error, loading, refetch } = useQuery(GET_DATA);

  if (loading || error) {
    return <Loading errorMessage={error && error.message} errorCode={500} />;
  }

  const setInfoValues = (data): void => {
    const totalLiterals: number = data.all.length;
    const translatedLiterals: number = data.translated.length;
    const porcentaje: number =
      totalLiterals && Math.round((translatedLiterals / totalLiterals) * 100);

    setTotalLiteralsState(totalLiterals);
    setTranslatedLiteralsState(translatedLiterals);
    setPorcentajeState(porcentaje);
  };

  if (totalLiteralsState === -1) {
    setInfoValues(data);
  }

  if (props.updateInfo) {
    refetch().then(result => {
      setInfoValues(result.data);
    });
  }

  return (
    <>
      {uploadFileState ? (
        <Modal
          title="Upload JSON"
          acceptFunction={() => {
            const contentFile = contentFileState
              ? JSON.parse(contentFileState)
              : {};
            const isValid: boolean = Object.keys(contentFile).some(
              key =>
                !(contentFile[key] && typeof contentFile[key] !== 'string'),
            );

            if (!isValid) return;

            const data: {
              literal: string;
              translation: string;
            }[] = Object.keys(contentFile).map(key => ({
              literal: key,
              translation: contentFile[key],
            }));

            addLiterals({
              variables: {
                data,
                overwrite: overwriteState,
                language: { id: props.language.id },
                project: { name: props.project.name },
              },
            }).then(() => {
              props.literalsImported();
              refetch().then(result => {
                setInfoValues(result.data);
              });
            });
            window.history.replaceState(
              this,
              '',
              changeQueryValues('update', 1),
            );
            setUploadFileState(false);
          }}
          cancelFunction={() => {
            setUploadFileState(false);
          }}
        >
          <div className="json-file">
            <input
              type="file"
              name="json-file"
              accept=".json"
              onChange={event => {
                const reader: FileReader = new FileReader();
                reader.readAsText(event.target.files[0]);
                reader.onload = result => {
                  const target: any = result.target;
                  setContentFileState(target.result);
                };
              }}
            />
          </div>
          <div className="overwrite-checkbox">
            <label>Overwrite values?</label>
            <input
              type="checkbox"
              name="overwrite-checkbox"
              onChange={event => {
                setOverwriteState(event.target.checked);
              }}
            />
          </div>
        </Modal>
      ) : (
        ''
      )}
      <div
        className={'projectLanguageRow ' + (props.allowed ? '' : 'disabled')}
      >
        <div className="language-project">
          <LanguageFlag
            key={props.language.id}
            allowed={props.allowed}
            code={props.language.code}
            name={props.language.name}
          />
        </div>
        <div className="info">
          {porcentajeState !== 100
            ? `${translatedLiteralsState} of ${totalLiteralsState}`
            : ''}
          <span
            className={
              'porcentaje' +
              (porcentajeState >= 50 ? ' half' : '') +
              (porcentajeState === 100 ? ' complete' : '')
            }
          >
            {porcentajeState}%
          </span>
        </div>
        <div className="import-json">
          <PillButton
            text="Import JSON"
            disabled={!props.allowed}
            onClick={() => {
              setUploadFileState(true);
            }}
          />
        </div>
        <div className="push-json">
          <PillButton
            text="Push translations"
            disabled={!props.allowed}
            onClick={() => {
              props.pushFunction(
                push({
                  variables: {
                    project: { name: props.project.name },
                    language: { iso: props.language.iso },
                  },
                }),
              );
            }}
          />
        </div>
        <div className="translate">
          <Link
            to={
              props.allowed
                ? `${props.project.name}/translate/${props.language.iso}${window.location.search}`
                : '#'
            }
          >
            <PillButton text="Translate" disabled={!props.allowed} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProjectLanguageRow;
