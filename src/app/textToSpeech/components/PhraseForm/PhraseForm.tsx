'use client';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

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

      if (onSubmit) {
        onSubmit(true);
      }

      event.currentTarget.phrase.value = '';
    } catch (error) {
      console.log('error= ', error);
    }

    stopLoading();
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <form className={styles.formPhrase} onSubmit={handleSubmit}>
        <div className={styles.labeledValue}>
          <label htmlFor="phrase">Frase a convertir en audio</label>
          {/* <input
            type="text"
            name="phrase"
            id="text"
            placeholder="Whispers in the moonlight..."
            autoFocus
            autoComplete="off"
          /> */}
          <textarea
            name="phrase"
            id="text"
            cols={40}
            rows={5}
            autoFocus
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
