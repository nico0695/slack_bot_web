'use client';

import React, { useEffect, useState } from 'react';

import styles from './textToSpeech.module.scss';

import PhraseForm from './components/PhraseForm/PhraseForm';
import AudioList from './components/AudioList/AudioList';
import Dialog from '../../../components/Dialog/Dialog';
import { IPaginationResponse } from '../../../shared/interfaces/pagination.interfaces';
import { ITextToSpeech } from '../../../shared/interfaces/textToSpeech.interfaces';
import SpinnerLoading from '../../../components/Loaders/SpinnerLoading/SpinnerLoading';
import { getTextToSpeech } from '../../../services/textToSpeech/textToSpeech.service';
import AudioDetail from './components/AudioDetail/AudioDetail';
import PrimaryButton from '../../../components/Buttons/PrimaryButton/PrimaryButton';

const TextToSpeech = () => {
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [audioSelected, setAudioSelected] = useState<ITextToSpeech>();

  const [audioList, setAudioList] =
    useState<IPaginationResponse<ITextToSpeech>>();

  const fetchData = async (page: number): Promise<void> => {
    const data = await getTextToSpeech(page);

    if (data) {
      setAudioList(data);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleSubmitForm = (isSuccess: boolean) => {
    if (isSuccess) {
      setCreateIsOpen(false);
      fetchData(1);
    }
  };

  return (
    <div>
      <h4 className={styles.title}>Texto a voz</h4>

      {!audioList && <SpinnerLoading />}

      {audioList && (
        <>
          <div className={styles.container}>
            <div className={styles.leftSide}>
              <PrimaryButton
                label="Nuevo audio"
                onClick={() => setCreateIsOpen(true)}
              />
              <AudioList onSelect={setAudioSelected} audioList={audioList} />
            </div>
            <div>{audioSelected && <AudioDetail data={audioSelected} />}</div>
          </div>

          <Dialog
            title="Nuevo audio"
            isOpen={createIsOpen}
            hideModal={() => setCreateIsOpen(false)}
          >
            <PhraseForm onSubmit={handleSubmitForm} />
          </Dialog>
        </>
      )}
    </div>
  );
};

export default TextToSpeech;
