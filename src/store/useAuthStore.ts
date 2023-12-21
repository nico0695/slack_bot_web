import { create } from 'zustand';

export interface UserStore {
  username: string | null;

  setUsername: (username: string) => void;
}

const initialState = {
  username: null,
};

export const useAuthStore = create<UserStore>()((set) => ({
  username: initialState.username,

  setUsername: (username: string) => {
    set({ username });
  },
}));
