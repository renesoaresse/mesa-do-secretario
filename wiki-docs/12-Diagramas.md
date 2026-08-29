# Diagramas

Esta página reúne os diagramas de arquitetura do Mesa do Secretário. Cada um traz a legenda do que mostra e do que deliberadamente deixa de fora. Todos são escritos em Mermaid e renderizam direto na wiki do GitHub.

Apuração de 29 de agosto de 2026, na versão 0.8.0.

---

## Contexto

Quem usa o sistema e o que existe em volta dele.

```mermaid
graph TB
    SEC([Irmão Secretário])
    subgraph MDS[Mesa do Secretário]
        WEB[Versão web<br/>navegador]
        DESK[Versão desktop<br/>Windows e macOS]
    end
    NAV[(Armazenamento<br/>do navegador)]
    DISCO[(Disco da máquina)]
    IMP[Impressora ou<br/>leitor de PDF]
    VER[Vercel<br/>hospedagem estática]

    SEC -->|lavra a ata| WEB
    SEC -->|lavra a ata| DESK
    WEB --> NAV
    DESK --> DISCO
    WEB -->|impressão do navegador| IMP
    DESK -->|PDF com senha| IMP
    VER -.->|entrega os arquivos estáticos| WEB
```

_Não há servidor de aplicação, banco de dados remoto, autenticação nem chamada a API externa. A Vercel aparece apenas como hospedagem de arquivos estáticos: nada trafega do usuário para ela além do próprio carregamento da página._

---

## Arquitetura de Componentes

Os módulos internos e a direção real das dependências.

```mermaid
graph TD
    MAIN[main.tsx] --> APP[app/App.tsx]
    APP --> ROUTER[router/index.tsx<br/>router/routes.ts]
    ROUTER --> GUARD{Guarda de<br/>configuração}
    GUARD --> HOME[features/home]
    GUARD --> CFG[features/config<br/>features/loja-config]
    GUARD --> ATA[features/ata<br/>registry por rito]
    ATA --> EDITOR[app/AppEditor.tsx]
    EDITOR --> LAYOUT[components/layout]
    LAYOUT --> UI[components/ui]
    LAYOUT --> SLICES[features/session, officers,<br/>visitors, palavra, bolsa, preview]
    EDITOR --> STATE[hooks/useAtaState]
    SLICES --> STATE
    STATE --> STORAGE[services/storage]
    SLICES --> PDF[services/pdfExport]
    STORAGE --> TYPES[types/ata]
    STATE --> TYPES
```

_A seta sai de quem importa. `components/layout` importa de `features`, e não o contrário — o que hoje acontece por caminho interno, e não pelo barrel export, conforme [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica). Componentes individuais foram omitidos: o diagrama recorta no nível de módulo._

---

## Arquitetura de Integração

Como a aplicação conversa com o que está fora do seu processo, em cada alvo.

```mermaid
graph LR
    subgraph RENDER[Renderer React — os dois alvos]
        SVC[services/storage]
        PDFS[services/pdfExport]
    end

    subgraph WEBT[Alvo web]
        LS[(localStorage<br/>do navegador)]
        PRINT[window.print]
    end

    subgraph DESKT[Alvo desktop — Electron]
        PRE[preload.ts<br/>contextBridge]
        MAINP[main.ts<br/>processo principal]
        FILE[(Arquivo JSON<br/>em userData)]
        DLG[Diálogo Salvar como]
    end

    SVC -->|ausência de electronAPI| LS
    SVC -->|window.electronAPI.storage| PRE
    PDFS -->|impressão| PRINT
    PDFS -->|window.electronAPI.pdf| PRE
    PRE -->|IPC síncrono<br/>storage:load/save/remove/clear| MAINP
    PRE -->|IPC invoke<br/>pdf:render/save| MAINP
    MAINP --> FILE
    MAINP --> DLG
```

_A escolha do caminho é feita em tempo de execução, pela presença de `window.electronAPI`. A ponte expõe exatamente dois grupos de canais, declarados em `src/electron/preload.ts`; o processo principal só aceita as seis chaves da lista fechada em `src/electron/main.ts:19`. A senha do PDF não aparece no diagrama porque não trafega: a criptografia acontece no renderer, e só os bytes já criptografados descem pela ponte._

---

## Fluxo Principal

Exportação da ata em PDF com senha, no alvo desktop — a operação que atravessa mais camadas.

```mermaid
sequenceDiagram
    actor S as Irmão Secretário
    participant A as PdfExportAction
    participant M as PdfPasswordModal
    participant E as services/pdfExport
    participant P as preload (ponte)
    participant Main as Processo principal
    participant D as Disco

    S->>A: aciona Exportar PDF
    A->>M: abre o modal de senha
    S->>M: informa a senha
    M->>E: exportEncryptedPdf(senha, nome)
    E->>P: pdf.render()
    P->>Main: invoke pdf:render
    Main->>Main: printToPDF da janela
    Main-->>P: bytes do PDF sem senha
    P-->>E: bytes do PDF sem senha
    E->>E: encryptPdf — AES-128, cabeçalho 1.7
    E->>P: pdf.save(bytes criptografados)
    P->>Main: invoke pdf:save
    Main->>S: diálogo Salvar como
    Main->>D: grava o arquivo
    Main-->>E: saved ou canceled
    E-->>S: mensagem de status
```

_A senha existe apenas como argumento dentro do renderer: não é persistida, registrada nem enviada pela ponte. No alvo web esse fluxo não existe — resta a impressão pelo navegador._

---

## Modelo de Dados

O que é persistido e como as entidades se relacionam.

```mermaid
erDiagram
    LOJA_CONFIG ||--o{ OBREIRO : "quadro da loja"
    LOJA_CONFIG ||--o{ GESTAO : "gestões registradas"
    GESTAO ||--o{ ATRIBUICAO_CARGO : "um cargo por obreiro"
    OBREIRO ||--o{ ATRIBUICAO_CARGO : "ocupa"
    LOJA_CONFIG ||--|| RITO : "define o módulo de ata"
    ATA_DRAFT ||--|| SESSION_CONFIG : contém
    ATA_DRAFT ||--o{ VISITOR : registra
    ATA_DRAFT ||--|| OFFICERS : "oficiais da sessão"
    ATA_DRAFT ||--o{ BOLSA_PROPOSTA : registra
    ATA_DRAFT ||--|| PALAVRA_BEM_ORDEM : contém
    OFFICERS }o--|| OBREIRO : "escolhido no quadro"

    LOJA_CONFIG {
        string nomeLoja
        string rito
        string numeroLoja
        string temploNome
        string cidadeEstado
    }
    OBREIRO {
        string id
        string nome
        string cim
        string grau
    }
    GESTAO {
        string id
        string ano
        boolean vigente
    }
    ATA_DRAFT {
        string sessionType
        string grau
        string dataISO
    }
```

_Não há banco de dados nem esquema relacional: cada agregado é um documento JSON gravado sob uma das seis chaves de armazenamento (`ataDraft`, `officersConfig`, `lojaConfig`, `lojasCadastro`, `obreiros`, `gestoes`), definidas em `src/services/storage.ts:16`. As relações do diagrama são de referência por identificador dentro dos documentos, não de integridade garantida por banco. Os tipos completos estão em `src/types/ata.ts`._

---

## Distribuição e Execução

Do mesmo código-fonte a dois artefatos, com configuração divergente por alvo.

```mermaid
graph TD
    SRC[Código-fonte<br/>src/]

    SRC --> BW["yarn build:web<br/>vite build --mode web"]
    SRC --> BR["yarn build:renderer<br/>vite build --mode desktop"]
    SRC --> BE["yarn build:electron<br/>tsc do processo principal"]

    BW --> DW["dist/<br/>base absoluta /<br/>rotas por History API"]
    BR --> DD["dist/<br/>base relativa ./<br/>rotas por hash"]
    BE --> DE["dist-electron/<br/>main.cjs e preload.cjs"]

    DW --> VER[Vercel<br/>vercel.json: rewrites,<br/>cache e cabeçalhos]
    DD --> EB[electron-builder]
    DE --> EB
    EB --> WIN["release/<br/>instalador NSIS x64"]
    EB --> MAC["release/<br/>DMG arm64<br/>assinatura ad hoc"]

    VER --> U1([Navegador])
    WIN --> U2([Windows])
    MAC --> U3([macOS Apple Silicon])
```

_A divergência de `base` entre os alvos é obrigatória: o Electron carrega o HTML por `file://` e precisa de caminhos relativos; a web precisa de caminhos absolutos para que rotas profundas encontrem os assets. A `Content-Security-Policy` é reescrita por alvo pelo plugin `csp-por-alvo`, e o build falha se a meta sumir do HTML._

---

## Evolução

Os marcos que mudaram estrutura, fronteira ou alvo de execução.

```mermaid
graph LR
    V1["0.1.0<br/>fev 2025<br/>aplicação inicial"] --> V2["0.2.0<br/>mar 2026<br/>Feature-Sliced"]
    V2 --> V3["0.3.0<br/>mar 2026<br/>preview declarativo<br/>Electron endurecido"]
    V3 --> V4["0.4.0<br/>jul 2026<br/>roteamento wouter"]
    V4 --> V5["0.5.x<br/>ago 2026<br/>PDF com senha"]
    V5 --> V6["0.6.0<br/>ago 2026<br/>alvo web e CSP"]
    V6 --> V7["0.7.x<br/>ago 2026<br/>cadastro de loja<br/>obreiros e gestões"]
    V7 --> V8["0.8.0<br/>ago 2026<br/>ata por rito"]
```

_Detalhamento em [Evolução Arquitetural](Evolucao-Arquitetural)._

---

## Diagrama de Resolução de Rota

Diagrama adicional, específico da decisão de 0.8.0: como um endereço vira o documento de um rito.

```mermaid
stateDiagram-v2
    [*] --> Rota
    Rota --> Guarda: qualquer rota interna
    Guarda --> Home: dados da loja incompletos
    Guarda --> Ata: dados completos
    Ata --> Redirect: endereço /ata
    Redirect --> Modulo: rito cadastrado na loja
    Ata --> Confere: endereço /ata/&lt;slug&gt;
    Confere --> Modulo: slug confere com o rito
    Confere --> Modulo: slug não confere, reencaminha
    Modulo --> [*]: documento do rito em tela
    Home --> [*]: modal de boas-vindas aberto
```

_A única rota sempre acessível, mesmo com a loja incompleta, é `/config/loja`._

---

## Ver Também

- [Arquitetura](Arquitetura) — o texto que estes diagramas ilustram
- [Evolução Arquitetural](Evolucao-Arquitetural) — o caminho até aqui
- [Build e Distribuição](Build-e-Distribuicao) — o passo a passo dos artefatos
