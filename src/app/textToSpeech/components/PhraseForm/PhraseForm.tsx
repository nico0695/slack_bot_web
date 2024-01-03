'use client';

import React from 'react';
import { toast } from 'react-toastify';

import apiConfig from '../../../config/apiConfig';

import styles from './phraseForm.module.scss';
import { useToggle } from '../../../../shared/hooks/useToggle/useToggle';

interface IPhraseFormProps {
  onSubmit: (isSuccess: boolean) => void;
}

const PhraseForm = (props: IPhraseFormProps) => {
  const { onSubmit } = props;

  const [isLoading, , startLoading, stopLoading] = useToggle();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      startLoading();

      const phrase = event.currentTarget.phrase.value;

      if (!phrase) {
        toast.error('Ingrese una frase');
        return;
      }

      const res = await fetch(`${apiConfig.BASE_URL}/text-to-speech/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase: event.currentTarget.phrase.value,
        }),
      });

      console.log('res= ', res);
      toast('Se genero el audio correctamente');

      event.currentTarget.reset();

      if (onSubmit) {
        onSubmit(true);
      }
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
        <button
          className={styles.button}
          type="submit"
          id="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar audio'}
        </button>
      </form>
    </>
  );
};

export default PhraseForm;
