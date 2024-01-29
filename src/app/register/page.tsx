'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { supabase } from '../../store/useAuthStore';

import styles from './register.module.scss';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../components/Buttons/TextButton/TextButton';
import { validationMessages } from '../../shared/constants/form.constants';
import { useToggle } from '../../shared/hooks/useToggle/useToggle';
import LabeledInput from '../../components/LabeledInputs/LabeledInput';

interface ILoginForm {
  email: string;
  password: string;
}

export default function Register() {
  const [isLoading, , startLoading, stopLoading] = useToggle();

  const { push } = useRouter();

  const handleValidate = (values: ILoginForm) => {
    const errors: Partial<ILoginForm> = {};

    if (!values.email) {
      errors.email = validationMessages.required;
    }

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(values.email)) {
      errors.email = validationMessages.invalidEmail;
    }

    if (!values.password) {
      errors.password = validationMessages.required;
    }

    return errors;
  };

  const handleSubmit = async (values: ILoginForm) => {
    startLoading();
    try {
      const { data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${location.origin}/`,
        },
      });

      stopLoading();

      if (data) {
        toast.success(
          'Se registro correctamente, Se ha enviado un mail de confirmación'
        );

        formik.resetForm();

        setTimeout(() => {
          push('/login');
        }, 3000);
        return;
      }

      toast.error('Error al registrarse');
    } catch (error) {
      toast.error('Error al registrarse');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  return (
    <div className={styles.formSection}>
      <h1>Registrarse</h1>

      <form onSubmit={formik.handleSubmit} noValidate>
        <LabeledInput
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email ? formik.errors.email : null}
        />

        <LabeledInput
          label="Contraseña"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password ? formik.errors.password : null}
        />

        <div className={styles.footerForm}>
          <PrimaryButton
            label="Registrarse"
            type="submit"
            loading={isLoading}
          />

          <TextButton
            label="Ingresar"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              push('/login');
            }}
          />
        </div>
      </form>
    </div>
  );
}
