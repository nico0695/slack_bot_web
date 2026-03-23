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
import { LinkStatus, linkOptions } from '@constants/links.constants';
import { createLink, deleteLink, updateLink } from '@services/links/links.service';
import { ILink, LinkFormOmitedFields } from '@interfaces/links.interfaces';

import styles from './linkForm.module.scss';

import LabeledInput from '@components/LabeledInputs/LabeledInput';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';

const isValidUrl = (url: string): boolean => {
  const normalized = normalizeUrl(url);
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.includes('.');
  } catch {
    return false;
  }
};

const normalizeUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const linkInitialValue: Omit<ILink, LinkFormOmitedFields> = {
  url: '',
  title: '',
  description: '',
  tag: '',
  status: LinkStatus.UNREAD,
};

interface ILinkFormProps {
  data?: ILink;
  action: ActionTypes;
  onSubmit?: () => void;
}

const LinkForm = ({ data, action = ActionTypes.DETAIL, onSubmit }: ILinkFormProps) => {
  const [isLoading, , startLoading, stopLoading] = useToggle(false);

  const handleValidate = (values: Omit<ILink, LinkFormOmitedFields>) => {
    const errors: FormikErrors<Omit<ILink, LinkFormOmitedFields>> = {};

    if (action === ActionTypes.DELETE) {
      return errors;
    }

    if (!values.url) {
      errors.url = validationMessages.required;
    } else if (!isValidUrl(values.url)) {
      errors.url = validationMessages.pattern;
    }

    if (!values.status) {
      errors.status = validationMessages.required;
    }

    return errors;
  };

  const handleCreate = async (values: Omit<ILink, LinkFormOmitedFields>) => {
    const response = await createLink(values);

    if (response) {
      toast.success('Link guardado correctamente');
      return;
    }

    throw new Error('Error al guardar el link');
  };

  const handleUpdate = async (
    linkId: number,
    values: Omit<ILink, LinkFormOmitedFields>
  ) => {
    const response = await updateLink(linkId, values);

    if (response) {
      toast.success('Link actualizado correctamente');
      return;
    }

    throw new Error('Error al actualizar el link');
  };

  const handleDelete = async (linkId: number) => {
    const response = await deleteLink(linkId);

    if (response) {
      toast.success('Link eliminado correctamente');
      return;
    }

    throw new Error('Error al eliminar el link');
  };

  const handleSubmit = async (values: Omit<ILink, LinkFormOmitedFields>) => {
    try {
      startLoading();

      const normalized = { ...values, url: normalizeUrl(values.url) };

      if (action === ActionTypes.CREATE) {
        await handleCreate(normalized);
      }
      if (action === ActionTypes.UPDATE && data?.id) {
        await handleUpdate(data.id, normalized);
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
    initialValues: linkInitialValue,
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        url: data.url ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        tag: data.tag ?? '',
        status: data.status ?? LinkStatus.UNREAD,
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
            label="URL"
            type="text"
            name="url"
            value={formik.values.url}
            onChange={formik.handleChange}
            error={formik.touched.url ? formik.errors.url : null}
            disabled={inputDisabled}
            light
          />

          <LabeledInput
            label="Título (opcional)"
            type="text"
            name="title"
            value={formik.values.title ?? ''}
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
            options={linkOptions}
            light
          />

          <LabeledInput
            label="Tag (opcional)"
            type="text"
            name="tag"
            value={formik.values.tag ?? ''}
            onChange={formik.handleChange}
            error={formik.touched.tag ? formik.errors.tag : null}
            disabled={inputDisabled}
            light
          />

          <LabeledInput
            label="Descripción (opcional)"
            type="textarea"
            name="description"
            value={formik.values.description ?? ''}
            onChange={formik.handleChange}
            error={formik.touched.description ? formik.errors.description : null}
            disabled={inputDisabled}
            light
          />
        </div>

        {[ActionTypes.CREATE, ActionTypes.UPDATE, ActionTypes.DELETE].includes(action) && (
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

export default LinkForm;
