import { db } from "@/database/db";
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
      return db.expenses
        .where({ partyId })
        .filter((e) => !e.deletedAt)
        .toArray();
    },
    enabled: !!partyId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partyId, data }: { partyId: string; data: ExpenseRequest }) => {
      const expenseId = crypto.randomUUID();
      const now = new Date().toISOString();

      const expenseRecord = {
        id: expenseId,
        partyId,
        description: data.description,
        amount: data.amount,
        date: data.date,
        payerId: data.payerId,
        type: data.type || "PURCHASE",
        splits: data.splits.map((s) => ({
          debtorId: s.debtorId,
          amount: s.amount,
        })),
      } as ExpenseResponse & { partyId: string };

      await db.transaction("rw", db.expenses, db.syncQueue, async () => {
        await db.expenses.put(expenseRecord);
        await db.syncQueue.put({
          id: crypto.randomUUID(),
          type: "CREATE_EXPENSE",
          partyId,
          payload: { ...data, id: expenseId },
          createdAt: now,
        });
      });

      return expenseRecord;
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
      const now = new Date().toISOString();

      await db.transaction("rw", db.expenses, db.syncQueue, async () => {
        const expense = await db.expenses.get(expenseId);
        if (expense) {
          await db.expenses.update(expenseId, { deletedAt: now });
        }
        await db.syncQueue.put({
          id: crypto.randomUUID(),
          type: "DELETE_EXPENSE",
          partyId,
          payload: expenseId,
          createdAt: now,
        });
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEYS.list(variables.partyId) });
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.balances(variables.partyId) });
    },
  });
}
