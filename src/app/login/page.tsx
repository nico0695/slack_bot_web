'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useAuthStore } from '../../store/useAuthStore';

import styles from './login.module.scss';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../components/Buttons/TextButton/TextButton';
import { validationMessages } from '../../shared/constants/form.constants';
import { useToggle } from '../../shared/hooks/useToggle/useToggle';
import LabeledInput from '../../components/LabeledInputs/LabeledInput';

interface ILoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, , startLoading, stopLoading] = useToggle();

  const { push, refresh } = useRouter();

  const { loginSupabase } = useAuthStore();

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

    const response = await loginSupabase(values);

    if (!response.status) {
      toast.error(response.message);
      stopLoading();
      return;
    }

    refresh();
    push('/');
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
      <h1>Iniciar sesión</h1>

      <form onSubmit={formik.handleSubmit} noValidate>
        <LabeledInput
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email ? formik.errors.email : null}
          autoFocus
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
          <PrimaryButton label="Ingresar" type="submit" loading={isLoading} />

          <TextButton
            label="Registrarse"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              push('/register');
            }}
          />
        </div>
      </form>
    </div>
  );
}
