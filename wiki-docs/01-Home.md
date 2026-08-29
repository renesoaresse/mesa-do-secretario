# Home

Bem-vindo ao **Mesa do Secretário**, aplicação de apoio administrativo às sessões maçônicas, que gera e gere atas de forma padronizada. Funciona inteiramente offline, sem conexão com a internet e sem servidor.

A aplicação é distribuída de duas formas, a partir do mesmo código-fonte:

- **desktop**, empacotada em Electron para Windows e macOS;
- **web**, publicada como aplicação estática na Vercel.

---

## Sobre o Projeto

O Mesa do Secretário atende às necessidades das **Lojas Maçônicas do Brasil**, oferecendo uma solução para:

- **Lavrar atas** conforme o rito adotado pela loja, com o texto próprio de cada rito
- **Cadastrar a loja**, seus obreiros e suas gestões uma única vez, com persistência local
- **Visualizar em tempo real** a ata no formato A4, com numeração de linhas
- **Exportar** por impressão, ou em PDF protegido por senha na versão desktop
- **Distribuir** como aplicativo desktop ou como aplicação web

A interface é escrita em React e TypeScript; o empacotamento desktop usa Electron. Todo o código é aberto, e contribuições da comunidade maçônica e de desenvolvedores são bem-vindas.

---

## Funcionalidades

### Ritos

A ata segue o rito cadastrado na loja. Cada rito traz o seu documento, as suas seções e os seus oficiais:

| Rito                    | Situação                                  |
| ----------------------- | ----------------------------------------- |
| Escocês Antigo e Aceito | Documento completo, 23 cargos mapeados    |
| Adonhiramita            | Documento próprio                         |
| York                    | Documento por extenso, 16 cargos mapeados |
| Emulação                | Documento próprio, 19 cargos mapeados     |

### Tipos de Sessão

| Tipo          | Descrição                                                                  |
| ------------- | -------------------------------------------------------------------------- |
| **Econômica** | Sessão de trabalho rotineira — ordem do dia, palavra, expedientes          |
| **Magna**     | Sessão solene — tema especial, orador convidado, autoridades, ato especial |
| **Conjunta**  | Sessão compartilhada com outra loja — identificação das duas casas         |

### Cadastro da Loja

Antes da primeira ata, a loja é cadastrada em três abas — Geral, Gestão e Obreiros:

- **Geral** — nome, número, rito, data de fundação, templo, endereço e Oriente
- **Obreiros** — nome, CIM e grau de cada irmão do quadro
- **Gestão** — o ano, a gestão vigente e o cargo de cada obreiro

Enquanto faltar dado obrigatório, a aplicação mantém o modal de boas-vindas aberto e nenhuma outra tela fica acessível.

### Campos da Ata

- **Configuração da Sessão** — grau (Aprendiz, Companheiro, Mestre), número, data e horários
- **Membros Presentes** — oficiais da sessão, escolhidos no quadro da loja, e visitantes
- **Palavra a Bem da Ordem** — por coluna (Sul, Norte e Oriente) ou em texto corrido, conforme o rito
- **Bolsa de Propostas e Informações** — registro estruturado por natureza e por obreiro
- **Tronco de Beneficência**, **balaústre**, **atos**, **decretos** e demais seções do rito
- **Pré-visualização** em tempo real, no formato A4, com numeração de linhas

### Exportação

| Forma                   | Desktop | Web |
| ----------------------- | ------- | --- |
| Impressão               | Sim     | Sim |
| PDF protegido por senha | Sim     | Não |

A exportação com senha depende do `printToPDF` do Electron. A criptografia acontece na própria aplicação, em AES-128, e a senha não é gravada em lugar nenhum.

### Persistência Local

Os dados ficam **apenas na máquina que os digitou**: no armazenamento do navegador, na versão web, e em arquivo próprio da aplicação, na versão desktop. Nada é enviado a servidor, e outro computador não os acessa.

---

## Tecnologias

- **React 19** — interface
- **TypeScript 5.9**, em modo estrito — tipagem estática
- **Vite 7** — empacotador e servidor de desenvolvimento
- **wouter** — roteamento, por histórico na web e por hash no desktop
- **Electron 40** — empacotamento desktop para Windows e macOS
- **@cantoo/pdf-lib** — geração e criptografia do PDF
- **Vitest 3** e **Testing Library** — testes unitários e de componente
- **Playwright** — testes de ponta a ponta
- **CSS puro**, com design tokens em propriedades CSS — sem frameworks de estilo

---

## Estado do Projeto

Versão corrente **0.8.0**, de 29 de agosto de 2026.

- 325 testes unitários e de componente, todos passando
- Cobertura de linhas em 89,26%, de funções em 83,00% e de ramos em 87,47%
- Duas suítes de ponta a ponta, em Chromium

O histórico completo está no `CHANGELOG.md` da raiz do repositório. A leitura arquitetural desse histórico está em [Evolução Arquitetural](Evolucao-Arquitetural).

---

## Autores

Projeto mantido por desenvolvedores vinculados a Lojas Maçônicas brasileiras:

**Renê Rocha Soares Neto**
Loja Maçônica Hans Werner Menna Barreto König nº 19

**Marcio Alves de Andrade**
Loja Maçônica Luzes do Cruzeiro nº 29

**Victor Moura Amado**
Loja Maçônica Segredo dos 33 nº 09

**Jorge Luiz Mendes Gonçalves Junior**
Loja Maçônica 7 de Setembro nº 01

---

## Como Começar

Consulte a página [Instalação](Instalacao) para instruções completas de instalação e configuração do ambiente de desenvolvimento.

Para um resumo do fluxo de uso, consulte o [Quickstart](Quickstart).

---

## Ver Também

- [Instalação](Instalacao) — Guia de instalação e configuração
- [Quickstart](Quickstart) — Fluxo de uso, do cadastro à ata
- [Arquitetura](Arquitetura) — Estrutura de código e organização do projeto
- [Diagramas](Diagramas) — Contexto, componentes, integração, dados e distribuição
- [Dependências](Dependencias) — Inventário de bibliotecas e estado de atualização
- [Acoplamento e Dívida Técnica](Acoplamento-e-Divida-Tecnica) — Fronteiras violadas e plano de correção
- [Evolução Arquitetural](Evolucao-Arquitetural) — Como a arquitetura chegou ao estado atual
