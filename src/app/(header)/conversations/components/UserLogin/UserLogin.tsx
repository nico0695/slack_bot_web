import React from 'react';
import { useAuthStore } from '../../../../../store/useAuthStore';

const UserLogin = () => {
  const { setUsername } = useAuthStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (e.currentTarget.username.value) {
      const username = e.currentTarget.username.value.replace(/\./g, '').trim();

      setUsername(username);

      // reset
      e.currentTarget.username.value = '';
    }
  };

  return (
    <div>
      <form action="submit" onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Name..."
          autoFocus
          onKeyDown={(e) => {
            if (e.keyCode === 32) {
              e.preventDefault();
            }
          }}
        />
        <button type="submit">Conectar</button>
      </form>
    </div>
  );
};

export default UserLogin;
