import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { saveAuthData } from '../shared/utils/localStorage/auth.utils';

export const supabase = createClientComponentClient();

export interface IUserStore {
  username: string | null;
  email: string | null;
  auth?: {
    userId?: string;
    token: string;
    expires_at?: number;
    refresh_token: string;
  };
}

export interface IUserStoreHook extends IUserStore {
  setUsername: (username: string) => void;

  loginSupabase: (data: {
    email: string;
    password: string;
  }) => Promise<{ status: boolean; message?: string }>;
}

const initialState: IUserStore = {
  username: null,
  email: null,
};

export const useAuthStore = create<IUserStoreHook>()(
  persist(
    (set) => ({
      username: initialState.username,
      email: initialState.email,

      setUsername: (username: string) => {
        set({ username });
      },

      loginSupabase: async (data: {
        email: string;
        password: string;
      }): Promise<{ status: boolean; message?: string }> => {
        const { data: responseData, error } =
          await supabase.auth.signInWithPassword(data);

        if (error || !responseData) {
          console.error(error);
          return {
            status: false,
            message: error?.message || 'Something went wrong',
          };
        }

        set({
          username: responseData.user.email?.split('@')[0],
          email: responseData.user.email,
          auth: {
            userId: responseData.user.id,
            token: responseData.session.access_token,
            expires_at: responseData.session.expires_at,
            refresh_token: responseData.session.refresh_token,
          },
        });

        saveAuthData(responseData.user.id, responseData.session.access_token);

        return {
          status: true,
        };
      },
    }),
    {
      name: 'user-session', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
