'use client';
import React, { useEffect } from 'react';
import { FormikErrors, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { addMinute, format, isBefore, iso8601, parse } from '@formkit/tempo';

import { useToggle } from '@hooks/useToggle/useToggle';
import {
  ActionTypes,
  buttonActionLabel,
  validationMessages,
} from '@constants/form.constants';

import { createAlert, deleteAlert } from '@services/alerts/alerts.service';
import { AlertFormOmitedFields, IAlert } from '@interfaces/alerts.interfaces';

import styles from './alertForm.module.scss';

import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import LabeledInput from '@components/LabeledInputs/LabeledInput';

const alertInitialValue: Omit<IAlert, AlertFormOmitedFields> = {
  message: '',
  date: format(addMinute(new Date(), 5), 'YYYY-MM-DDTHH:mm'),
};

interface IAlertFormProps {
  data?: IAlert;
  action: ActionTypes;
  onSubmit?: () => void;
}

const AlertForm = ({
  data,
  action = ActionTypes.DETAIL,
  onSubmit,
}: IAlertFormProps) => {
  const [isLoading, , startLoading, stopLoading] = useToggle(false);

  const handleValidate = (values: Omit<IAlert, AlertFormOmitedFields>) => {
    const errors: FormikErrors<IAlert> = {};

    if (action === ActionTypes.DELETE) {
      return errors;
    }

    if (!values.message) {
      errors.message = validationMessages.required;
    }

    if (!values.date) {
      errors.date = validationMessages.required;
    } else if (
      !iso8601(values.date) ||
      isBefore(parse(values.date), new Date())
    ) {
      errors.date = validationMessages.pattern;
    }

    return errors;
  };

  const handleCreate = async (values: Omit<IAlert, AlertFormOmitedFields>) => {
    const response = await createAlert(values);

    if (response) {
      toast.success('Alerta creada correctamente');

      return;
    }

    throw new Error('Error al crear la alerta');
  };

  const handleDelete = async (alertId: number) => {
    const response = await deleteAlert(alertId);

    if (response) {
      toast.success('Alerta eliminada correctamente');

      return;
    }

    throw new Error('Error al eliminar la alerta');
  };

  const handleSubmit = async (values: Omit<IAlert, AlertFormOmitedFields>) => {
    try {
      startLoading();

      if (action === ActionTypes.CREATE) {
        await handleCreate(values);
      }

      if (action === ActionTypes.DELETE && data?.id) {
        await handleDelete(data.id);
      }

      if (onSubmit) {
        onSubmit();
      }

      formik.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message ?? 'Ups! Algo salió mal');
      }
    }

    stopLoading();
  };

  const formik = useFormik({
    initialValues: alertInitialValue,
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        message: data.message,
        date:
          data.date && iso8601(data.date)
            ? format(parse(data.date), 'YYYY-MM-DDTHH:mm')
            : null,
      });
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
            label="Fecha y hora"
            type="datetime-local"
            name="date"
            value={formik.values.date}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            error={formik.touched.date ? formik.errors.date : null}
            disabled={inputDisabled}
          />

          <LabeledInput
            label="Mensaje"
            type="text"
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            error={formik.touched.message ? formik.errors.message : null}
            disabled={inputDisabled}
            autoFocus
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

export default AlertForm;
