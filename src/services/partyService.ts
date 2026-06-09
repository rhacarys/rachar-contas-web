import { api } from "../api/client";
import {
  type CurrencyResponse,
  type ExpenseRequest,
  type ExpenseResponse,
  type JoinPartyRequest,
  type PartyBalanceResponse,
  type PartyRequest,
  type PartyResponse,
  type SyncResponse,
} from "../models/Schemas";

export const partyService = {
  getUserParties: async (): Promise<PartyResponse[]> => {
    const response = await api.get<PartyResponse[]>("/parties");
    return response.data;
  },
  createParty: async (data: PartyRequest): Promise<PartyResponse> => {
    const response = await api.post<PartyResponse>("/parties", data);
    return response.data;
  },
  updateParty: async (partyId: string, data: PartyRequest): Promise<PartyResponse> => {
    const response = await api.put<PartyResponse>(`/parties/${partyId}`, data);
    return response.data;
  },
  joinParty: async (data: JoinPartyRequest): Promise<PartyResponse> => {
    const response = await api.post<PartyResponse>("/parties/join", data);
    return response.data;
  },
  getPartyBalances: async (partyId: string): Promise<PartyBalanceResponse> => {
    const response = await api.get<PartyBalanceResponse>(`/parties/${partyId}/balances`);
    return response.data;
  },
  leaveParty: async (partyId: string): Promise<void> => {
    await api.delete(`/parties/${partyId}/members/me`);
  },
  kickMember: async (partyId: string, membershipId: string): Promise<void> => {
    await api.delete(`/parties/${partyId}/members/${membershipId}`);
  },
  getPartyExpenses: async (partyId: string): Promise<ExpenseResponse[]> => {
    const response = await api.get<ExpenseResponse[]>(`/parties/${partyId}/expenses`);
    return response.data;
  },
  createExpense: async (partyId: string, data: ExpenseRequest): Promise<ExpenseResponse> => {
    const response = await api.post<ExpenseResponse>(`/parties/${partyId}/expenses`, data);
    return response.data;
  },
  deleteExpense: async (partyId: string, expenseId: string): Promise<void> => {
    await api.delete(`/parties/${partyId}/expenses/${expenseId}`);
  },
  getAvailableCurrencies: async (): Promise<CurrencyResponse[]> => {
    const response = await api.get<CurrencyResponse[]>("/currencies");
    return response.data;
  },
  syncParty: async (partyId: string, lastSync: string): Promise<SyncResponse> => {
    const response = await api.get<SyncResponse>(`/parties/${partyId}/sync`, {
      params: { lastSync },
    });
    return response.data;
  },
};
