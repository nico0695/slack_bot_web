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
import { TaskStatus, taskOptions } from '@constants/tasks.constants';

import {
  createTask,
  deleteTask,
  updateTask,
} from '@services/tasks/tasks.service';
import { ITask, TaskFormOmitedFields } from '@interfaces/tasks.interfaces';

import styles from './taskForm.module.scss';

import LabeledInput from '@components/LabeledInputs/LabeledInput';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';

const taskInitialValue = {
  title: '',
  description: '',
  status: TaskStatus.PENDING,
};

interface ITaskFormProps {
  data?: ITask;
  action: ActionTypes;
  onSubmit?: () => void;
}

const TaskForm = ({
  data,
  action = ActionTypes.DETAIL,
  onSubmit,
}: ITaskFormProps) => {
  const [isLoading, , startLoading, stopLoading] = useToggle(false);

  const handleValidate = (values: Omit<ITask, TaskFormOmitedFields>) => {
    const errors: FormikErrors<ITask> = {};

    if (action === ActionTypes.DELETE) {
      return errors;
    }

    if (!values.title) {
      errors.title = validationMessages.required;
    }

    if (!values.status) {
      errors.status = validationMessages.required;
    }

    if (values.alertDate && new Date(values.alertDate) < new Date()) {
      errors.alertDate = validationMessages.pattern;
    }

    return errors;
  };

  const handleCreate = async (values: Omit<ITask, TaskFormOmitedFields>) => {
    const response = await createTask(values);

    if (response) {
      toast.success('Tarea creada correctamente');

      return;
    }

    throw new Error('Error al crear la tarea');
  };

  const handleUpdate = async (
    taskId: number,
    values: Omit<ITask, TaskFormOmitedFields>
  ) => {
    const response = await updateTask(taskId, values);

    if (response) {
      toast.success('Tarea actualizada correctamente');

      return;
    }

    throw new Error('Error al actualizar la tarea');
  };

  const handleDelete = async (taskId: number) => {
    const response = await deleteTask(taskId);

    if (response) {
      toast.success('Tarea eliminada correctamente');

      return;
    }

    throw new Error('Error al eliminar la tarea');
  };

  const handleSubmit = async (values: Omit<ITask, TaskFormOmitedFields>) => {
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
    initialValues: taskInitialValue,
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
            label="Estado"
            type="select"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status ? formik.errors.status : null}
            disabled={inputDisabled}
            options={taskOptions}
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

export default TaskForm;
