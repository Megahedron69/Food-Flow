import { create } from "zustand";

type OfflineQueueState = {
  pendingCount: number;
  isSyncing: boolean;
  setPendingCount: (pendingCount: number) => void;
  setIsSyncing: (isSyncing: boolean) => void;
};

export const useOfflineQueueStore = create<OfflineQueueState>((set) => ({
  pendingCount: 0,
  isSyncing: false,
  setPendingCount: (pendingCount) => {
    set({ pendingCount });
  },
  setIsSyncing: (isSyncing) => {
    set({ isSyncing });
  }
}));
