# Fluxo de Deploy - GitHub Actions para VPS

```
┌─────────────────────────────────────────────────────────────────┐
│                     DESENVOLVEDOR                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ git push origin main
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GitHub Actions Workflow: docker-build-vps.yml             │ │
│  │                                                            │ │
│  │  Triggers:                                                 │ │
│  │  • Push para main/master                                  │ │
│  │  • Pull Request                                           │ │
│  │  • Manual (workflow_dispatch)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 1. Checkout código
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              RUNNER DO GITHUB ACTIONS                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Setup SSH                                                 │ │
│  │  • Cria ~/.ssh/id_rsa com VPS_SSH_KEY                     │ │
│  │  • Configura known_hosts com VPS_HOST                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 2. SSH Connection
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVIDOR VPS                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Deploy and Build                                          │ │
│  │                                                            │ │
│  │  cd $VPS_PATH                                             │ │
│  │    │                                                       │ │
│  │    ├─► git pull origin main                               │ │
│  │    │                                                       │ │
│  │    ├─► Criar .env a partir dos secrets do GitHub          │ │
│  │    │     (DATABASE_URL, NODE_ENV, NEXTAUTH_SECRET, etc)   │ │
│  │    │                                                       │ │
│  │    ├─► docker build -t azevedo-site:latest .              │ │
│  │    │     │                                                 │ │
│  │    │     ├─► Stage 1: Instalar dependências (npm ci)      │ │
│  │    │     ├─► Stage 2: Build Next.js (npm run build)       │ │
│  │    │     └─► Stage 3: Imagem de produção (otimizada)      │ │
│  │    │                                                       │ │
│  │    ├─► docker stop azevedo-site-container (se existir)    │ │
│  │    │                                                       │ │
│  │    ├─► docker rm azevedo-site-container (se existir)      │ │
│  │    │                                                       │ │
│  │    ├─► docker run -d                                      │ │
│  │    │     --name azevedo-site-container                    │ │
│  │    │     -p 3000:3000                                     │ │
│  │    │     --env-file .env                                  │ │
│  │    │     azevedo-site:latest                             │ │
│  │    │                                                       │ │
│  │    ├─► docker exec azevedo-site-container                 │ │
│  │    │     npx prisma migrate deploy                        │ │
│  │    │                                                       │ │
│  │    └─► docker image prune -f                              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Container em execução:                                    │ │
│  │                                                            │ │
│  │  azevedo-site-container                                   │ │
│  │  ├─ Next.js Server (porta 3000)                           │ │
│  │  ├─ Prisma Client                                         │ │
│  │  └─ Conexão com Database                                  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 3. Verificação
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              RUNNER DO GITHUB ACTIONS                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Verify Deployment                                         │ │
│  │  • docker ps | grep azevedo-site-container                │ │
│  │  • Confirma que container está rodando                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cleanup                                                   │ │
│  │  • Remove chave SSH temporária                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ ✅ Deploy Completo!
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USUÁRIO FINAL                                  │
│                                                                  │
│  http://VPS_HOST:3000                                           │
│  └─► Aplicação Next.js rodando                                 │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════

SECRETS NECESSÁRIOS (GitHub):

  VPS_SSH_KEY   → Chave privada SSH para conectar ao VPS
  VPS_HOST      → IP ou domínio do servidor (ex: 123.456.789.10)
  VPS_USER      → Usuário SSH (ex: ubuntu, root)
  VPS_PATH      → Caminho do projeto (ex: /home/ubuntu/azevedo-site)
  DATABASE_URL  → Connection string do banco de dados
  
  Opcionais (adicionados ao .env se configurados):
  NODE_ENV              → Ambiente (padrão: production)
  NEXT_TELEMETRY_DISABLED → Desabilitar telemetria (padrão: 1)
  NEXTAUTH_SECRET       → Secret do NextAuth
  NEXTAUTH_URL          → URL base do NextAuth
  API_KEY               → Chave de API customizada

═══════════════════════════════════════════════════════════════════

TECNOLOGIAS:

  • Next.js 16 (React 19)
  • Prisma 6
  • Docker (Multi-stage build)
  • Node.js 20 Alpine
  • GitHub Actions

═══════════════════════════════════════════════════════════════════
```
