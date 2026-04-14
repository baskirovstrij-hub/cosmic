import { create } from 'zustand';

interface UserData {
  date: string;
  time: string;
  lat: number;
  lng: number;
  results?: any;
}

interface SynastryStore {
  user1: UserData | null;
  user2: UserData | null;
  setUser1: (data: UserData) => void;
  setUser2: (data: UserData) => void;
  reset: () => void;
}

export const useSynastryStore = create<SynastryStore>((set) => ({
  user1: null,
  user2: null,
  setUser1: (data) => set({ user1: data }),
  setUser2: (data) => set({ user2: data }),
  reset: () => set({ user1: null, user2: null }),
}));
