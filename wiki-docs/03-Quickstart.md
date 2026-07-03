# Quickstart

Este guia apresenta um resumo rápido do fluxo completo de uso do Mesa do Secretário, desde a configuração inicial até a exportação da ata finalizada.

Para instruções detalhadas de instalação, consulte a página [Instalação](Instalacao).

---

## Fluxo de Uso (5 Etapas)

O processo de geração de uma ata segue estas cinco etapas:

### 1. Configurar a Loja

Na primeira vez que usar a aplicação, configure os dados da sua loja maçônica:

- **Nome da loja** e número
- **Data de fundação**
- **Nome do templo** e endereço
- **Cidade e estado**

Esses dados ficam salvos automaticamente e são reutilizados em todas as sessões futuras.

### 2. Selecionar o Tipo de Sessão

Escolha o tipo de sessão que será realizada:

| Tipo          | Quando usar                         |
| ------------- | ----------------------------------- |
| **Econômica** | Sessão de trabalho rotineira        |
| **Magna**     | Sessão solene com tema especial     |
| **Conjunta**  | Sessão compartilhada com outra loja |

Dependendo do tipo selecionado, campos adicionais podem aparecer (tema, orador convidado, autoridades, ato especial).

### 3. Preencher a Ata

Preencha os campos da ata:

- **Configuração da sessão** — número, data, hora de início e encerramento, número de presença
- **Ofíciais** — Venerável Mestre, 1º Vigilante, 2º Vigilante, Orador, Secretário
- **Visitantes** — adicione visitantes um a um com o botão de adicionar
- **Palavra decada decada** — Sul, Norte e Oriente
- **Expedientes** — Balaustre, Atos e Decretos, Expedientes, Bolsa de Propostas

Todos os campos são salvos automaticamente conforme você digita.

### 4. Revisar o Preview

O preview em tempo real mostra a ata formatada no formato A4, exatamente como será impressa. Você pode:

- Visualizar o documento completo
- Navegar entre páginas (se a ata for longa)
- Ajustar o zoom do preview

### 5. Imprimir ou Exportar

Quando a ata estiver pronta:

1. Clique no botão de **imprimir** (ou `Ctrl+P` / `Cmd+P`)
2. Na janela de impressão do navegador, selecione **Salvar como PDF**
3. Escolha o destino e confirme

---

## Comandos Essenciais

Se você é um desenvolvedor que vai trabalhar no código:

```bash
# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn dev

# Executar testes unitários
yarn test

# Executar testes E2E
yarn test:e2e

# Build de produção
yarn build

# Gerar instalador Windows
yarn dist:win

# Gerar instalador macOS
yarn dist:mac
```

---

## Mapa do Repositório

Entenda onde encontrar cada parte do código:

| Caminho                     | O que contém                                    |
| --------------------------- | ----------------------------------------------- |
| `src/features/session/`     | Tipos de sessão, configuração, campos magnos    |
| `src/features/officers/`    | Formulário de oficiais                          |
| `src/features/visitors/`    | Gestão de visitantes                            |
| `src/features/preview/`     | Preview da ata em formato A4                    |
| `src/features/loja-config/` | Configuração da loja                            |
| `src/features/palavra/`     | Palavra de cada coluna                          |
| `src/components/ui/`        | Componentes reutilizáveis (Button, Input, etc.) |
| `src/components/layout/`    | Layout da aplicação (Sidebar, Preview)          |
| `src/hooks/`                | Estado global da aplicação (`useAtaState`)      |
| `src/services/`             | Persistência de dados (`storage.ts`)            |
| `src/types/`                | Tipos TypeScript (`ata.ts`)                     |
| `src/styles/`               | CSS fatiado (tokens, layout, components)        |
| `src/electron/`             | Processo principal do Electron                  |
| `tests/e2e/`                | Testes E2E (Playwright)                         |

---

## Formato da Ata

A ata segue o padrão ABNT para documentos oficiais, incluindo:

- **Cabeçalho** com dados da loja
- **Título** com tipo de sessão e número
- **Corpo** com todos os Expedientes
- **Palavra de cada coluna**
- **Assinaturas** dos oficiais

---

## Próximos Passos

- Para detalhes sobre desenvolvimento, leia [Arquitetura](Arquitetura)
- Para padrões de código, leia [Padrões de Código](Padroes-de-Codigo)
- Para configurar o ambiente de testes, leia [Testes](Testes)

---

## Ver Também

- [Home](Home) — Visão geral do projeto
- [Instalação](Instalacao) — Guia completo de instalação
- [Arquitetura](Arquitetura) — Estrutura de código do projeto
- [Testes](Testes) — Como executar e escrever testes
