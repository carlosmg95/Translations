import React, { useState, Dispatch, SetStateAction } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import { Link } from 'react-router-dom';
import './ProjectLanguageRow.css';
import PillButton from '../PillButton/PillButton';
import Modal from '../Modal/Modal';
import Loading from '../Loading/Loading';
import LanguageFlag from '../LanguageFlag/LanguageFlag';
import { Language, Project, User } from '../../types';
import { LiteralResponse } from '../../types-res';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface ProjectLanguageRowProps {
  user: User;
  project: Project;
  language: Language;
  allowed: boolean;
  pushFunction(pushResult: Promise<any>): void;
  updateAllLanguages(): void;
  update: boolean;
}

const ProjectLanguageRow: React.FC<ProjectLanguageRowProps> = (
  props: ProjectLanguageRowProps,
) => {
  const [uploadFileState, setUploadFileState]: [
    // If the modal is open
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const [importingLiteralsState, setImportingLiteralsState]: [
    // If the literals are been imported
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

  const PUSH_TRANSLATIONS = gql`
    mutation PushTranslations(
      $project: ProjectWhereUniqueInput!
      $language: LanguageWhereUniqueInput
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

  let totalLiterals: number;
  let translatedLiterals: number;
  let porcentaje: number;

  const setInfoValues = (data): void => {
    totalLiterals = data.all.length;
    translatedLiterals = data.translated.length;
    porcentaje =
      totalLiterals && Math.round((translatedLiterals / totalLiterals) * 100);
  };

  const [push] = useMutation(PUSH_TRANSLATIONS);
  const [addLiterals] = useMutation(IMPORT_NEW_LITERALS);
  const { data, error, loading, refetch } = useQuery(GET_DATA, {
    fetchPolicy: 'network-only',
  });

  if (loading || error) {
    return <Loading errorMessage={error && error.message} errorCode={500} />;
  }

  if (props.update) refetch();

  setInfoValues(data);

  return (
    <>
      {uploadFileState && props.user.admin ? (
        <Modal
          title="Upload JSON"
          acceptFunction={async () => {
            setImportingLiteralsState(true);

            const contentFile = contentFileState
              ? JSON.parse(contentFileState)
              : {};

            let data: {
              literal: Object | string;
              translation: string;
            }[] = [];

            const plainJSON = (object: object, prevKey?: string) => {
              Object.keys(object).forEach((key: string) => {
                const completeKey: string = prevKey ? `${prevKey}.${key}` : key;
                if (typeof object[key] === 'string') {
                  data = [
                    ...data,
                    {
                      literal: completeKey,
                      translation: object[key],
                    },
                  ];
                } else if (typeof object[key] === 'object') {
                  plainJSON(object[key], completeKey);
                }
              });
            };

            plainJSON(contentFile);

            const rowForReq: number = 500;
            const loopReq: number = Math.ceil(data.length / rowForReq);

            for (let i = 0; i < loopReq; i++) {
              await addLiterals({
                variables: {
                  data: data.splice(0, rowForReq),
                  overwrite: overwriteState,
                  language: { id: props.language.id },
                  project: { name: props.project.name },
                },
              });
            }

            setImportingLiteralsState(false);
            props.updateAllLanguages();
            setUploadFileState(false);
          }}
          cancelFunction={() => {
            setUploadFileState(false);
          }}
        >
          {importingLiteralsState ? (
            <div className="modal-blocked">
              <HashLoader size={50} color={'#36d7b7'} />
            </div>
          ) : (
            <></>
          )}
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
          {porcentaje !== 100
            ? `${translatedLiterals} of ${totalLiterals}`
            : ''}
          <span
            className={
              'porcentaje' +
              (porcentaje >= 50 ? ' half' : '') +
              (porcentaje === 100 ? ' complete' : '')
            }
          >
            {porcentaje}%
          </span>
        </div>
        {props.user.admin ? (
          <>
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
          </>
        ) : (
          ''
        )}
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
