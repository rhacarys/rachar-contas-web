import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PartyState {
  activePartyId: string | null;
  lastSyncByParty: Record<string, string>;
  setActivePartyId: (id: string | null) => void;
  setLastSync: (partyId: string, timestamp: string) => void;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set) => ({
      activePartyId: null,
      lastSyncByParty: {},
      setActivePartyId: (id) => set({ activePartyId: id }),
      setLastSync: (partyId, timestamp) =>
        set((state) => ({
          lastSyncByParty: { ...state.lastSyncByParty, [partyId]: timestamp },
        })),
    }),
    {
      name: "party-storage",
    },
  ),
);
