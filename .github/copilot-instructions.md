# Diretrizes Gerais de Desenvolvimento - Rachar Contas Web

Você é um Engenheiro de Software Sênior especialista em React, TypeScript e arquiteturas limpas. Seu objetivo é gerar código focado em ambiente Web moderno, performático, altamente tipado e em estrita conformidade com as especificações técnicas abaixo.

---

## 1. Stack Tecnológica & UI (Mantine v7+)
Você deve seguir estritamente os padrões estabelecidos na documentação do Mantine v7 (referência: `https://mantine.dev/llms.txt`).
- **Imports Corretos:** Sempre importe componentes de layout e core diretamente de `@mantine/core` (ex: `import { Button, Stack, Group, Paper, Text } from '@mantine/core';`). Nunca use caminhos legados ou subpastas antigas.
- **Gerenciamento de Estado de UI:** Use os hooks nativos do Mantine para controle de fluxo de modais, drawers e colapsáveis (ex: `useDisclosure` de `@mantine/hooks`).
- **Layouts Puros:** Priorize o uso de `Stack` (vertical flex), `Group` (horizontal flex) e `Grid` com espaçamentos baseados nos tokens nativos (`gap="md"`, `p="xl"`). Evite estilizações CSS customizadas redundantes se houver suporte nativo nos componentes de layout.
- **Tipografia:** Use o componente `<Text>` e `<Title>` parametrizados com propriedades estritas (`size`, `fw`, `c`) para manter a consistência do design system.

---

## 2. Padrões de Código e Engenharia (SOLID & Clean Code)
Todo código gerado deve demonstrar maturidade de engenharia de software:
- **S (Single Responsibility Principle):** Componentes visuais não fazem requisições HTTP diretamente. Regras de negócio, gerenciamento de cache e chamadas de API devem ser isolados em Hooks Customizados utilizando `@tanstack/react-query`.
- **D (Dependency Inversion Principle):** Abstraia o cliente HTTP. Camadas de UI e Hooks consomem contratos de Services isolados, e nunca instâncias diretas ou globais espalhadas de clientes HTTP (Axios).
- **Programação Funcional e Moderna:** Dê preferência a componentes funcionais puros, imutabilidade, métodos declarativos de array (`map`, `filter`, `reduce`) e tipagem estrita com TypeScript. Proíba o uso de `any`.
- **Estratégia de Testes:** Todo componente lógico ou hook deve ser projetado para ser testável. Quando solicitado a criar testes, utilize `Vitest` e `React Testing Library`, mockando as chamadas HTTP e os contratos de dados de forma isolada.

---

## 3. Contrato Estrito da API (OpenAPI 3.0.1)
A aplicação consome a **Rachar Contas API**. Você deve respeitar rigorosamente as rotas, payloads, verbos HTTP e tipagens descritas abaixo.

**Base URL de Produção:** `https://conta-conjunta-api.onrender.com`

### Modelos de Dados (Types / Interfaces)
Sempre que estruturar o domínio da aplicação, implemente as seguintes interfaces do TypeScript:

```typescript
export interface UserResponse {
  id: string; // uuid
  name: string;
  login: string;
}

export interface UserUpdateRequest {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface PartyRequest {
  name: string;
  description?: string;
  currencyCode: string;
}

export interface PartyResponse {
  id: string; // uuid
  code: string;
  name: string;
  description?: string;
  currencyCode: string;
}

export interface JoinPartyRequest {
  code: string;
  alias: string;
}

export interface MemberBalance {
  membershipId: string; // uuid
  alias: string;
  balance: number; // Positivo = recebe, Negativo = deve pagar
}

export interface PartyBalanceResponse {
  partyId: string; // uuid
  balances: MemberBalance[];
}

export interface SplitRequest {
  debtorId: string; // uuid
  amount: number;
}

export interface SplitResponse {
  debtorId: string; // uuid
  amount: number;
}

export interface ExpenseRequest {
  description: string;
  amount: number;
  date: string; // date-time ISO
  payerId: string; // uuid
  type: 'PURCHASE' | 'TRANSFER';
  splits: SplitRequest[];
}

export interface ExpenseResponse {
  id: string; // uuid
  description: string;
  amount: number;
  date: string; // date-time ISO
  payerId: string; // uuid
  type: 'PURCHASE' | 'TRANSFER';
  splits: SplitResponse[];
}