# LiveDash

Dashboard em tempo real para monitoramento de entrada de clientes, gestão de comandas e estatísticas de ocupação.

---

## Sumário

- [Execução rápida](#execução-rápida)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Gerenciamento de estado](#gerenciamento-de-estado)
- [Realtime e WebSocket](#realtime-e-websocket)
- [Docker](#docker)
- [Testes](#testes)
- [Relatório técnico — uso de IA](#relatório-técnico--uso-de-ia)

---

## Execução rápida

**Pré-requisitos:** Node.js 20+, npm 10+

```bash
# 1. Servidor WebSocket
cd live-server
npm install
npm run dev        # porta 3333

# 2. Frontend (novo terminal, raiz do projeto)
npm install
npm run dev        # porta 5173
```

Acesse `http://localhost:5173`.

**Com Docker (apenas frontend):**

```bash
docker compose up --build
# acesse http://localhost:80
```

---

## Arquitetura

```
drzyy-live-dashboard-1/
├── live-server/          # Servidor Node.js + Socket.IO
│   └── src/
│       ├── server.js         # HTTP server + Socket.IO
│       └── guest-generator.js
│
├── src/                  # Aplicação React
│   ├── components/       # UI — folha de componentes
│   ├── hooks/            # Lógica reutilizável (side-effects)
│   ├── store/            # Estado global (Zustand)
│   ├── types/            # Interfaces e schemas Zod
│   ├── utils/            # Funções puras
│   └── pages/            # Composição de páginas
│
├── Dockerfile            # Multi-stage build
├── docker-compose.yml
└── nginx.conf
```

### Separação de responsabilidades

| Camada       | Responsabilidade                                               |
|--------------|----------------------------------------------------------------|
| `pages/`     | Composição de layout, ponto de entrada de hooks               |
| `components/`| Renderização e interação local, sem acesso direto ao store     |
| `hooks/`     | Side-effects: WebSocket, filtros, modal                        |
| `store/`     | Estado global imutável via Zustand                             |
| `utils/`     | Funções puras sem dependências de framework                    |
| `types/`     | Contratos de dados — interfaces TypeScript e schemas Zod       |

O fluxo de dados é unidirecional: `live-server → WebSocket → hook → store → componentes`.

---

## Componentes

### `AppHeader`

Barra de navegação sticky. Consome `connectionStatus` do `useLiveFeedStore` e exibe um banner animado quando o WebSocket está desconectado ou em reconexão.

Estados do banner:

| Status         | Cor     | Mensagem                                  |
|----------------|---------|-------------------------------------------|
| `reconnecting` | Amarelo | A reconectar...                           |
| `error`        | Vermelho| Falha na conexão. Tentando reconectar...  |
| `connected`    | —       | Banner oculto                             |

### `DashboardStats`

Quatro cards de métrica derivados diretamente do store: total presente, total VIP, taxa de ocupação e último ID. Atualizam a cada novo evento `new-customer`.

### `DataTable`

Tabela paginada de clientes com:
- `SearchInput` — filtra por nome via `useSearch` (normalização de acentos com `normalizeText`)
- `VipFilter` — alterna exibição exclusiva de VIPs via `useVipFilter`
- `GuestRow` — linha clicável que abre o `GuestModal`
- `TableEmpty` — estado vazio com mensagem contextual

### `GuestModal`

Modal de comanda do cliente. Composto por:

- **`OrderForm`** — formulário de adição de item com React Hook Form + Zod
- **`OrderItemsList`** — lista de itens com controles de quantidade (−/+), remoção e total calculado

### `AppModal`

Wrapper genérico de modal: fundo com backdrop, fechar por tecla `Escape` ou clique fora.

---

## Gerenciamento de estado

O projeto usa **Zustand** com dois stores independentes.

### `useLiveFeedStore`

Responsável pelo feed de clientes em tempo real.

```
state:
  guests[]          — lista completa de clientes (mais recente primeiro)
  totalPresent      — contagem total
  totalVip          — contagem de VIPs
  occupancyRate     — percentual de ocupação (capacidade: 500)
  connectionStatus  — 'connected' | 'reconnecting' | 'error'

actions:
  addGuest(guest)               — prepend + recalcula métricas
  setConnectionStatus(status)   — atualizado pelos eventos do Socket.IO
```

Todas as métricas (`totalPresent`, `totalVip`, `occupancyRate`) são **estado derivado** calculado dentro de `addGuest` — não há seletores externos, o cálculo acontece na mutação.

### `useOrderStore`

Responsável pelas comandas, indexadas por `guestId`.

```
state:
  orders: Record<guestId, Order>

actions:
  addItem(guestId, item)                  — cria comanda se não existir, appenda item com id sequencial
  removeItem(guestId, itemId)             — filtra item pelo id
  updateQuantity(guestId, itemId, qty)    — map imutável sobre os itens
  getOrder(guestId)                       — retorna comanda ou objeto vazio
```

O **total da comanda** é calculado por derivação no componente (`items.reduce`), não armazenado — evita dessincronia.

---

## Realtime e WebSocket

### Servidor (`live-server`)

- Node.js com `node:http` nativo + **Socket.IO 4**
- Porta `3333`, CORS aberto para desenvolvimento
- Ao conectar um cliente, inicia `setInterval` de 3 s emitindo `new-customer`
- Ao desconectar, limpa o interval — sem memory leak por cliente

```
Evento emitido: new-customer
Payload: { id, name, age, isVip, entryTime }
```

### Cliente (`use-live-feed.ts`)

- **socket.io-client** gerenciado dentro de `useEffect`
- Reconexão automática: `reconnectionAttempts: Infinity`, delay de 1 s crescendo até 10 s (exponential backoff nativo do Socket.IO)
- Cleanup: `socket.disconnect()` no retorno do `useEffect` — sem conexões órfãs em StrictMode

Mapeamento de eventos para status:

```
connect           → 'connected'
disconnect        → 'reconnecting'
reconnect_attempt → 'reconnecting'
connect_error     → 'error'
```

---

## Docker

### Estratégia multi-stage

O `Dockerfile` usa dois estágios para manter a imagem final mínima (~25 MB):

```
Stage 1 — builder (node:22-alpine)
  npm ci                  instala dependências com lockfile
  npm run build           tsc + vite build → /app/dist

Stage 2 — serve (nginx:1.27-alpine)
  COPY /app/dist          apenas os assets estáticos compilados
  COPY nginx.conf         configuração customizada
```

A imagem final não contém Node.js, código-fonte ou `node_modules`.

### Nginx

- **Gzip** habilitado para JS, CSS, SVG e JSON
- **Cache imutável** (`Cache-Control: public, immutable; max-age=31536000`) para assets com hash no nome — gerados pelo Vite automaticamente
- **SPA fallback** via `try_files $uri $uri/ /index.html` — suporte a client-side routing

### Docker Compose

```yaml
services:
  dashboard:
    build: .
    ports: ["80:80"]
    restart: unless-stopped
```

Sobe o frontend compilado. O `live-server` é executado separadamente (Node.js local ou container adicional).

---

## Testes

Configuração: **Vitest** com ambiente `jsdom`, `globals: true` e setup via `@testing-library/jest-dom`.

### Suítes

#### `total.test.ts` — cálculo do total

Testa a função `calcTotal` (derivada dos itens da comanda) de forma isolada, sem dependência de componentes ou store.

| Cenário                              | Verificação                     |
|--------------------------------------|---------------------------------|
| Lista vazia                          | retorna `0`                     |
| Item único                           | `quantidade × preço`            |
| Múltiplos itens                      | soma dos subtotais              |
| Valores decimais                     | `toBeCloseTo` para float        |
| Atualização de quantidade            | reflete novo subtotal           |

#### `order-store.test.ts` — store de comandas

Testa as actions `addItem` e `removeItem` diretamente via `useOrderStore.getState()`. O store é resetado antes de cada teste com `useOrderStore.setState({ orders: {} })`.

| Cenário                                   | Verificação                         |
|-------------------------------------------|-------------------------------------|
| Adicionar primeiro item                   | comanda criada, item presente       |
| Adicionar múltiplos itens                 | acumula na mesma comanda            |
| Isolamento entre guests                   | comandas independentes              |
| Remover item correto                      | produto certo permanece             |
| Remover de guest inexistente              | estado não alterado                 |

#### `order-item-schema.test.ts` — validação Zod

Testa o `orderItemSchema` diretamente, cobrindo coerção de tipos (inputs de formulário chegam como `string`) e todas as regras de validação.

| Campo       | Cenários testados                              |
|-------------|------------------------------------------------|
| `product`   | vazio rejeitado, mensagem correta              |
| `quantity`  | zero, negativo e fracionado rejeitados         |
| `unitPrice` | zero, negativo rejeitados; `0.01` aceito       |
| coerção     | `"3"` → `3`, `"4.50"` → `4.5`                 |

#### `order-form.test.tsx` — formulário React

Testa o componente `OrderForm` com `@testing-library/react` + `userEvent`, integrando React Hook Form e Zod no DOM virtual.

| Cenário                          | Verificação                              |
|----------------------------------|------------------------------------------|
| Submissão válida                 | `onAdd` chamado com dados corretos       |
| Reset após submit                | campo produto vazio após adição          |
| Produto vazio                    | mensagem "Informe o produto" visível     |
| Quantidade zero                  | mensagem "Mínimo 1" visível              |
| Preço zero                       | mensagem "Informe o preço" visível       |
| Erros presentes                  | `onAdd` não é chamado                    |

### Executar

```bash
npm test          # modo watch
npm test -- --run # execução única (CI)
```

---

## Relatório técnico — uso de IA

Este projeto foi desenvolvido com assistência do **Amazon Q Developer** diretamente no IDE. A seguir, uma descrição honesta de como a IA foi utilizada em cada etapa.

### O que a IA fez

**Scaffolding de componentes**
A IA gerou a estrutura inicial de componentes seguindo o padrão já estabelecido no projeto (pasta + `index.ts` + `.module.css`), mantendo consistência sem necessidade de instrução explícita sobre o padrão.

**Store Zustand**
A IA criou os dois stores (`useLiveFeedStore`, `useOrderStore`) com tipagem TypeScript completa, ações imutáveis e o padrão de estado derivado (métricas calculadas na mutação, total da comanda calculado no componente).

**Formulário com React Hook Form + Zod**
Gerou o schema de validação, o componente de formulário e a integração entre os dois, incluindo mensagens de erro em português e reset automático após submissão.

**Servidor WebSocket**
Criou o `live-server` com Node.js puro (sem framework HTTP), Socket.IO 4, gerenciamento de interval por conexão e limpeza no disconnect.

**Reconexão e status de conexão**
Implementou o mapeamento completo de eventos Socket.IO para estados de UI (`connected`, `reconnecting`, `error`) e o banner animado no header.

**Docker**
Gerou o `Dockerfile` multi-stage, `nginx.conf` com gzip + cache imutável + SPA fallback e `.dockerignore` correto.

**Testes**
Escreveu todos os testes com cobertura de casos limite (quantidade fracionada, guest inexistente, coerção de tipos).

**Formatação monetária**
Identificou que `Intl.NumberFormat` deve ser instanciado uma única vez fora do componente para evitar recriação por render e moveu a função para `utils/`.

### O que exigiu intervenção manual

**Compatibilidade Zod v4 + @hookform/resolvers**
A IA instalou o Zod na versão mais recente (v4.4.3), que tem API interna diferente. O resolver tentava importar `zod/v4/core`, que não existe no bundle do Zod v3. Foi necessário fazer downgrade para Zod v3, decisão tomada durante a sessão de debug dos testes.

**Globals do Vitest vs imports explícitos**
Os primeiros testes importavam `describe/it/expect` explicitamente do `vitest` ao mesmo tempo que `globals: true` estava configurado, causando conflito de runner. A IA corrigiu removendo os imports após identificar o erro.

### Avaliação geral

A IA acelerou significativamente a produção de código repetitivo e estrutural, manteve consistência de estilo e nomenclatura ao longo de todas as sessões e identificou proativamente padrões de qualidade (sem memory leak, estado derivado, cleanup de effects). Os erros ocorreram em incompatibilidades de versão de dependências — área onde o contexto em tempo real do ambiente é necessário para resolver.
