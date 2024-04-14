'use client';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FormikErrors, useFormik } from 'formik';

import { useToggle } from '@hooks/useToggle/useToggle';
import {
  ActionTypes,
  buttonActionLabel,
  validationMessages,
} from '@constants/form.constants';

import {
  createNote,
  deleteNote,
  updateNote,
} from '@services/notes/notes.service';
import { INote, NoteFormOmitedFields } from '@interfaces/notes.interfaces';

import styles from './noteForm.module.scss';

import LabeledInput from '@components/LabeledInputs/LabeledInput';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';

const noteInitialValue = {
  title: '',
  description: '',
  tag: '',
};

interface INoteFormProps {
  data?: INote;
  action: ActionTypes;
  onSubmit?: () => void;
}

const NoteForm = ({
  data,
  action = ActionTypes.DETAIL,
  onSubmit,
}: INoteFormProps) => {
  const [isLoading, , startLoading, stopLoading] = useToggle(false);

  const handleValidate = (values: Omit<INote, NoteFormOmitedFields>) => {
    const errors: FormikErrors<INote> = {};

    if (action === ActionTypes.DELETE) {
      return errors;
    }

    if (!values.title) {
      errors.title = validationMessages.required;
    }

    return errors;
  };

  const handleCreate = async (values: Omit<INote, NoteFormOmitedFields>) => {
    const response = await createNote(values);

    if (response) {
      toast.success('Nota creada correctamente');

      return;
    }

    throw new Error('Error al crear la nota');
  };

  const handleUpdate = async (
    noteId: number,
    values: Omit<INote, NoteFormOmitedFields>
  ) => {
    const response = await updateNote(noteId, values);

    if (response) {
      toast.success('Nota actualizada correctamente');

      return;
    }

    throw new Error('Error al actualizar la nota');
  };

  const handleDelete = async (noteId: number) => {
    const response = await deleteNote(noteId);

    if (response) {
      toast.success('Nota eliminada correctamente');

      return;
    }

    throw new Error('Error al eliminar la nota');
  };

  const handleSubmit = async (values: Omit<INote, NoteFormOmitedFields>) => {
    try {
      startLoading();

      if (action === ActionTypes.CREATE) {
        await handleCreate(values);
      }
      if (action === ActionTypes.UPDATE && data?.id) {
        await handleUpdate(data.id, values);
      }
      if (action === ActionTypes.DELETE && data?.id) {
        await handleDelete(data.id);
      }

      if (onSubmit) {
        onSubmit();
      }

      formik.resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message ?? 'Ups! Algo salió mal');
      }
    }

    stopLoading();
  };

  const formik = useFormik({
    initialValues: noteInitialValue,
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data) {
      formik.setValues(data);
    } else {
      formik.resetForm();
    }
  }, [data]);

  const inputDisabled =
    isLoading || [ActionTypes.DETAIL, ActionTypes.DELETE].includes(action);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className={styles.form}>
          <LabeledInput
            label="Título"
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title ? formik.errors.title : null}
            disabled={inputDisabled}
            light
          />

          <LabeledInput
            label="Tag"
            type="text"
            name="tag"
            value={formik.values.tag}
            onChange={formik.handleChange}
            error={formik.touched.tag ? formik.errors.tag : null}
            disabled={inputDisabled}
            light
          />

          <LabeledInput
            label="Descripción"
            type="textarea"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description ? formik.errors.description : null
            }
            disabled={inputDisabled}
            light
          />
        </div>

        {[ActionTypes.CREATE, ActionTypes.UPDATE, ActionTypes.DELETE].includes(
          action
        ) && (
          <div className={styles.footerForm}>
            <PrimaryButton
              label={buttonActionLabel[action]}
              type="submit"
              loading={isLoading}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default NoteForm;
