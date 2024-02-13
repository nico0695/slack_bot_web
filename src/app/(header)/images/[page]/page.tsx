import { Suspense } from 'react';

import Image from 'next/image';

import apiConfig from '../../../../config/apiConfig';

import { IImages } from '../../../../shared/interfaces/images.interfaces';
import { IPaginationResponse } from '../../../../shared/interfaces/pagination.interfaces';

import { getRequest } from '../../../../shared/utils/api/fetch.utils';

import styles from './images.module.scss';

import Loading from './loading';
import PaginationBar from '../components/PaginationBar/PaginationBar';

async function getData(page: number): Promise<IPaginationResponse<IImages>> {
  try {
    const res = await getRequest<IPaginationResponse<IImages>>(
      `${apiConfig.BASE_URL}/images/get-images?page=${page}&pageSize=6`
    );

    if (res.error || !res.data) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err) {
    return {
      data: [],
      page: 0,
      pageSize: 6,
      count: 0,
    };
  }
}

interface IImagesProps {
  params: { page: string };
}

const Images = async ({ params }: IImagesProps) => {
  const { page = '1' } = params;

  const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 0;

  const imagePage = await getData(pageNumber);

  return (
    <Suspense fallback={<Loading />}>
      <section className="">
        {imagePage?.data && (
          <>
            <div className={styles.imageContainer}>
              {imagePage?.data?.map((p) => (
                <div className={styles.card} key={p.id}>
                  <Image
                    src={p.imageUrl}
                    alt={p.prompt}
                    className={styles.cardImage}
                    width={300}
                    height={300}
                  />

                  <div className={styles.cardInfo}>
                    <h6 className={styles.cardTitle}>{`#${p.id}`}</h6>
                    <p className={styles.cardDescription}>{p.prompt || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              page={pageNumber}
              count={imagePage?.count}
              pageSize={imagePage?.pageSize}
            />
          </>
        )}
      </section>
    </Suspense>
  );
};

export default Images;
