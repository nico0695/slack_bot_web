import React from 'react';
import Link from 'next/link';

import cx from 'classnames';

import styles from './paginationBar.module.scss';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface IPaginationBarProps {
  page: number;
  count: number;
  pageSize: number;
}

const PaginationBar = ({ page, count, pageSize }: IPaginationBarProps) => {
  const maxPage = Math.ceil(count / pageSize);

  return (
    <div className={styles.navigationContainer}>
      <Link
        className={cx(styles.navigationButton, {
          [styles.disabled]: page === 1,
        })}
        href={`/images/${page === 1 ? 1 : page - 1}`}
      >
        <FaArrowLeft />
        Anterior
      </Link>
      <span>{`Página ${page} de ${maxPage}`}</span>
      <Link
        className={cx(styles.navigationButton, {
          [styles.disabled]: page >= maxPage,
        })}
        href={`/images/${page >= maxPage ? maxPage : page + 1}`}
      >
        Siguiente
        <FaArrowRight />
      </Link>
    </div>
  );
};

export default PaginationBar;
