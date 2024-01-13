'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';

type AlertProps = {
  type: 'info' | 'error';
  msg: string;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<AlertProps>();

  const { push } = useRouter();

  const { loginSupabase } = useAuthStore();

  const handleLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await loginSupabase({ email, password });

    if (!response.status) {
      setAlert({ msg: response.message ?? '', type: 'error' });
      return;
    }
    push('/');
  };

  const handleRegisterClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     emailRedirectTo: `${location.origin}/auth/callback`,
    //   },
    // });

    // if (error) setAlert({ msg: error.message, type: 'error' });
    // if (data)
    //   setAlert({
    //     msg: 'Please check your email for confirmation!',
    //     type: 'info',
    //   });
  };

  return (
    <main>
      <div>
        <h1>Login</h1>
        <form>
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {`Alert type: ${alert?.type} msg: ${alert?.msg}`}
          <hr />
          <button type="button" onClick={handleLoginClick}>
            Login
          </button>
          <button type="button" onClick={handleRegisterClick}>
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
