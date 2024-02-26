'use client';
import { getUserById, updateUser } from '@services/users/users.service';
import { FormikErrors, useFormik } from 'formik';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import styles from './usersDetail.module.scss';

import LabeledInput from '@components/LabeledInputs/LabeledInput';
import { IUsers, UserFormOmitedFields } from '@interfaces/users.interfaces';
import { Profiles } from '@constants/users.constants';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import { useToggle } from '@hooks/useToggle/useToggle';
import { validationMessages } from '@constants/form.constants';

import { FullSpinnerLoading } from '@components/Loaders';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface IUserFormProps {
  params: { id: number };
}

const UserForm = ({ params }: IUserFormProps) => {
  const { id } = params;

  const [isLoading, , startLoading, stopLoading] = useToggle(true);

  const fetchData = async (userId: number) => {
    startLoading();
    const res = await getUserById(userId);

    if (res) {
      formik.setValues({
        ...res,
      });
    }
    stopLoading();
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, []);

  const handleValidate = (values: Omit<IUsers, UserFormOmitedFields>) => {
    const errors: FormikErrors<IUsers> = {};

    if (!values.email) {
      errors.email = validationMessages.required;
    }

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(values.email)) {
      errors.email = validationMessages.invalidEmail;
    }

    if (!values.name) {
      errors.name = validationMessages.required;
    }

    if (!values.lastName) {
      errors.lastName = validationMessages.required;
    }

    if (Profiles[values.profile] === undefined) {
      errors.profile = validationMessages.required;
    }

    return errors;
  };

  const handleSubmit = async (values: Omit<IUsers, UserFormOmitedFields>) => {
    startLoading();

    const response = await updateUser(id, values);

    stopLoading();

    if (response) {
      toast.success('Usuario actualizado correctamente');
      return;
    }

    toast.error('Error al actualizar el usuario');
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      profile: Profiles.USER,
      enabled: false,
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  return (
    <div className={styles.formSection}>
      {isLoading && <FullSpinnerLoading />}

      <h2 className={styles.formTitle}>
        <Link href={`/admin/users`}>
          <FaArrowLeft size={20} />
        </Link>
        Editar Usuario
      </h2>

      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <LabeledInput
          label="Nombre"
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name ? formik.errors.name : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Apellido"
          type="text"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName ? formik.errors.lastName : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Username"
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username ? formik.errors.username : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email ? formik.errors.email : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Telefono"
          type="text"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone ? formik.errors.phone : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Perfil"
          type="text"
          name="profile"
          value={formik.values.profile.toString()}
          onChange={formik.handleChange}
          error={formik.touched.profile ? formik.errors.profile : null}
          disabled={isLoading}
        />

        <LabeledInput
          label="Habilitado"
          type="checkbox"
          name="enabled"
          checked={formik.values.enabled}
          onChange={formik.handleChange}
          error={formik.touched.enabled ? formik.errors.enabled : null}
          disabled={isLoading}
          inline
        />

        <div className={styles.footerForm}>
          <PrimaryButton label="Guardar" type="submit" loading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
