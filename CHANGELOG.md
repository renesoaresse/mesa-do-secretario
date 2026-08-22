# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [UNRELEASED]

## [0.7.0] - 2026-08-21

### Adicionado

- tela **Configuração da Loja** (`/config/loja`), acessível pelo primeiro item do menu de
  Configurações, organizada em três abas: **Geral**, **Gestão** e **Obreiros**
  (`LojaConfigScreen`, `useLojaConfig`)
- componente de abas acessível `Tabs`, com `role="tablist"`, navegação pelas setas do teclado
  e modo controlado
- campo **Rito** na configuração da loja, com as quatro opções previstas
  (Escocês Antigo e Aceito, Adonhiramita, York e Emulação) e o texto “Escolha o Rito” enquanto
  nada estiver selecionado
- cadastro de **obreiros** (nome sempre em caixa alta, CIM e grau), em modal com Salvar e
  Cancelar, com listagem em ordem alfabética no formato `Nome - CIM`, grau e botão de edição
  (`ObreiroFormModal`, `ObreirosList`, `useObreiros`)
- cadastro de **gestão**, em modal com ano de quatro dígitos, seleção de gestão vigente e um
  cargo por obreiro, impedindo cargo repetido na mesma gestão
  (`GestaoFormModal`, `GestoesList`, `useGestoes`)
- tabela dos 23 cargos do Rito Escocês Antigo e Aceito, com sigla usada na ata e nome completo
  do cargo (`data/cargos.ts`)
- modal de boas-vindas ao Irmão Secretário, exibido enquanto faltar algum dado obrigatório da
  loja, com o único caminho sendo a tela de configuração (`BoasVindasModal`)
- bloqueio de navegação por URL: sem os dados da loja, qualquer rota volta para a tela
  principal com o modal aberto
- botão **Voltar** no rodapé da tela de ata, exclusivo da versão _desktop_ (Windows e macOS),
  posicionado antes de Imprimir
- chaves de armazenamento `obreiros` e `gestoes`, liberadas também na ponte do Electron
- seção **Bolsa de Propostas e Informações** com registro estruturado no lugar do texto livre:
  campo **Total de colunas gravadas**, busca do obreiro no quadro da loja e seleção do **Tipo**
  entre _Certificado de Visitas_, _Trabalhos_ e _Aumento de Salário_, com o tipo em branco até a
  escolha do Ir∴ Sec∴ (`BolsaPropostasPanel`, `BolsaPropostaInputRow`, `BolsaPropostasList`)
- busca de obreiros do quadro por nome, com o cargo da gestão vigente ao lado (`ObreiroCombobox`)
- certificado de visita com **loja** e **data**, ambas obrigatórias; a loja reaproveita o mesmo
  seletor dos visitantes, incluindo o cadastro de loja nova pela opção _Outros_
- **título do trabalho** nos registros do tipo _Trabalhos_
- **acréscimo ao texto padrão** da bolsa, lavrado em parágrafo próprio depois das colunas
  gravadas, sem recuo de primeira linha, alinhado com as demais seções do balaústre
- supressão da bolsa por ordem do V∴ M∴, que esconde os campos e registra apenas
  “Por ordem do V∴ M∴, a Bolsa de proposta e informações foi suprimida!”, com o tratamento
  ajustado ao grau da sessão
- redação automática da bolsa no balaústre (`gerarTextoBolsaPropostas`), sempre na ordem
  certificados de visita, aumentos de salário e trabalhos, com concordância de número
  (“1 coluna gravada” / “13 colunas gravadas”, “certificado … à loja” / “certificados … às lojas”,
  “pedido … do Ir∴” / “pedidos … dos IIr∴”), cifra em toda referência a irmão e agrupamento numa
  única coluna dos certificados do mesmo Ir∴ lançados em registros separados
- registro ritualístico quando o giro nada produziu: “A bolsa de propostas e informações após seu
  giro nada produziu, além dos bons fluidos colocados pelos IIr∴.”
- ordenação cronológica dos certificados de visita, da data mais antiga para a mais nova, tanto
  entre as lojas de um mesmo Ir∴ quanto entre as colunas, posicionadas pela visita mais antiga de
  cada Ir∴; visita de registro antigo sem data vai para o fim da fila
- utilitários compartilhados `normalizarBusca` (`src/utils/texto.ts`) e `formatarDataNumericaBR`
  (`src/utils/data.ts`)
- tratamento ritualístico por grau no texto da ata (`tratamentosDoGrau`): em Loj∴ de MM∴ MM∴ o
  V∴ M∴ passa a ser tratado por Resp∴ M∴, os VVig∴ por VVen∴ IIr∴ VVig∴, os demais IIr∴ por
  VVen∴ IIr∴ e os cargos por Ven∴ Ir∴ Or∴, Ven∴ Ir∴ Sec∴ e Ven∴ Ir∴ Hosp∴, valendo para presença,
  oficiais, visitantes, saudação, bolsa de propostas, bolsa de beneficência, supressões,
  encerramento e o bloco de assinaturas (Respeitável Mestre, Venerável Irmão Orador e
  Venerável Irmão Secretário)

### Alterado

- campos de **Oficiais da Loja** deixaram de ser entradas de texto simples e passaram a ser
  seletores alimentados pelo quadro de obreiros, com o titular do cargo no topo da lista e o
  cargo de cada irmão ao lado do nome; a opção “Outro (digitar nome)” mantém a digitação livre,
  sempre em caixa alta (`OfficerSelect`)
- oficiais da ata passam a ser pré-preenchidos com os titulares da gestão vigente, cargo a cargo
- referências da ata a quem não é o titular do cargo recebem o sufixo ` - ADHOC`
- estilos de campo (`.control`, `.control-select`, `.control-textarea`) passaram a valer também
  nas telas de configuração e dentro dos modais, e não só na barra lateral
- seta do `select` passou a ser desenhada por SVG embutido; o `appearance: none` a removia sem
  repor nenhum indicador
- `Modal` ganhou a opção `dismissible`, que suprime o ✕, o clique fora e o Esc
- `bolsaPropostasTexto`, até então um texto livre, deu lugar ao `bolsaPropostas` estruturado em
  `AtaDraft` e `PreviewData` (total de colunas, registros, acréscimo e supressão), persistido no
  rascunho canônico `ataDraft` tanto no `localStorage` quanto pela ponte do Electron
- rascunhos gravados por versões anteriores são migrados na leitura: o texto livre antigo passa a
  alimentar o acréscimo da bolsa, sem perda de conteúdo (`sanitizeAtaDraft`)
- `LojaCombobox` passou a usar o `normalizarBusca` compartilhado, em vez da normalização local
- `TRONCO_SUPRIMIDO_TEXTO` e `PBO_SUPRIMIDO_TEXTO` deixaram de ser constantes e viraram as funções
  `troncoSuprimidoTexto` e `pboSuprimidoTexto`, já que a redação passou a depender do grau da
  sessão; sem argumento, ambas devolvem o texto de sempre

### Removido

- bloco **Configuração da Loja** da barra lateral da tela de ata, agora com tela própria

### Corrigido

- oficiais em branco não eram preenchidos com os titulares da gestão quando algum outro cargo
  já tinha sido digitado; o preenchimento passou a ser avaliado cargo a cargo

## [0.6.0] - 2026-08-20

### Adicionado

- `vercel.json` na raiz do projeto, versionando toda a configuração de publicação na Vercel:
  _preset_ Vite, comandos de instalação e de _build_, diretório de saída, reescrita de rotas
  para a SPA, cache imutável dos _assets_ com _hash_ e cabeçalhos de segurança
  (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
  e `X-Frame-Options`)
- script `build:renderer`, que gera o _renderer_ do Electron com base relativa (`./`), separando-o
  do _build_ web
- `cspPlugin` em `vite.config.ts`, que reescreve a meta `Content-Security-Policy` do `index.html`
  conforme o alvo e interrompe o _build_ caso a meta desapareça do HTML
- seção **Publicação na Web (Vercel)** em `wiki-docs/08-Build-e-Distribuicao.md`, com configuração,
  roteamento, cabeçalhos, versão do Node.js e as diferenças entre a versão web e a _desktop_
- seção **Publicação web** no `README.md`
- favicon do brasão da Grande Loja Maçônica do Estado de Sergipe, derivado de `build/icon.png`
  (mesma arte do ícone do aplicativo _desktop_): `public/favicon.ico` com 16, 32 e 48 pixels,
  `public/favicon-96x96.png`, `public/favicon-192x192.png` e `public/apple-touch-icon.png`
- `.vercel` no `.gitignore`

### Corrigido

- navegação da versão web, que ficava inutilizável fora da rota raiz. O `base` relativo, exigido
  pelo Electron por carregar o HTML via `file://`, fazia com que `/config/lojas` procurasse os
  _assets_ em `/config/lojas/assets/…`, resultando em 404 e tela branca. O _build_ web passou a
  usar base absoluta (`/`)
- abertura direta e recarregamento (F5) de rotas internas (`/ata`, `/config`, `/config/lojas`),
  que retornavam 404 por não existirem como arquivo no servidor. A reescrita declarada em
  `vercel.json` passa a entregar o `index.html` e deixar a resolução da rota com o `wouter`

### Alterado

- `build:web` passou a rodar `vite build --mode web`, destinado exclusivamente à hospedagem
- `build` (_build_ completo do _desktop_) passou a usar `build:renderer` no lugar de `build:web`;
  `dist`, `dist:win` e `dist:mac` seguem inalterados
- `Content-Security-Policy` deixou de expor `http://localhost:5173` e `ws://localhost:5173` nos
  artefatos de produção, tanto na web quanto no _desktop_; a liberação passou a existir apenas
  no servidor de desenvolvimento, onde o HMR depende dela
- tabelas de _scripts_ de `wiki-docs/02-Instalacao.md` e `wiki-docs/08-Build-e-Distribuicao.md`
  atualizadas com a separação entre os alvos web e _desktop_
- `index.html` passou a declarar os ícones em `.ico` e `.png`, no lugar do único `link` para
  `vite.svg`

### Removido

- `public/vite.svg`, o favicon padrão do _template_ do Vite, substituído pelo brasão

## [0.5.1] - 2026-08-09

### Corrigido

- assinatura de código do macOS refeita durante o empacotamento, corrigindo o erro
  `"Mesa do Secretario.app" está danificado e não pode ser aberto` em Macs com Apple Silicon.
  O `.app` era gerado apenas com a assinatura ad hoc residual do linker do Electron, que
  declara recursos não selados; o Gatekeeper classificava a assinatura como inválida e
  bloqueava a abertura sem oferecer caminho de liberação pela interface
- `Identifier` do bundle passou de `Electron` para `com.glmese.mesadosecretario`, e o
  `Info.plist` passou a ser selado pela assinatura
- trecho corrompido em `wiki-docs/08-Build-e-Distribuicao.md`, que continha caracteres
  chineses no meio da frase (`para跳过 assinatura`)
- blocos de comando do `README.md` que não estavam em code fences e seriam renderizados
  como parágrafo corrido
- lista de autores do `README.md`, cujas quebras de linha simples colapsavam no render
- badge do React no `README.md`, de 18 para 19

### Adicionado

- `scripts/mac-adhoc-sign.cjs`: _hook_ `afterPack` do electron-builder que aplica assinatura
  ad hoc ao bundle empacotado e verifica o resultado antes da geração do DMG
- seção **Primeira Abertura no macOS** em `wiki-docs/08-Build-e-Distribuicao.md`, destinada
  ao usuário final, com passo a passo de liberação para macOS 13 ou superior e para macOS 12
  ou anterior, alternativa por Terminal e tabela de solução de problemas
- documentação do caminho de autorização pela Apple (Developer ID) como evolução futura

### Alterado

- `target` do macOS passou a fixar `arm64` de forma explícita; antes, sem `arch` declarado,
  o artefato herdava a arquitetura da máquina que executava o _build_
- seção **Assinatura de Código** da wiki reescrita, documentando a diferença entre assinatura
  ausente e assinatura inválida no tratamento do Gatekeeper
- revisão de gramática e vocabulário do `README.md`, com tradução dos títulos que tinham
  equivalente consagrado em português e padronização dos estrangeirismos em itálico

### Removido

- suporte a Macs com processador Intel. O DMG passou a ser exclusivo de Apple Silicon

## [0.5.0] - 2026-08-09

### Adicionado

- exportação de PDF com proteção por senha, incluindo `PdfExportAction`, `PdfPasswordModal`
  e o serviço `src/services/pdfExport.ts`
- numeração de linhas no preview do documento, via `src/features/preview/hooks/useLineNumbers.ts`
- componentes de interface `Checkbox` e `PasswordInput`
- campo de tronco de beneficência com componente dedicado (`TroncoInput`)
- canal de IPC para exportação de PDF no processo principal do Electron, com testes de
  `main` e `preload`

### Alterado

- `DocumentPreview` reestruturado para acomodar a numeração de linhas e a exportação
- estilos de impressão (`print.css`) ajustados para o novo layout do documento
- painel da Palavra do Bem da Ordem revisado
- lista de lojas padrão (`defaultLojas.ts`) ampliada

## [0.4.0] - 2026-07-03

### Adicionado

- navegação entre telas com o roteador `wouter`, com a edição da ata movida para `AppEditor`
- tela inicial (_home_) com cartões de acesso rápido, composta por `HomeScreen`,
  `LauncherCard` e `WelcomeSection`
- hook `useHasSavedAta` para detectar rascunho de ata salvo
- cadastro de lojas, com listagem, formulário e seleção por combobox
  (`LojasListScreen`, `LojaFormScreen`, `LojaCombobox`, `useLojas`)
- tela de configurações (`ConfigScreen`) e componente `Modal`
- suporte a sessão conjunta, via `SessionConjuntaForm`
- wiki do projeto em `wiki-docs/`, com 8 páginas (Home, Instalação, Quickstart, Arquitetura,
  Padrões de Código, Testes, Build e Distribuição, Changelog)

### Alterado

- painel e entrada de visitantes reformulados
- persistência ampliada em `src/services/storage.ts` para acomodar lojas e sessão conjunta
- layout adaptado às novas telas, com ampliação de `components.css` e criação de `home.css`

## [0.3.0] - 2026-03-18

### Adicionado

- 34 novos arquivos de teste unitário cobrindo componentes reutilizáveis, formulários,
  listas, painéis, layout e composição principal da aplicação
- helpers reutilizáveis de teste em `src/test/render.tsx` e `src/test/factories.ts`
- suíte de testes para o preview seguro cobrindo texto malicioso, entidades escapadas,
  blocos condicionais, estabilidade durante edição e helpers textuais reutilizáveis
- suíte de testes para o shell Electron cobrindo preload seguro, regras de navegação,
  bloqueio de novas janelas e persistência mediada por IPC
- helper de testes para seed e leitura do storage em `src/test/storage.ts`
- cenários E2E cobrindo restauração dos campos persistidos e limpeza de dados legados

### Alterado

- escopo do coverage alinhado ao valor real da feature, excluindo barrels, arquivos de tipos,
  `src/app/providers.tsx`, `src/features/preview/components/DocumentPreview.tsx` e
  `src/features/loja-config/components/LojaConfigForm.tsx`
- cobertura total da suíte unitária elevada para 93.90%
- preview do documento migrado de HTML injetado para renderização declarativa em React,
  preservando `#documentPreview`, classes, `aria-label` e comportamento de zoom
- lógica textual do preview centralizada em `src/features/preview/components/documentPreviewText.ts`
  para reduzir regressões e manter tratamento consistente de todos os campos textuais
- `MainPreview` passou a ser validado com o `DocumentPreview` real em teste de integração
- `DocumentPreview.tsx` voltou ao escopo de coverage do Vitest
- `src/electron/main.ts` passou a explicitar `sandbox`, preload dedicado e bloqueios
  padrão para navegação externa e `window.open`
- `src/services/storage.ts` agora usa a ponte segura do Electron quando disponível,
  mantendo fallback para `localStorage` no ambiente web
- `src/app/App.tsx` e `src/components/layout/MainPreview.tsx` passaram a sinalizar e
  respeitar o runtime endurecido sem quebrar o fluxo atual
- persistência da ata migrada para um draft canônico com restauração dos campos principais
  restantes em `src/hooks/useAtaState.ts` e `src/services/storage.ts`
- compatibilidade mantida com `officersConfig` e `lojaConfig` durante a migração do estado
- `src/app/App.tsx` e `src/components/layout/SidebarContent.tsx` foram simplificados após a
  remoção completa do fluxo de documentos

### Segurança

- removido o uso de `dangerouslySetInnerHTML` no preview de atas
- todos os campos textuais do preview agora são exibidos como texto literal, sem interpretar
  HTML vindo da entrada do usuário ou de futuras importações
- adicionada API mínima no preload com superfície tipada e sem canal genérico
- operações privilegiadas de persistência passaram a ser centralizadas no processo principal
- adicionada política de conteúdo restritiva em `index.html`, compatível com o fluxo atual

### Removido

- módulo de documentos, incluindo tipos, componentes, lógica de estado e testes em
  `src/features/documents/`

## [0.2.0] - 2026-03-18

### Adicionado

- Arquitetura Feature-Sliced com 7 feature slices verticais autocontidas
  (`session`, `documents`, `officers`, `visitors`, `preview`, `loja-config`, `palavra`)
- Barrel exports (`index.ts`) para cada feature, controlando a API pública
- Serviço de storage (`src/services/storage.ts`) encapsulando `localStorage`
- Hook global `useAtaState` (`src/hooks/useAtaState.ts`) centralizando o estado da aplicação
- Placeholder de providers (`src/app/providers.tsx`) para expansão futura
- Pipeline de qualidade de código:
  - Prettier (aspas simples, semicolons, 100 colunas)
  - ESLint estendido com `eslint-config-prettier` e `eslint-plugin-jsx-a11y`
  - Husky com hooks `pre-commit` (lint-staged) e `commit-msg` (commitlint)
  - Commitlint com regras Conventional Commits
- Testes unitários com Vitest + React Testing Library + jsdom:
  - 8 testes para o serviço de storage
  - 8 testes para o hook useAtaState
  - 5 testes para o componente Button
- Cobertura de testes com `@vitest/coverage-v8`
- Testes E2E com Playwright + Chromium + Page Object Model:
  - 3 smoke tests (sidebar, preview, titulo)
  - WebServer integrado (sobe Vite automaticamente)
- `.gitignore` expandido para coverage, playwright-report, test-results, ferramentas de IA

### Alterado

- `App.tsx` simplificado — usa `useAtaState` em vez de 18 `useState` locais
- CSS fatiado de 1 arquivo (797 linhas) para 5 arquivos temáticos:
  `tokens.css`, `reset.css`, `layout.css`, `components.css`, `print.css`
- 37 componentes migrados de `src/components/` para `src/features/<domínio>/components/`
- Componentes de layout consolidados em `src/components/layout/`
- Typo corrigido: `OpenTextSction.tsx` renomeado para `OpenTextSection.tsx`
- Erros de lint pré-existentes corrigidos (imports não utilizados, acessibilidade)

## [0.1.0] - 2025-02-08

### Adicionado

- Versão inicial da aplicação Mesa do Secretário
- Geração de atas para sessões maçônicas (econômica, magna, conjunta)
- Preview em tempo real com HTML simulando folha A4 padrão ABNT
- Configuração da loja e oficiais com persistência em localStorage
- Empacotamento Electron para Windows (NSIS) e macOS (DMG)
