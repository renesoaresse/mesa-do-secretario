# Changelog

Este documento descreve o formato e a política de manutenção do histórico de mudanças do Mesa do Secretário.

O arquivo `CHANGELOG.md` na raiz do repositório é a fonte autoritativa do histórico de mudanças. Esta página wiki serve como guia para entender o formato e a política.

---

## Política de Manutenção

O CHANGELOG do Mesa do Secretário é mantido **manualmente**. Não usamos ferramentas automáticas de geração de changelog (como `standard-version`, `release-please` ou `semantic-release`).

Esta decisão é intencional: manter o changelog manualmente força os autores a articarem o **impacto para o usuário** de cada mudança, produzindo uma documentação significativa em vez de um _log_ mecânico de commits.

**A versão no `package.json` é atualizada manualmente** pelos mantenedores, não automaticamente por CI.

---

## Formato: Keep a Changelog

O formato segue a especificação [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), com as seguintes categorias:

### Categorias

| Categoria      | Quando usar                            |
| -------------- | -------------------------------------- |
| **Adicionado** | Novas funcionalidades                  |
| **Alterado**   | Mudanças em funcionalidades existentes |
| **Removido**   | Funcionalidades removidas              |
| **Segurança**  | Mudanças relacionadas a segurança      |
| **Correções**  | Correções de bugs                      |

### Estrutura

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Adicionado

- Descrição da nova funcionalidade

### Alterado

- Descrição da mudança com impacto no usuário

### Removido

- Funcionalidade que foi removida

### Segurança

- Correção ou melhoria de segurança

### Correções

- Bugs corrigidos
```

---

## Versionamento Semântico

O projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):

| Tipo      | Quando incrementar                                    | Exemplo       |
| --------- | ----------------------------------------------------- | ------------- |
| **MAJOR** | Mudança incompatível com versões anteriores           | 0.2.0 → 1.0.0 |
| **MINOR** | Nova funcionalidade compatível com versões anteriores | 0.2.0 → 0.3.0 |
| **PATCH** | Correção de bug compatível com versões anteriores     | 0.2.0 → 0.2.1 |

**Situação atual**: O projeto está em fase de desenvolvimento inicial (v0.x.y), onde a API pública ainda não está estabilizada. Breaking changes podem ocorrer em versões 0.x.y.

---

## Histórico de Versões

O histórico completo, versão a versão, vive em **[`CHANGELOG.md`](https://github.com/renesoaresse/mesa-do-secretario/blob/main/CHANGELOG.md) na raiz do repositório**, e apenas lá.

Esta página descreve o formato e a política; ela não reproduz o histórico. A cópia que existia aqui parou na versão 0.3.0 e ficou sete versões atrás do arquivo da raiz, o que é o argumento contra manter duas cópias do mesmo conteúdo.

Para a leitura arquitetural do histórico — quais versões mudaram estrutura, fronteira ou alvo de execução — consulte [Evolução Arquitetural](Evolucao-Arquitetural).

## Adicionando Entradas ao Changelog

Ao fazer uma mudança significativa, adicione uma entrada ao `CHANGELOG.md`:

1. **Não espere** — adicione a entrada no mesmo PR que faz a mudança
2. Use a **voz do usuário** — descreva o impacto, não o que foi feito tecnicamente
3. **Uma entrada por mudança significativa** — não liste cada _commit_
4. Agrupe por **categoria** (Adicionado, Alterado, Removido, etc.)
5. Se a mudança afeta a **segurança**, use a categoria **Segurança**
6. Se a mudança é uma **correção**, use a categoria **Correções**

### Exemplos de Boas Entradas

```markdown
## [UNRELEASED]

### Adicionado

- Preview seguro: campos textuais agora são renderizados sem interpretar HTML,
  eliminando riscos de injeção de conteúdo malicioso

### Alterado

- Persistência ampliada: campos da ata são salvos automaticamente, permitindo
  retomada do preenchimento após fechar o navegador

### Removido

- Módulo de documentos: a funcionalidade de importação de PDFs foi removida
  para simplificar o fluxo de edição
```

### Exemplos de Entradas Ruins

```markdown
# ❌ Evitar — detalhe técnico, não impacto para o usuário

### Alterado

- Refatorou storage.ts para usar IPC

# ❌ Evitar — lista de commits, não changelog

### Adicionado

- feat(session): adiciona tipo de sessão
- feat(preview): adiciona renderização
- fix(storage): corrige bug null
```

---

## Ver Também

- [Home](Home) — Visão geral do projeto
