'use client';

import React from 'react';
import { toast } from 'react-toastify';

import styles from './phraseForm.module.scss';
import { useToggle } from '../../../../../shared/hooks/useToggle/useToggle';
import PrimaryButton from '../../../../../components/Buttons/PrimaryButton/PrimaryButton';
import { createTextToSpeech } from '@services/textToSpeech/textToSpeech.service';

interface IPhraseFormProps {
  onSubmit: (isSuccess: boolean) => void;
}

const PhraseForm = (props: IPhraseFormProps) => {
  const { onSubmit } = props;

  const [isLoading, , startLoading, stopLoading] = useToggle();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phrase = event.currentTarget.phrase.value;

    if (!phrase) {
      toast.error('Ingrese una frase');
      return;
    }

    startLoading();

    const response = await createTextToSpeech(phrase);

    stopLoading();

    if (!response) {
      toast.error('Error al generar el audio');
      return;
    }

    toast('Se genero el audio correctamente');

    if (onSubmit) {
      onSubmit(true);
    }

    event.currentTarget.reset();
  };

  return (
    <>
      <form
        id="speech-form"
        className={styles.formPhrase}
        onSubmit={handleSubmit}
      >
        <div className={styles.labeledValue}>
          <label htmlFor="phrase">Frase a convertir en audio</label>
          <textarea
            name="phrase"
            id="text"
            cols={40}
            rows={5}
            autoFocus
            placeholder="Hi, my name is John Doe."
            disabled={isLoading}
          ></textarea>
        </div>

        <div className={styles.buttonContainer}>
          <PrimaryButton
            label={isLoading ? 'Generando...' : 'Generar audio'}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </>
  );
};

export default PhraseForm;
