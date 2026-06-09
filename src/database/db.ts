import { type ExpenseResponse, type MembershipResponse, type PartyResponse } from "@/models/Schemas";
import Dexie, { type Table } from "dexie";

export interface SyncQueueItem {
  id: string;
  type: "CREATE_EXPENSE" | "DELETE_EXPENSE";
  partyId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  createdAt: string;
}

export class AppDatabase extends Dexie {
  parties!: Table<PartyResponse, string>;
  memberships!: Table<MembershipResponse, string>;
  expenses!: Table<ExpenseResponse, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super("RacharContasDB");

    this.version(1).stores({
      parties: "&id, deletedAt",
      memberships: "&id, partyId, userId, deletedAt",
      expenses: "&id, partyId, payerId, deletedAt, date",
      syncQueue: "&id, type, partyId, createdAt",
    });
  }
}

export const db = new AppDatabase();
