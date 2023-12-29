'use client';

import React, { useEffect, useState } from 'react';

import styles from './audioDetail.module.scss';

import { ITextToSpeech } from '../../../../shared/interfaces/textToSpeech.interfaces';
import { useToggle } from '../../../../shared/hooks/useToggle/useToggle';
import { getUrlAudioById } from '../../../../services/textToSpeech/textToSpeech.service';

const AudioDetail = ({ data }: { data: ITextToSpeech }) => {
  const [audioSrc, setAudioSrc] = useState<string>();

  const [isLoading, , startLoading, stopLoading] = useToggle();

  const fetchAudio = async (audioId: number) => {
    startLoading();

    const url = await getUrlAudioById(audioId);

    if (url) {
      setAudioSrc(url);
    } else {
      setAudioSrc(undefined);
    }

    stopLoading();
  };

  useEffect(() => {
    fetchAudio(data.id);
  }, [data.id]);

  return (
    <div className={styles.detailContainer}>
      <h3>{`Audio #${data.id}`}</h3>
      <p>{data.phrase}</p>

      {audioSrc && !isLoading && <audio controls src={audioSrc} />}
    </div>
  );
};

export default AudioDetail;
