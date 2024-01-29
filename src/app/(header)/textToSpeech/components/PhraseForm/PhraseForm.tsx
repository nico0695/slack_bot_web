'use client';

import React from 'react';
import { toast } from 'react-toastify';

import apiConfig from '../../../../config/apiConfig';

import styles from './phraseForm.module.scss';
import { useToggle } from '../../../../../shared/hooks/useToggle/useToggle';
import PrimaryButton from '../../../../../components/Buttons/PrimaryButton/PrimaryButton';

interface IPhraseFormProps {
  onSubmit: (isSuccess: boolean) => void;
}

const PhraseForm = (props: IPhraseFormProps) => {
  const { onSubmit } = props;

  const [isLoading, , startLoading, stopLoading] = useToggle();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const phrase = event.currentTarget.phrase.value;

      if (!phrase) {
        toast.error('Ingrese una frase');
        return;
      }

      startLoading();

      await fetch(`${apiConfig.BASE_URL}/text-to-speech/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase: event.currentTarget.phrase.value,
        }),
      });

      toast('Se genero el audio correctamente');

      if (onSubmit) {
        onSubmit(true);
      }

      event.currentTarget.reset();
    } catch (error) {
      console.log('error= ', error);
    }

    stopLoading();
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
