# Home

Bem-vindo ao **Mesa do Secretário**, uma aplicação _desktop_ para apoio administrativo em sessões maçônicas, permitindo a geração e gestão de atas de forma padronizada — tudo offline, sem necessidade de conexão com a internet.

---

## Sobre o Projeto

O Mesa do Secretário foi desenvolvido para atender às necessidades específicas de **Lojes Maçônicas do Brasil**, oferecendo uma solução para:

- **Gerar atas** para os três tipos de sessão previstos pela maçonaria: Econômica, Magna e Conjunta
- **Visualizar em tempo real** o preview da ata no formato A4 conforme padrão ABNT
- **Exportar para impressão** com formatação profissional
- **Configurar a loja** e seus oficiales uma única vez, com persistência local
- **Distribuir como aplicativo _desktop_** para Windows e macOS

A aplicação é construída com _React_ + _TypeScript_ no frontend e _Electron_ para empacotamento _desktop_. Todo o código é **open source** e acolhemos contribuições da comunidade maçônica e de desenvolvedores.

---

## Funcionalidades

### Tipos de Sessão

| Tipo          | Descrição                                                                  |
| ------------- | -------------------------------------------------------------------------- |
| **Econômica** | Sessão de trabalho rotineira — pauta do dia, Palavra decada, Expedientes   |
| **Magna**     | Sessão solene — tema especial, orador convidado, autoridades, ato especial |
| **Conjunta**  | Sessão compartilhada com outra loja — identification das duas casas        |

### Campos da Ata

A ata é dividida em seções editáveis:

- **Configuração da Sessão** — grau (Aprendiz, Companheiro, Mestre), número, data, horários
- **Membros Presentes** — oficiais e visitantes com registro individual
- **Palavra decada decada** — Sul, Norte e Oriente
- **Expedientes** — balaustre, atos e decretos, Expedientes, Bolsa de Propostas
- **Ata Completa** — preview em tempo real com formatação A4

### Persistência Local

Todos os dados são armazenados no navegador do usuário via `localStorage`, sem necessidade de servidor ou cadastro. A configuração da loja e os oficiales são salvos automaticamente.

---

## Tecnologias

O projeto utiliza as seguintes tecnologias:

- **React 19** — interface do usuário
- **TypeScript 5.9** (strict mode) — tipagem estática
- **Vite 7** — bundler e servidor de desenvolvimento
- **Electron 40** — empacotamento _desktop_ para Windows e macOS
- **Vitest 3** — testes unitários e de integração
- **Playwright** — testes E2E (_end-to-end_)
- **CSS Puro** — sistema de _design_ tokens via propriedades CSS (sem frameworks CSS)

---

## _Features_ Implementadas em v0.3.0

A versão atual (v0.3.0) inclui as seguintes melhorias em relação à versão inicial:

- **Preview seguro**: O preview da ata agora é renderizado de forma declarativa, sem uso de `dangerouslySetInnerHTML`, eliminando riscos de injeção de HTML
- **Persistência ampliada**: Os campos principais da ata são salvos automaticamente, permitindo retomada do preenchimento após fechar o navegador
- **Estado canonico**: O módulo de documentos foi removido; o estado persistido agora segue um draft canônico da ata
- **Infraestrutura de testes expandida**: 34 novos arquivos de teste cobrindo componentes, formulários, listas, layout e composição principal
- **Testes E2E**: Cenários de restauração de campos persistidos e limpeza de dados legados
- **Cobertura de testes**: 93,90% da suíte unitária

---

## Autores

Este projeto é mantido por desenvolvedores vinculados a Lojes Maçônicas brasileiras:

**Renê Rocha Soares Neto**
Loja Maçônica Hans Werner Menna Barreto König nº 19

**Marcio Alves de Andrade**
Loja Maçônica Luzes do Cruzeiro nº 29

---

## Como Começar

Consulte a página [Instalação](Instalacao) para instruções completas de instalação e configuração do ambiente de desenvolvimento.

Para um resumo rápido do fluxo de uso, consulte o [Quickstart](Quickstart).

---

## Ver Também

- [Instalação](Instalacao) — Guia de instalação e configuração
- [Arquitetura](Arquitetura) — Estrutura de código e organização do projeto
