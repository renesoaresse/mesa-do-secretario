# Acoplamento e Dívida Técnica

Este documento reúne as fronteiras violadas, as regras documentadas que nenhuma ferramenta impõe e o plano de correção, cada item no formato de issue. Apuração de 29 de agosto de 2026, na versão 0.8.0.

Para a arquitetura pretendida, consulte [Arquitetura](Arquitetura). Para as regras, consulte [Padrões de Código](Padroes-de-Codigo).

---

## Regra Documentada e Regra Executável

Uma regra escrita na wiki e não imposta por ferramenta não é convenção: é intenção. O quadro abaixo confronta cada regra desta wiki com o mecanismo que a sustenta.

| Regra                                   | Mecanismo que a impõe                 | Cumprida no código                      |
| --------------------------------------- | ------------------------------------- | --------------------------------------- |
| Não usar `any`                          | `typescript-eslint` recomendado       | Sim, 0 ocorrências                      |
| `noUnusedLocals` e `noUnusedParameters` | `tsconfig.app.json`                   | Sim                                     |
| Modo estrito de TypeScript              | `tsconfig.app.json`                   | Sim                                     |
| Acessibilidade em JSX                   | `eslint-plugin-jsx-a11y`              | Sim                                     |
| Formatação                              | Prettier via `lint-staged` e Husky    | Sim                                     |
| Mensagem de commit                      | `commitlint` com Conventional Commits | Sim                                     |
| `localStorage` só em `services/storage` | **Nenhum**                            | Sim, por disciplina                     |
| Complexidade máxima de 15               | ESLint, em nível de aviso             | Não verificado                          |
| **Import apenas por barrel export**     | **Nenhum**                            | **Não, 27 violações**                   |
| **Componentes com `FC<Props>`**         | **Nenhum**                            | **Não, 0 usos — a regra estava errada** |
| **Sem estilo em linha**                 | **Nenhum**                            | **Não, 52 ocorrências**                 |
| **Design tokens documentados**          | **Nenhum**                            | **Não, nenhum nome batia**              |

As três últimas regras foram corrigidas na wiki em agosto de 2026: a de `FC<Props>` e a de tokens descreviam um código que não existe mais, e a de estilo em linha passou a valer apenas para código novo.

---

## Fronteiras Violadas

A regra de barrel export existe desde a versão 0.2.0 e é descumprida em **27 imports**. A distribuição mostra que o problema é estrutural, não pontual:

| Origem                                                     | Alvo                            | Ocorrências | Gravidade |
| ---------------------------------------------------------- | ------------------------------- | ----------- | --------- |
| `src/components/layout/SidebarContent.tsx`                 | Internos de 5 _features_        | 12          | Alta      |
| `src/router/index.tsx`                                     | Internos de 4 _features_        | 7           | Média     |
| `src/app/AppEditor.tsx`                                    | `session` e `loja-config`       | 2           | Média     |
| `src/components/layout/MainPreview.tsx`                    | `preview`                       | 2           | Média     |
| `src/hooks/useAtaState.ts`                                 | `loja-config/data/oficiais`     | 1           | Média     |
| **`src/features/officers/components/OfficerSelect.tsx:5`** | **`loja-config/data/oficiais`** | **1**       | **Alta**  |

O caso de `OfficerSelect.tsx:5` é o mais grave: é uma _feature_ alcançando o interior de outra, sem passar por API pública nenhuma. Os demais são camadas de cima (layout, roteador, composição) alcançando o interior das _features_ — indesejável, porém hierarquicamente coerente.

Nenhum ciclo de importação foi encontrado.

---

## Concentrações de Responsabilidade

| Arquivo                    | Linhas | Observação                                                      |
| -------------------------- | ------ | --------------------------------------------------------------- |
| `src/services/storage.ts`  | 446    | Concentra as duas estratégias de persistência e todas as chaves |
| `src/hooks/useAtaState.ts` | 426    | Estado completo da ata num único _hook_                         |
| `src/app/AppEditor.tsx`    | 116    | Composição da tela de edição                                    |

Os dois primeiros são os pontos de maior rotatividade do projeto: participam de praticamente toda versão desde a 0.4.0. Enquanto o crescimento acompanhar a chegada de novas _features_, não há ação a tomar; a partir do momento em que uma alteração de _feature_ passar a exigir mudança nos dois, cabe fatiar por domínio.

---

## Cobertura Excluída

`vitest.config.ts` exclui da cobertura, além dos barrels, tipos e do próprio ferramental de teste:

- `src/app/providers.tsx` — arquivo de duas linhas, apenas um `export {}` reservado para provedores futuros. Exclusão justificada, mas o arquivo em si é um espaço vazio desde a versão 0.2.0.
- `src/features/loja-config/components/LojaConfigForm.tsx` — exclusão sem justificativa registrada. É a única exclusão de componente com regra de negócio.
- `src/electron/**` — coberto pela suíte própria do shell, descrita em [Testes](Testes).

---

## Vulnerabilidades

`yarn audit` em 29 de agosto de 2026: **596 vulnerabilidades** em 1103 pacotes auditados — 23 críticas, 379 altas, 177 moderadas, 17 baixas. Todas em dependências de desenvolvimento; nenhuma alcança o artefato entregue ao usuário.

A origem é concentrada:

| Dependência de topo   | Advisories | Situação                             |
| --------------------- | ---------- | ------------------------------------ |
| `@electron-forge/cli` | 334        | **Dependência sem uso no projeto**   |
| `electron-builder`    | 96         | Em uso, atualização menor disponível |
| `wait-on`             | 33         | Em uso, atualização menor disponível |
| `vitest`              | 25         | Em uso, atualização maior disponível |
| `typescript-eslint`   | 24         | Em uso, atualização menor disponível |
| `electron`            | 21         | Em uso, atualização maior disponível |

Críticas notáveis: `tar` (negação de serviço na descompressão, via `@electron-forge/cli` e `electron-builder`), `shell-quote` (escape incompleto, via `concurrently`) e `vitest` (leitura arbitrária de arquivo enquanto o servidor de interface está escutando).

---

## Issues Propostas

### ISSUE-001 — Remover `@electron-forge/cli`

**Prioridade**: alta. **Esforço**: baixo.

**Contexto**: a dependência está declarada em `package.json:51` e não é referenciada em nenhum ponto do projeto. O empacotamento é feito por `electron-builder`.

**Impacto**: elimina **334 das 596 vulnerabilidades** (56% do total), incluindo advisories críticos de `tar`, e reduz o tempo de instalação da árvore de desenvolvimento.

**Plano**: remover a linha do `package.json`, rodar `yarn install`, confirmar `yarn dist:win` e `yarn dist:mac`.

**Critério de aceite**: `yarn audit --summary` abaixo de 270 vulnerabilidades e artefatos de Windows e macOS gerados com sucesso.

**Rótulos**: `seguranca`, `dependencias`, `ganho-rapido`.

---

### ISSUE-002 — Impor a regra de barrel export no ESLint

**Prioridade**: alta. **Esforço**: médio.

**Contexto**: a regra existe desde a versão 0.2.0, está documentada em [Padrões de Código](Padroes-de-Codigo) e é descumprida em 27 imports. `eslint.config.js` tem apenas `complexity` como regra própria.

**Impacto**: sem mecanismo, a fronteira entre _features_ continuará erodindo a cada versão. O caso `OfficerSelect.tsx:5` mostra que a erosão já chegou ao nível _feature_ para _feature_.

**Plano**:

1. Acrescentar `no-restricted-imports` com padrão `**/features/*/components/**`, `**/features/*/hooks/**` e `**/features/*/data/**`, em nível de erro.
2. Exportar pelo barrel de cada _feature_ o que hoje é importado por caminho interno.
3. Corrigir os 27 imports, começando por `OfficerSelect.tsx:5`.
4. Se a correção completa não couber numa entrega, ligar a regra apenas para imports entre _features_ e deixar as camadas superiores em aviso, com prazo.

**Critério de aceite**: `yarn lint` verde com a regra em nível de erro para imports entre _features_.

**Rótulos**: `arquitetura`, `lint`, `divida-tecnica`.

---

### ISSUE-003 — Atualizar as dependências de intervalo compatível

**Prioridade**: média. **Esforço**: baixo.

**Contexto**: 20 pacotes têm atualização menor ou de correção dentro do intervalo `^` já declarado, incluindo `react` e `react-dom` (19.2.4 para 19.2.8), `wouter`, `@cantoo/pdf-lib`, `electron-builder`, `prettier` e a família `@testing-library`.

**Impacto**: reduz parte das vulnerabilidades de `electron-builder` e `wait-on` sem quebra esperada.

**Plano**: `yarn upgrade`, suíte unitária, suíte de ponta a ponta e um empacotamento de cada alvo.

**Critério de aceite**: `yarn test`, `yarn test:e2e`, `yarn dist:win` e `yarn dist:mac` verdes.

**Rótulos**: `dependencias`, `manutencao`.

---

### ISSUE-004 — Planejar as atualizações maiores

**Prioridade**: média. **Esforço**: alto.

**Contexto**: dez pacotes têm versão maior disponível, com destaque para `typescript` 5.9 para 7.0, `vite` 7 para 8, `vitest` 3 para 4, `eslint` 9 para 10 e `electron` 40 para 41.

**Impacto**: `electron` carrega correções de segurança do Chromium e deve vir primeiro. `vitest` 4 encerra o advisory crítico do servidor de interface. `typescript` 7 e `eslint` 10 são as de maior risco de quebra e podem esperar.

**Plano**: uma entrega por bloco, nesta ordem — (1) `electron` e `electron-builder`; (2) `vitest` e `@vitest/coverage-v8`; (3) `vite` e `@vitejs/plugin-react`; (4) `eslint`, `@eslint/js` e `globals`; (5) `typescript`. Cada bloco com suíte verde antes do seguinte.

**Critério de aceite**: cinco entregas, cada uma com a suíte completa verde e os artefatos gerados.

**Rótulos**: `dependencias`, `atualizacao-maior`.

---

### ISSUE-005 — Justificar ou remover a exclusão de `LojaConfigForm.tsx` da cobertura

**Prioridade**: baixa. **Esforço**: baixo.

**Contexto**: `vitest.config.ts` exclui esse componente da cobertura, sem justificativa registrada. É a única exclusão de componente com regra de negócio.

**Impacto**: a cobertura anunciada não reflete o componente do formulário principal de configuração da loja.

**Plano**: cobrir o componente e remover a exclusão, ou registrar a justificativa no próprio arquivo de configuração.

**Critério de aceite**: exclusão removida ou comentada com a razão.

**Rótulos**: `testes`, `divida-tecnica`.

---

### ISSUE-006 — Migrar os estilos em linha para o CSS

**Prioridade**: baixa. **Esforço**: médio.

**Contexto**: 52 usos de `style={{ … }}` em 27 arquivos, concentrados em `loja-config` (8 arquivos) e `bolsa` (4), quase todos espaçamento e largura.

**Impacto**: contorna os _design tokens_ e espalha valores fixos pelos componentes.

**Plano**: migrar por arquivo tocado, começando pelas duas _features_ concentradoras. Não bloquear entregas por isso.

**Critério de aceite**: nenhum `style={{ … }}` novo, e as duas _features_ concentradoras migradas.

**Rótulos**: `css`, `divida-tecnica`.

---

### ISSUE-007 — Decidir o destino de `src/app/providers.tsx`

**Prioridade**: baixa. **Esforço**: baixo.

**Contexto**: o arquivo tem duas linhas, apenas um `export {}` com comentário de reserva, e está excluído da cobertura desde a versão 0.3.0.

**Impacto**: nenhum em funcionamento; é um espaço reservado que nunca foi ocupado.

**Plano**: remover o arquivo e a exclusão correspondente, ou registrar qual provedor está previsto e quando.

**Critério de aceite**: arquivo removido ou com destino registrado.

**Rótulos**: `limpeza`.

---

## Dúvidas em Aberto

- A regra de complexidade máxima de 15 está em nível de aviso; não foi apurado quantos arquivos a ultrapassam hoje.
- Não há execução de `lint`, `test` nem `audit` em integração contínua versionada no repositório; não foi possível confirmar se existe alguma fora dele.

---

## Ver Também

- [Arquitetura](Arquitetura) — estrutura pretendida
- [Padrões de Código](Padroes-de-Codigo) — regras vigentes
- [Dependências](Dependencias) — inventário completo
