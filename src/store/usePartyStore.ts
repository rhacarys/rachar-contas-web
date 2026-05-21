import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PartyState {
  activePartyId: string | null;
  setActivePartyId: (id: string | null) => void;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set) => ({
      activePartyId: null,
      setActivePartyId: (id) => set({ activePartyId: id }),
    }),
    {
      name: "party-storage",
    },
  ),
);
