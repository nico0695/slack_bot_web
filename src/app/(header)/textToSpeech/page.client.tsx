'use client';

import React, { Suspense, useState } from 'react';

import { IPaginationResponse } from '../../../shared/interfaces/pagination.interfaces';
import { ITextToSpeech } from '../../../shared/interfaces/textToSpeech.interfaces';

import { getTextToSpeech } from '../../../services/textToSpeech/textToSpeech.service';

import Loading from './loading';

import styles from './textToSpeech.module.scss';

import PrimaryButton from '../../../components/Buttons/PrimaryButton/PrimaryButton';
import Dialog from '../../../components/Dialog/Dialog';

import PhraseForm from './components/PhraseForm/PhraseForm';
import AudioList from './components/AudioList/AudioList';
import AudioDetail from './components/AudioDetail/AudioDetail';

interface ITextToSpeechProps {
  initialAudioList: IPaginationResponse<ITextToSpeech>;
}

const TextToSpeech = ({ initialAudioList }: ITextToSpeechProps) => {
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [audioSelected, setAudioSelected] = useState<ITextToSpeech>();

  const [audioList, setAudioList] =
    useState<IPaginationResponse<ITextToSpeech>>(initialAudioList);

  const fetchData = async (page: number): Promise<void> => {
    const data = await getTextToSpeech(page);

    if (data) {
      setAudioList(data);
    }
  };

  const handleSubmitForm = (isSuccess: boolean) => {
    if (isSuccess) {
      setCreateIsOpen(false);
      fetchData(1);
    }
  };

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <h4 className={styles.title}>Texto a voz</h4>

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
      </Suspense>
    </div>
  );
};

export default TextToSpeech;
