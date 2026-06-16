import {
  type CurrencyResponse,
  type ExpenseRequest,
  type ExpenseResponse,
  type PartyRequest,
  type PartyResponse,
  type UpdateAliasRequest,
} from "@/models/Schemas";
import { http, HttpResponse } from "msw";

const BASE_URL = import.meta.env.VITE_API_URL;

const MOCKED_CURRENT_USER_ID = "uuid-do-nathaniel";

const mockCurrencies: CurrencyResponse[] = [
  { id: "11111111-2222-3333-4444-555555555555", code: "BRL", name: "Real Brasileiro" },
  { id: "22222222-3333-4444-5555-666666666666", code: "USD", name: "Dólar Americano" },
  { id: "33333333-4444-4444-5555-766666666666", code: "EUR", name: "Euro" },
  { id: "44444444-5555-6666-7777-888888888888", code: "THB", name: "Baht Tailandês" },
];

const mockParties: PartyResponse[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    code: "CHURRAS26",
    name: "Churrasco do Fim de Semana",
    description: "Grupo para dividir os custos da carne e bebidas",
    currencyCode: "BRL",
    myBalance: -45.5,
  },
  {
    id: "987f6543-e21b-73d1-b654-987654321000",
    code: "TRIP2026",
    name: "Viagem para Bangkok",
    description: "Custos da Eurotrip/Asia",
    currencyCode: "THB",
    myBalance: 1200.0,
  },
];

let mockExpenses: ExpenseResponse[] = [
  {
    id: "exp-123",
    description: "Picanha e Carvão",
    amount: 150.0,
    date: new Date().toISOString(),
    payerId: MOCKED_CURRENT_USER_ID,
    type: "PURCHASE",
    splits: [
      { debtorId: MOCKED_CURRENT_USER_ID, amount: 50 },
      { debtorId: "uuid-do-robson", amount: 100 },
    ],
  },
];

export const handlers = [
  // --- Auth & Users Mocks ---
  http.post(`${BASE_URL}/auth/login`, async () => {
    return HttpResponse.json({
      token: "mocked-jwt-token-xyz123",
    });
  }),

  http.post(`${BASE_URL}/auth/register`, async () => {
    return new HttpResponse(null, { status: 201 });
  }),

  // GET: Listar Moedas Disponíveis
  http.get(`${BASE_URL}/currencies`, () => {
    return HttpResponse.json(mockCurrencies);
  }),

  // --- Parties Mocks ---

  // GET: Listar Grupos do Usuário
  http.get(`${BASE_URL}/parties`, () => {
    return HttpResponse.json(mockParties);
  }),

  // POST: Criar Novo Grupo
  http.post(`${BASE_URL}/parties`, async ({ request }) => {
    const body = (await request.json()) as PartyRequest;

    const newParty: PartyResponse = {
      id: crypto.randomUUID(),
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: body.name,
      description: body.description || "",
      currencyCode: body.currencyCode.toUpperCase(),
      myBalance: 0.0,
    };

    mockParties.push(newParty);
    return HttpResponse.json(newParty, { status: 201 });
  }),

  // PUT: Atualizar Informações do Grupo (Usado pelo Admin Drawer)
  http.put(`${BASE_URL}/parties/:partyId`, async ({ params, request }) => {
    const { partyId } = params;
    const body = (await request.json()) as PartyRequest;

    const index = mockParties.findIndex((p) => p.id === partyId);
    if (index !== -1) {
      mockParties[index] = {
        ...mockParties[index],
        name: body.name,
        description: body.description || "",
        currencyCode: body.currencyCode,
      };
      return HttpResponse.json(mockParties[index]);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // POST: Entrar em um Grupo Existente (Link de Convite)
  http.post(`${BASE_URL}/parties/join`, async ({ request }) => {
    const body = (await request.json()) as { code: string; alias: string };

    // Procura se o grupo existe pelo código enviado no link
    const existingParty = mockParties.find((p) => p.code === body.code.toUpperCase());

    if (existingParty) {
      return HttpResponse.json(existingParty);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // PUT: Editar meu próprio apelido (alias) no grupo
  http.put(`${BASE_URL}/parties/:partyId/members/me/alias`, async ({ request }) => {
    const body = (await request.json()) as UpdateAliasRequest;
    console.log("Novo apelido mockado salvo com sucesso:", body.alias);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET: Calcular Saldo Detalhado do Grupo (Atualizado com userId e role)
  http.get(`${BASE_URL}/parties/:partyId/balances`, ({ params }) => {
    const { partyId } = params;
    const currentParty = mockParties.find((p) => p.id === partyId);

    return HttpResponse.json({
      partyId: partyId,
      balances: [
        {
          membershipId: "member-nathaniel-id",
          userId: MOCKED_CURRENT_USER_ID, // Vincula ao seu ID logado para validação
          alias: "Nathaniel",
          role: "ADMIN", // Define você como administrador do grupo para abrir o Drawer
          balance: currentParty ? currentParty.myBalance : 0,
        },
        {
          membershipId: "member-robson-id",
          userId: "uuid-do-robson",
          alias: "Robson",
          role: "MEMBER",
          balance: currentParty?.id === "123e4567-e89b-12d3-a456-426614174000" ? 45.5 : -1200.0,
        },
      ],
    });
  }),

  // --- Expenses Mocks ---

  // GET: Listar Despesas
  http.get(`${BASE_URL}/parties/:partyId/expenses`, () => {
    return HttpResponse.json(mockExpenses);
  }),

  // POST: Criar Despesa
  http.post(`${BASE_URL}/parties/:partyId/expenses`, async ({ request }) => {
    const body = (await request.json()) as ExpenseRequest;
    const newExpense: ExpenseResponse = {
      id: crypto.randomUUID(),
      ...body,
    };
    mockExpenses.unshift(newExpense);
    return HttpResponse.json(newExpense, { status: 201 });
  }),

  // DELETE: Apagar Despesa
  http.delete(`${BASE_URL}/parties/:partyId/expenses/:expenseId`, ({ params }) => {
    mockExpenses = mockExpenses.filter((e) => e.id !== params.expenseId);
    return new HttpResponse(null, { status: 204 });
  }),
];
