# Abençoa Tur - Plataforma de Gestão de Turismo

O **Abençoa Tur** é uma aplicação web completa para gestão de trilhas, passeios, depoimentos de clientes e galeria de fotos. O sistema possui uma área administrativa segura, onde é possível atualizar o catálogo de opções turísticas que serão refletidas instantaneamente na página principal.

---

## 🚀 Funcionalidades

### 🌐 Área Pública (Frontend)
- Exibição do catálogo de trilhas disponíveis com detalhes (preço, duração, capacidade, descrição).
- Galeria de imagens dos passeios e destinos.
- Seção de depoimentos e avaliações de clientes reais.
- Design totalmente responsivo e moderno (TailwindCSS).

### 🔒 Área Administrativa (Admin Dashboard)
- **Autenticação Segura:** Login protegido via JWT e senhas criptografadas com bcrypt.
- **Catálogo de Trilhas (CRUD):** Criar, visualizar, editar e excluir trilhas e passeios.
- **Gestão de Depoimentos:** Moderação das avaliações dos clientes.
- **Gestão da Galeria:** Upload e remoção de imagens otimizadas para exibição no site.
- **Barra Lateral Retrátil:** Interface amigável e expansível.
- Monitoramento de "Status do Banco de Dados" em tempo real no dashboard.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js + TypeScript** (Inicializado com Vite para máxima performance)
- **TailwindCSS** (Estilização utilitária e responsiva)
- **Lucide React** (Ícones modernos e leves)
- **Axios** (Integração com API REST e interceptadores JWT)
- **React Router Dom** (Navegação entre rotas privadas e públicas)

### Backend
- **Node.js + Express** (Servidor HTTP rápido e escalável)
- **MySQL 2** (Banco de dados relacional operando com Promessas)
- **JSON Web Token (JWT)** (Controle de sessão sem estado/stateless)
- **Bcrypt** (Criptografia unidirecional de senhas)
- **Dotenv** (Gerenciamento de variáveis de ambiente)
- **PM2** (Gerenciador de processos para produção)

---

## 📁 Estrutura do Projeto

O repositório opera como um monorepo que abriga tanto a interface visual quanto a API de dados.

```text
abencoatur/
├── server/                     # Backend Node.js
│   ├── config/                 # Configuração de conexão ao MySQL (db.js)
│   ├── middleware/             # Middlewares (ex: auth.js para validar JWT)
│   ├── routes/                 # Rotas da API (tours, gallery, testimonials, auth)
│   ├── scripts/                # Scripts utilitários (ex: setupAuth.js)
│   └── index.js                # Ponto de entrada do Backend (Porta 3001)
├── src/                        # Frontend React.js
│   ├── components/             # Componentes reaproveitáveis
│   ├── context/                # Contextos Globais (TourContext)
│   ├── pages/                  # Telas da aplicação (ex: admin/Dashboard.tsx, admin/Login.tsx)
│   ├── App.tsx                 # Configuração de Rotas e PrivateRoutes
│   └── main.tsx                # Ponto de entrada do Frontend
├── deploy_trilhas.ps1          # Script PowerShell para Deploy automatizado
├── schema.sql                  # Estrutura do Banco de Dados MySQL
├── package.json                # Dependências raiz do Frontend e Build
└── tailwind.config.js          # Configurações de tema e cores
```

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **MySQL** (Serviço rodando localmente na porta 3306)

### 1. Configurar o Banco de Dados
Abra o seu cliente MySQL (ex: DBeaver, phpMyAdmin, MySQL Workbench) e execute o conteúdo do arquivo `schema.sql` para criar as tabelas `tours`, `gallery`, `testimonials` e `users`.

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo as credenciais de banco e a chave JWT:
```env
DB_HOST=127.0.0.1
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=uma_chave_segura_e_aleatoria
PORT=3001
```

### 3. Instalar as Dependências
Abra o terminal na raiz do projeto e execute:
```bash
# Instala dependências do React
npm install

# Instala dependências do Backend
cd server
npm install
cd ..
```

### 4. Criar Usuário Admin
Execute o script de setup inicial para injetar as credenciais administrativas seguras no banco de dados:
```bash
node server/scripts/setupAuth.js
```
*As credenciais padrão geradas são:*
- **Usuário:** `ligiane`
- **Senha:** `Tototur2026@`

### 5. Iniciar o Projeto Localmente
O sistema precisa que a API e o Frontend rodem em paralelo:

**Terminal 1 (Backend):**
```bash
node server/index.js
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 🚀 Deploy em Produção

O projeto conta com um script PowerShell (`deploy_trilhas.ps1`) para automação de entregas contínuas em um servidor remoto Linux.

### O que o script faz:
1. Conecta ao servidor VPS via SSH utilizando uma `deploy_key`.
2. Clona/Atualiza o código fonte através do Git (`git fetch` e `reset --hard`).
3. Instala todas as novas dependências (`npm install`).
4. Realiza o Build do projeto React (`npm run build`).
5. Inicia ou Reinicia o processo unificado do Node no **PM2** sob o nome `abencoatur`.

### Como fazer o deploy:
Do seu computador Windows local, abra o PowerShell e rode:
```powershell
./deploy_trilhas.ps1
```
*(Nota: Certifique-se de que o arquivo `deploy_key` possui as permissões corretas usando `icacls` antes de rodar o script pela primeira vez).*

---

## 🛡️ Segurança

- **Proteção de Rotas UI:** Utilização de `PrivateRoute` no React impedindo que usuários não logados vejam os painéis.
- **Proteção de API (Interceptadores):** Toda requisição ao painel (mutável) exige um token. O Axios injeta esse JWT via `Authorization: Bearer <token>` dinamicamente no `main.tsx`.
- **Backend Blindado:** O middleware `auth.js` barra requisições PUT, POST e DELETE não autorizadas enviando o status HTTP `401 Unauthorized`. 
- **Hash de Senha:** Em nenhum momento a senha trafega no banco em texto puro, sendo operada com saltos de complexidade 10 pelo `bcrypt`.
