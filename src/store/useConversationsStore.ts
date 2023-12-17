import { create } from 'zustand';

export interface ConversationsStore {
  channels: string[];
  channelSelected?: string;

  fetchChannels: () => void;

  setChannelSelected: (channel?: string) => void;
  addChannel: (channel: string) => void;

  reset: () => void;
}

const initialState = {
  channels: [],
  channelSelected: undefined,
};

export const useConversationsStore = create<ConversationsStore>()((set) => ({
  channels: initialState.channels,
  channelSelected: initialState.channelSelected,

  // Actions
  fetchChannels: async () => {
    const res = await fetch(
      'http://localhost:4000/conversations/show-channels'
    );
    set({ channels: await res.json() });
  },

  setChannelSelected: (channel?: string) => {
    set({ channelSelected: channel });
  },

  addChannel: (channel: string) => {
    set((state) => ({
      channels: state.channels.includes(channel)
        ? state.channels
        : [...state.channels, channel],
      channelSelected: channel,
    }));
  },

  reset: () => set(initialState),
}));
