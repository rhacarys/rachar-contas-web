import { z } from "zod";

// --- Auth & Users ---
export const RegisterRequestSchema = z.object({
  login: z.string().min(3).max(50),
  name: z.string(),
  password: z.string().min(6),
});

export const UserResponseSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  login: z.string().optional(),
});

export const UserUpdateRequestSchema = z.object({
  name: z.string().min(3).max(50),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export const LoginRequestSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserResponseSchema,
});

// --- Parties ---
export const PartyRequestSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  currencyCode: z.string(),
});

export const PartyResponseSchema = z.object({
  id: z.uuid().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  currencyCode: z.string().optional(),
  userBalance: z.number().optional(),
});

export const JoinPartyRequestSchema = z.object({
  code: z.string(),
  alias: z.string().min(2).max(50),
});

export const MemberBalanceSchema = z.object({
  membershipId: z.uuid().optional(),
  userId: z.uuid().optional(),
  alias: z.string().optional(),
  role: z.string().optional(),
  balance: z.number().optional(),
});

export const PartyBalanceResponseSchema = z.object({
  partyId: z.uuid().optional(),
  balances: z.array(MemberBalanceSchema).optional(),
});

export const UpdateAliasRequestSchema = z.object({
  alias: z.string().min(2).max(50),
});

// --- Expenses ---
export const SplitRequestSchema = z.object({
  debtorId: z.uuid(),
  amount: z.number(),
});

export const ExpenseRequestSchema = z.object({
  description: z.string(),
  amount: z.number(),
  date: z.string(), // format: date-time
  payerId: z.uuid(),
  type: z.enum(["PURCHASE", "TRANSFER"]).optional(),
  splits: z.array(SplitRequestSchema),
});

export const SplitResponseSchema = z.object({
  debtorId: z.uuid().optional(),
  amount: z.number().optional(),
});

export const ExpenseResponseSchema = z.object({
  id: z.uuid().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  date: z.string().optional(),
  payerId: z.uuid().optional(),
  type: z.enum(["PURCHASE", "TRANSFER"]).optional(),
  splits: z.array(SplitResponseSchema).optional(),
});

// --- Currencies ---
export const CurrencyResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
});

// --- Export Types ---
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;
export type PartyRequest = z.infer<typeof PartyRequestSchema>;
export type PartyResponse = z.infer<typeof PartyResponseSchema>;
export type JoinPartyRequest = z.infer<typeof JoinPartyRequestSchema>;
export type PartyBalanceResponse = z.infer<typeof PartyBalanceResponseSchema>;
export type UpdateAliasRequest = z.infer<typeof UpdateAliasRequestSchema>;
export type ExpenseRequest = z.infer<typeof ExpenseRequestSchema>;
export type ExpenseResponse = z.infer<typeof ExpenseResponseSchema>;
export type CurrencyResponse = z.infer<typeof CurrencyResponseSchema>;
