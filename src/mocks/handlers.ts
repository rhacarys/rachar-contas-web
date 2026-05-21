import { type CurrencyResponse, type PartyRequest, type PartyResponse } from "@/models/Schemas";
import { http, HttpResponse } from "msw";

const BASE_URL = import.meta.env.VITE_API_URL;

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
    userBalance: -45.5,
  },
  {
    id: "987f6543-e21b-73d1-b654-987654321000",
    code: "TRIP2026",
    name: "Viagem para Bangkok",
    description: "Custos da Eurotrip/Asia",
    currencyCode: "THB",
    userBalance: 1200.0,
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
      userBalance: 0.0, // Todo grupo novo inicia com o balanço do usuário zerado
    };

    mockParties.push(newParty);

    return HttpResponse.json(newParty, { status: 201 });
  }),

  // GET: Calcular Saldo Detalhado do Grupo
  http.get(`${BASE_URL}/parties/:partyId/balances`, ({ params }) => {
    const { partyId } = params;
    const currentParty = mockParties.find((p) => p.id === partyId);

    return HttpResponse.json({
      partyId: partyId,
      balances: [
        {
          membershipId: crypto.randomUUID(),
          alias: "Nathaniel (Você)",
          balance: currentParty ? currentParty.userBalance : 0,
        },
        {
          membershipId: crypto.randomUUID(),
          alias: "Robson",
          balance: currentParty?.id === "123e4567-e89b-12d3-a456-426614174000" ? 45.5 : -1200.0,
        },
      ],
    });
  }),
];
