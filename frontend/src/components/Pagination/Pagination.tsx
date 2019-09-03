import React from 'react';
import './Pagination.css';

interface ExtremePageProps {
  click(page: number): void;
  lastValue: number;
  position: 'first' | 'last';
}

interface PageProps {
  active: boolean;
  click(page: number): void;
  value: number;
}

interface PaginationProps {
  numberPages: number;
  currentPage: number;
  click(page: number): void;
}

const Page: React.FC<PageProps> = (props: PageProps) => {
  return (
    <button
      className={'page' + (props.active ? ' active' : '')}
      onClick={() => props.click(props.value)}
    >
      {props.value}
    </button>
  );
};

const ExtremePage: React.FC<ExtremePageProps> = (props: ExtremePageProps) => {
  return (
    <button
      className="page"
      onClick={() =>
        props.click(props.position === 'first' ? 1 : props.lastValue)
      }
    >
      {props.position === 'first' ? (
        <>&lsaquo;&lsaquo;</>
      ) : (
        <>&rsaquo;&rsaquo;</>
      )}
    </button>
  );
};

const pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  if (props.numberPages === 1) {
    return <></>;
  }

  let pages: JSX.Element[] = [];

  for (let i = 1; i < props.numberPages + 1; i++) {
    pages = [
      ...pages,
      <Page
        active={i === props.currentPage}
        value={i}
        key={i}
        click={props.click}
      />,
    ];
  }

  if (props.numberPages > 9) {
    switch (props.currentPage) {
      case 1:
      case 2:
      case 3:
        pages.splice(
          5,
          pages.length,
          <ExtremePage
            key="last"
            click={props.click}
            lastValue={pages.length}
            position="last"
          />,
        );
        break;
      case pages.length:
      case pages.length - 1:
      case pages.length - 2:
        pages.splice(
          0,
          pages.length - 5,
          <ExtremePage
            key="first"
            click={props.click}
            lastValue={pages.length}
            position="first"
          />,
        );
        break;
      default:
        const middle: JSX.Element[] = pages.splice(props.currentPage - 3, 5);
        pages = [
          <ExtremePage
            key="first"
            click={props.click}
            lastValue={pages.length}
            position="first"
          />,
          ...middle,
          <ExtremePage
            key="last"
            click={props.click}
            lastValue={pages.length}
            position="last"
          />,
        ];
        break;
    }
  }

  return <div className="Pagination">{pages.map(v => v)}</div>;
};

export default pagination;
