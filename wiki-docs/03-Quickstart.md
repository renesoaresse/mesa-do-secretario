# Quickstart

Este guia apresenta um resumo rápido do fluxo completo de uso do Mesa do Secretário, desde a configuração inicial até a exportação da ata finalizada.

Para instruções detalhadas de instalação, consulte a página [Instalação](Instalacao).

---

## Fluxo de Uso

O caminho até a ata pronta tem cinco etapas. A primeira só acontece uma vez.

### 1. Cadastrar a loja

Na primeira abertura, a aplicação mantém o modal de boas-vindas até que os dados obrigatórios da loja estejam preenchidos. Nenhuma outra tela fica acessível antes disso. O cadastro está em **Configurações → Configuração da Loja**, dividido em três abas:

**Geral**

- Nome e número da loja
- **Rito** — Escocês Antigo e Aceito, Adonhiramita, York ou Emulação
- Data de fundação
- Nome do templo, endereço e Oriente

**Obreiros**

Cadastre cada irmão do quadro com nome, CIM e grau. O nome é sempre gravado em caixa alta, e a lista aparece em ordem alfabética.

**Gestão**

Registre o ano da gestão, marque a gestão vigente e atribua um cargo a cada obreiro. Os cargos oferecidos são os do rito escolhido na aba Geral. O mesmo cargo não pode ser dado a dois obreiros na mesma gestão.

> O rito escolhido aqui determina qual documento de ata a aplicação abre. Trocar o rito troca o texto da ata, as seções e os oficiais pedidos.

### 2. Escolher o tipo de sessão

| Tipo          | Quando usar                         |
| ------------- | ----------------------------------- |
| **Econômica** | Sessão de trabalho rotineira        |
| **Magna**     | Sessão solene com tema especial     |
| **Conjunta**  | Sessão compartilhada com outra loja |

Conforme o tipo, campos adicionais aparecem — tema, orador convidado, autoridades e ato especial na Magna; identificação da outra casa na Conjunta.

### 3. Preencher a ata

Os campos ficam na barra lateral, e variam conforme o rito:

- **Configuração da sessão** — grau, número, data, horas de início e de encerramento
- **Oficiais** — escolhidos entre os obreiros da gestão vigente, já com o cargo anotado; o rito decide quais oficiais a ata pede
- **Visitantes** — acrescentados um a um
- **Palavra a Bem da Ordem** — dividida entre as colunas Sul, Norte e Oriente, ou em texto corrido, conforme o rito
- **Bolsa de Propostas e Informações** — total de colunas e, quando houver, o registro por natureza e por obreiro
- **Tronco de Beneficência**, **balaústre**, **atos**, **decretos** e as demais seções do rito

Tudo é salvo automaticamente enquanto se digita, com aviso do último salvamento no rodapé.

### 4. Revisar a pré-visualização

A folha A4 ao lado mostra a ata como será impressa, com numeração de linhas.

### 5. Imprimir ou exportar

- **Imprimir** — disponível nas duas versões, pela janela de impressão do sistema
- **Exportar PDF com senha** — exclusivo da versão desktop; a senha é pedida em modal e protege o arquivo em AES-128

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

| Caminho                     | O que contém                                          |
| --------------------------- | ----------------------------------------------------- |
| `src/features/ata/`         | Módulo de ata por rito: registry, rotas e documentos  |
| `src/features/session/`     | Tipo de sessão, campos de magna e conjunta, tronco    |
| `src/features/officers/`    | Oficiais da sessão                                    |
| `src/features/visitors/`    | Visitantes presentes                                  |
| `src/features/palavra/`     | Palavra a Bem da Ordem                                |
| `src/features/bolsa/`       | Bolsa de Propostas e Informações                      |
| `src/features/preview/`     | Pré-visualização A4 e exportação em PDF               |
| `src/features/loja-config/` | Cadastro de lojas, obreiros, gestões e cargos         |
| `src/features/config/`      | Tela de configurações                                 |
| `src/features/home/`        | Tela inicial com cartões de acesso                    |
| `src/router/`               | Tabela de rotas e guarda de configuração              |
| `src/components/ui/`        | Componentes reutilizáveis (Button, Input, Tabs)       |
| `src/components/layout/`    | Layout da aplicação (Sidebar, MainPreview)            |
| `src/hooks/`                | Estado global da aplicação (`useAtaState`)            |
| `src/services/`             | Persistência (`storage.ts`) e PDF (`pdfExport.ts`)    |
| `src/types/`                | Tipos TypeScript (`ata.ts`)                           |
| `src/styles/`               | CSS fatiado (tokens, layout, components, home, print) |
| `src/electron/`             | Processo principal, preload e canais IPC              |
| `tests/e2e/`                | Testes de ponta a ponta (Playwright)                  |

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
- Para os diagramas do sistema, veja [Diagramas](Diagramas)
- Para padrões de código, leia [Padrões de Código](Padroes-de-Codigo)
- Para configurar o ambiente de testes, leia [Testes](Testes)

---

## Ver Também

- [Home](Home) — Visão geral do projeto
- [Instalação](Instalacao) — Guia completo de instalação
- [Arquitetura](Arquitetura) — Estrutura de código do projeto
- [Diagramas](Diagramas) — Contexto, componentes, integração e distribuição
- [Testes](Testes) — Como executar e escrever testes
