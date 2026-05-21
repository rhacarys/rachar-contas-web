import { partyService } from "@/services/partyService";
import { useQuery } from "@tanstack/react-query";

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
