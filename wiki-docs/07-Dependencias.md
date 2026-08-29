# Dependências

Este documento inventaria as bibliotecas do Mesa do Secretário, a finalidade de cada uma e o estado de atualização apurado em 29 de agosto de 2026, na versão 0.8.0.

Para o plano de correção e as vulnerabilidades, consulte [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica).

---

## Princípio

O projeto mantém a superfície de produção deliberadamente pequena: **quatro dependências** chegam ao usuário. Todo o resto é ferramenta de desenvolvimento, teste e empacotamento. Nenhuma biblioteca de gerenciamento de estado, de componentes ou de CSS é permitida — ver [Padrões de Código](Padroes-de-Codigo).

O gerenciador de pacotes é o **Yarn**, e o arquivo de resolução versionado é o `yarn.lock`.

---

## Produção

| Pacote            | Declarada | Resolvida | Disponível | Finalidade                                         | Onde                        |
| ----------------- | --------- | --------- | ---------- | -------------------------------------------------- | --------------------------- |
| `react`           | `^19.2.0` | 19.2.4    | 19.2.8     | Biblioteca de interface                            | Toda a aplicação            |
| `react-dom`       | `^19.2.0` | 19.2.4    | 19.2.8     | Montagem no DOM                                    | `src/main.tsx`              |
| `wouter`          | `^3.9.0`  | 3.9.0     | 3.10.0     | Roteador leve, com _hash location_ no alvo desktop | `src/router/index.tsx`      |
| `@cantoo/pdf-lib` | `^2.8.1`  | 2.8.1     | 2.9.1      | Geração e criptografia do PDF da ata               | `src/services/pdfExport.ts` |

A escolha do `@cantoo/pdf-lib` sobre o `pdf-lib` original sustenta a exportação **com senha**: a criptografia acontece no _renderer_, e a senha nunca cruza a ponte do Electron.

---

## Desenvolvimento

### Build e empacotamento

| Pacote                 | Declarada | Resolvida | Disponível | Finalidade                                     |
| ---------------------- | --------- | --------- | ---------- | ---------------------------------------------- |
| `vite`                 | `^7.2.4`  | 7.3.1     | 8.2.2      | Servidor de desenvolvimento e empacotador      |
| `@vitejs/plugin-react` | `^5.1.1`  | 5.2.0     | 6.1.1      | Suporte a React e HMR                          |
| `typescript`           | `~5.9.3`  | 5.9.3     | 7.0.2      | Compilador e verificação de tipos              |
| `electron`             | `^40.6.0` | 40.8.3    | 41.7.1     | Runtime desktop                                |
| `electron-builder`     | `^26.8.1` | 26.8.1    | 26.15.3    | Empacotamento NSIS (Windows) e DMG (macOS)     |
| `@electron-forge/cli`  | `^7.11.1` | 7.11.1    | 7.11.2     | **Sem uso** — ver observação abaixo            |
| `concurrently`         | `^9.2.1`  | 9.2.1     | 9.2.4      | Sobe Vite e Electron juntos em desenvolvimento |
| `wait-on`              | `^9.0.4`  | 9.0.4     | 9.1.0      | Espera o Vite subir antes do Electron          |
| `rimraf`               | `^6.1.3`  | —         | —          | Limpeza de `dist`, `dist-electron` e `release` |

### Qualidade e formatação

| Pacote                            | Declarada | Resolvida | Disponível | Finalidade                                   |
| --------------------------------- | --------- | --------- | ---------- | -------------------------------------------- |
| `eslint`                          | `^9.39.1` | 9.39.4    | 10.9.1     | Análise estática                             |
| `@eslint/js`                      | `^9.39.1` | 9.39.4    | 10.0.1     | Regras base do ESLint                        |
| `typescript-eslint`               | `^8.46.4` | 8.57.1    | 8.68.0     | Regras de TypeScript                         |
| `eslint-plugin-react-hooks`       | `^7.0.1`  | 7.0.1     | 7.1.1      | Regras de _hooks_                            |
| `eslint-plugin-react-refresh`     | `^0.4.24` | 0.4.26    | 0.5.5      | Compatibilidade com Fast Refresh             |
| `eslint-plugin-jsx-a11y`          | `^6.10.2` | —         | —          | Acessibilidade em JSX                        |
| `eslint-config-prettier`          | `^10.1.8` | —         | —          | Desliga regras que conflitam com o Prettier  |
| `prettier`                        | `^3.8.1`  | 3.8.1     | 3.9.6      | Formatação                                   |
| `globals`                         | `^16.5.0` | 16.5.0    | 17.11.0    | Catálogo de globais por ambiente             |
| `husky`                           | `^9.1.7`  | —         | —          | Hooks de commit                              |
| `lint-staged`                     | `^16.4.0` | —         | —          | Lint e formatação apenas no que foi alterado |
| `@commitlint/cli`                 | `^20.5.0` | 20.5.0    | 20.5.3     | Validação de mensagem de commit              |
| `@commitlint/config-conventional` | `^20.5.0` | 20.5.0    | 20.5.3     | Convenção Conventional Commits               |

### Teste

| Pacote                        | Declarada | Resolvida | Disponível | Finalidade                             |
| ----------------------------- | --------- | --------- | ---------- | -------------------------------------- |
| `vitest`                      | `^3.2.4`  | 3.2.4     | 4.1.11     | Execução dos testes unitários          |
| `@vitest/coverage-v8`         | `^3.2.4`  | 3.2.4     | 4.1.11     | Cobertura por V8                       |
| `jsdom`                       | `^29.0.0` | 29.0.0    | 29.1.1     | Ambiente de DOM para os testes         |
| `@testing-library/react`      | `^16.3.2` | 16.3.2    | 16.3.3     | Render e consultas em componentes      |
| `@testing-library/dom`        | `^10.4.1` | —         | —          | Base de consultas                      |
| `@testing-library/jest-dom`   | `^6.9.1`  | —         | —          | Asserções de DOM                       |
| `@testing-library/user-event` | `^14.6.1` | 14.6.1    | 14.6.6     | Simulação de interação real do usuário |
| `@playwright/test`            | `^1.58.2` | 1.58.2    | 1.62.1     | Testes de ponta a ponta                |

### Tipos

`@types/node` (24.12.0, disponível 26.4.0), `@types/react` (19.2.14, disponível 19.2.18) e `@types/react-dom` (19.2.3, disponível 19.2.5).

---

## Dependência Declarada e Não Usada

`@electron-forge/cli` está em `package.json:51` e **não é referenciada em lugar nenhum**: nem no código de `src/`, nem em `vite.config.ts`, nem nos scripts do `package.json`, nem no `README.md`. O empacotamento do projeto é feito por `electron-builder`, configurado no bloco `build` do `package.json`.

A remoção é a ação de maior retorno do projeto hoje, porque essa dependência responde sozinha por **334 das 596 vulnerabilidades** apontadas pelo `yarn audit`. Ver [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica).

---

## Estado de Atualização

Apuração de 29 de agosto de 2026, sobre a árvore instalada:

- **30 pacotes** têm versão mais nova disponível.
- **20** são atualizações menores ou de correção, cobertas pelo intervalo `^` já declarado: bastam `yarn upgrade` e a suíte verde.
- **10** são atualizações maiores, com quebra possível:

| Pacote                 | Instalada | Maior disponível |
| ---------------------- | --------- | ---------------- |
| `typescript`           | 5.9.3     | 7.0.2            |
| `vite`                 | 7.3.1     | 8.2.2            |
| `vitest`               | 3.2.4     | 4.1.11           |
| `@vitest/coverage-v8`  | 3.2.4     | 4.1.11           |
| `eslint`               | 9.39.4    | 10.9.1           |
| `@eslint/js`           | 9.39.4    | 10.0.1           |
| `electron`             | 40.8.3    | 41.7.1           |
| `@vitejs/plugin-react` | 5.2.0     | 6.1.1            |
| `globals`              | 16.5.0    | 17.11.0          |
| `@types/node`          | 24.12.0   | 26.4.0           |

Nenhuma dessas atualizações alcança a superfície de produção: as quatro dependências de produção só têm atualizações menores pendentes.

---

## Ver Também

- [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica) — vulnerabilidades e plano de atualização
- [Build e Distribuição](Build-e-Distribuicao) — como os artefatos são gerados
- [Padrões de Código](Padroes-de-Codigo) — restrições sobre novas bibliotecas
