import { api } from "@/api/client";
import { type UpdateAliasRequest } from "@/models/Schemas";
import { partyService } from "@/services/partyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PARTIES_KEYS = {
  all: ["parties"] as const,
  currencies: ["currencies"] as const,
  balances: (id: string) => ["parties", id, "balances"] as const,
};

export function useUserParties() {
  return useQuery({
    queryKey: PARTIES_KEYS.all,
    queryFn: partyService.getUserParties,
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
