'use client';

import React from 'react';

import { IPaginationResponse } from '../../../../../shared/interfaces/pagination.interfaces';
import { ITextToSpeech } from '../../../../../shared/interfaces/textToSpeech.interfaces';

import styles from './audioList.module.scss';

import { FaHeadphones } from 'react-icons/fa';

interface IAudioListProps {
  onSelect: (data: ITextToSpeech) => void;
  audioList?: IPaginationResponse<ITextToSpeech>;
}

const AudioList = (props: IAudioListProps) => {
  const { onSelect, audioList } = props;

  return (
    <div className={styles.simpleTable}>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Frase</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {audioList?.data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.phrase}</td>
              <td>
                <div
                  onClick={() => onSelect(item)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <FaHeadphones />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudioList;
