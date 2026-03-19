# Instalação

Este guia descreve como instalar e configurar o ambiente de desenvolvimento do Mesa do Secretário. Todo o processo deve levar menos de 10 minutos.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

| Ferramenta  | Versão Mínima           | Verificação      |
| ----------- | ----------------------- | ---------------- |
| **Node.js** | 24.x                    | `node --version` |
| **Yarn**    | 1.22.x                  | `yarn --version` |
| **Git**     | qualquer versão recente | `git --version`  |

### Instalando o Node.js

Recomendamos usar o [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) para gerenciar versões do Node.js:

```bash
# Instalar nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Após instalar, reinicie o terminal e instale a versão correta
nvm install 24
nvm use 24
```

### Instalando o Yarn

Com o Node.js instalado, instale o Yarn:

```bash
npm install -g yarn
```

---

## Clonando o Repositório

```bash
git clone https://github.com/anomalyco/gerador-atas.git
cd gerador-atas
```

---

## Instalando as Dependências

Após clonar o repositório, instale todas as dependências do projeto:

```bash
yarn install
```

Este comando:

- Instala todas as dependências listadas em `package.json`
- Configura os _hooks_ do Git (Husky) automaticamente via script `prepare`

Confirme que os _hooks_ foram criados:

```bash
ls -la .husky/
# Deve exibir: pre-commit e commit-msg
```

Se os _hooks_ não aparecerem, execute manualmente:

```bash
yarn prepare
```

---

## Scripts Disponíveis

O `package.json` define os seguintes scripts:

### Desenvolvimento

| Comando             | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `yarn dev`          | Inicia o servidor de desenvolvimento na porta 5173 |
| `yarn electron:dev` | Inicia a aplicação em modo Electron (desktop)      |

### Build

| Comando               | Descrição                                                             |
| --------------------- | --------------------------------------------------------------------- |
| `yarn build`          | Executa _build_ completo: web (Vite) + Electron (TypeScript)          |
| `yarn build:web`      | Executa apenas o _build_ web (Vite em `dist/`)                        |
| `yarn build:electron` | Executa apenas o _build_ do Electron (TypeScript em `dist-electron/`) |

### Distribuição

| Comando         | Descrição                                         |
| --------------- | ------------------------------------------------- |
| `yarn dist:win` | Gera instalador Windows (.exe NSIS) em `release/` |
| `yarn dist:mac` | Gera instalador macOS (.dmg) em `release/`        |
| `yarn dist`     | Gera instaladores para ambas as plataformas       |

### Qualidade de Código

| Comando             | Descrição                                         |
| ------------------- | ------------------------------------------------- |
| `yarn lint`         | Executa o ESLint e reporta erros                  |
| `yarn lint --fix`   | Executa o ESLint e corrige erros auto-corrigíveis |
| `yarn format`       | Executa o Prettier e formata todos os arquivos    |
| `yarn format:check` | Verifica formatação sem alterar arquivos          |

### Testes

| Comando              | Descrição                                               |
| -------------------- | ------------------------------------------------------- |
| `yarn test`          | Executa todos os testes unitários (Vitest)              |
| `yarn test:watch`    | Executa testes em modo _watch_ (re-execução automática) |
| `yarn test:coverage` | Executa testes com relatório de cobertura               |
| `yarn test:e2e`      | Executa testes E2E (Playwright com Chromium)            |

---

## Executando a Aplicação

### Modo Web (Recomendado para Desenvolvimento)

```bash
yarn dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### Modo Desktop (Electron)

```bash
yarn electron:dev
```

Abre a aplicação como janela _desktop_, com o servidor Vite ainda rodando em segundo plano.

### Build de Produção

```bash
yarn build
```

Gera os arquivos otimizados em `dist/` (web) e `dist-electron/` (Electron).

### Gerando Instaladores

```bash
# Windows
yarn dist:win

# macOS
yarn dist:mac
```

Os instaladores são salvos em `release/`.

---

## Verificando a Instalação

Para confirmar que tudo está funcionando:

```bash
# Executar os testes (deve passar em verde)
yarn test

# Executar o linter (deve retornar sem erros)
yarn lint

# Executar os testes E2E
yarn test:e2e
```

---

## Troubleshooting

### Erro: "Module not found"

Se ao executar `yarn dev` você receber erros de módulo não encontrado:

```bash
# Limpe o cache e reinstale
rm -rf node_modules
yarn install
```

### Erro: "Husky not installed"

Se os _hooks_ do Husky não funcionarem:

```bash
yarn prepare
```

### Porta 5173 já em uso

Se a porta 5173 estiver ocupada:

```bash
# Encerre o processo que está usando a porta
lsof -ti:5173 | xargs kill -9

# Ou use uma porta diferente
yarn dev --port 5174
```

### Build do Electron falha

Se `yarn build:electron` falhar:

```bash
# Compile manualmente o TypeScript do Electron
yarn electron:tsc
```

---

## Próximos Passos

- Leia o [Quickstart](Quickstart) para um resumo do fluxo de uso da aplicação
- Consulte [Arquitetura](Arquitetura) para entender a estrutura de código do projeto
- Veja [Testes](Testes) para saber como executar e escrever testes

---

## Ver Também

- [Quickstart](Quickstart) — Resumo do fluxo de uso
- [Testes](Testes) — Como executar e escrever testes
- [Build e Distribuição](Build-e-Distribuicao) — Como gerar instaladores
