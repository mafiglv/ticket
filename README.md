# Sistema de Controle de Atendimento - Tickets

Aplicativo de controle de senhas para atendimento em clínicas e laboratórios médicos, desenvolvido para a disciplina de Programação de Dispositivos Móveis.

Projeto desenvolvido pela dupla **Flávia Sousa Amazonas** e **Germária Lins Vilela**.

---

## 📋 Descrição do Projeto
Este aplicativo permite a emissão, controle e atendimento de senhas para diferentes tipos de serviços (Prioritário, Exames e Geral), com regras específicas de priorização, controle de horários e relatórios estatísticos de atendimento.

O sistema foi desenvolvido em React e TypeScript, com armazenamento local no navegador (localStorage), sem necessidade de backend.

---

## 🛠 Funcionalidades Implementadas

- Emissão de senhas dos tipos Prioritária (SP), Exames (SE) e Geral (SG)
- Geração automática do código de senha no formato YYMMDD-TIPONUM (ex.: 240428-SP001)
- Controle de horário de funcionamento (07h às 17h)
- Descarte automático de senhas emitidas após o horário de atendimento
- Chamada de senhas com alternância e priorização conforme o tipo e agente (AS, AA, AC)
- Cálculo do tempo médio de atendimento
- Relatório visual de senhas atendidas
- Exportação do relatório de atendimentos em arquivo CSV
- Painel exibindo as últimas 5 senhas chamadas

---

## 📱 Telas do Aplicativo

### Tela Inicial
Escolha entre Cliente e Atendente.

![Tela Inicial](./assets/screenshot-home.png)

### Tela de Emissão de Senhas
Cliente escolhe o tipo de senha para atendimento.

![Emissão de Senhas](./assets/screenshot-emissao.png)

### Tela do Painel de Atendimento
Atendente chama clientes, vê atendimentos realizados e gera relatório.

![Painel de Atendimento](./assets/screenshot-painel.png)

---

## 🚀 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/tickets.git

2. Instale as dependências:
    ```bash
    npm install

3. Rode o projeto:
    ```bash
    npm start

4. Acesse no navegador:
    http://localhost:3000

📋 Requisitos
Node.js versão 14.x ou superior

npm versão 6.x ou superior

Navegador atualizado (Google Chrome, Edge ou Firefox)

## 📝 Licença

Este projeto está licenciado sob a Licença Creative Commons CC0 1.0 Universal (Domínio Público).

Consulte o arquivo [LICENSE](./LICENSE) para mais informações.
