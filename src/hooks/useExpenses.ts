import { api } from "@/api/client";
import { type ExpenseRequest, type ExpenseResponse } from "@/models/Schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PARTIES_KEYS } from "./useParties";

export const EXPENSES_KEYS = {
  list: (partyId: string) => ["parties", partyId, "expenses"] as const,
};

export function usePartyExpenses(partyId: string) {
  return useQuery({
    queryKey: EXPENSES_KEYS.list(partyId),
    queryFn: async () => {
      const { data } = await api.get<ExpenseResponse[]>(`/parties/${partyId}/expenses`);
      return data;
    },
    enabled: !!partyId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partyId, data }: { partyId: string; data: ExpenseRequest }) => {
      const response = await api.post<ExpenseResponse>(`/parties/${partyId}/expenses`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEYS.list(variables.partyId) });
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(variables.partyId) });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partyId, expenseId }: { partyId: string; expenseId: string }) => {
      await api.delete(`/parties/${partyId}/expenses/${expenseId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEYS.list(variables.partyId) });
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(variables.partyId) });
    },
  });
}
