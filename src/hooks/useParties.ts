import { api } from "@/api/client";
import { db } from "@/database/db";
import { type UpdateAliasRequest } from "@/models/Schemas";
import { partyService } from "@/services/partyService";
import { usePartyStore } from "@/store/usePartyStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PARTIES_KEYS = {
  all: ["parties"] as const,
  currencies: ["currencies"] as const,
  balances: (id: string) => ["parties", id, "balances"] as const,
  sync: (id: string) => ["parties", id, "sync"] as const,
};

export function useUserParties() {
  return useQuery({
    queryKey: PARTIES_KEYS.all,
    queryFn: async () => {
      try {
        const serverParties = await partyService.getUserParties();
        await db.parties.bulkPut(serverParties);
      } catch (error) {
        console.debug(error);
      }
      return db.parties.filter((p) => !p.deletedAt).toArray();
    },
  });
}

export function useSyncParty(partyId: string | null) {
  const lastSync = usePartyStore((state) => state.lastSyncByParty[partyId || ""] || new Date(0).toISOString());
  const setLastSync = usePartyStore((state) => state.setLastSync);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: PARTIES_KEYS.sync(partyId || ""),
    queryFn: async () => {
      if (!partyId) return null;

      const data = await partyService.syncParty(partyId, lastSync);

      await db.transaction("rw", db.parties, db.memberships, db.expenses, async () => {
        if (data.party) await db.parties.put(data.party);
        if (data.memberships?.length) await db.memberships.bulkPut(data.memberships);
        if (data.expenses?.length) await db.expenses.bulkPut(data.expenses);
      });

      if (data.serverTimestamp) {
        setLastSync(partyId, data.serverTimestamp);
      }

      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(partyId) });

      return data;
    },
    enabled: !!partyId,
    refetchInterval: 30000,
  });
}

export function usePartyBalances(partyId: string | null) {
  return useQuery({
    queryKey: PARTIES_KEYS.balances(partyId || ""),
    queryFn: () => partyService.getPartyBalances(partyId!),
    enabled: !!partyId,
  });
}

export function useAvailableCurrencies() {
  return useQuery({
    queryKey: PARTIES_KEYS.currencies,
    queryFn: partyService.getAvailableCurrencies,
    staleTime: Infinity,
  });
}

export function useUpdateMyAlias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partyId, data }: { partyId: string; data: UpdateAliasRequest }) => {
      await api.put(`/parties/${partyId}/members/me/alias`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(variables.partyId) });
    },
  });
}

export function useLeaveParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partyId: string) => {
      await api.delete(`/parties/${partyId}/members/me`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.all });
    },
  });
}

export function useKickMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partyId, membershipId }: { partyId: string; membershipId: string }) => {
      await api.delete(`/parties/${partyId}/members/${membershipId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(variables.partyId) });
    },
  });
}
