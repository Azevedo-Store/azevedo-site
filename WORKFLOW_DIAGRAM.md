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
│  │  Build Docker Image                                        │ │
│  │  • docker build -t azevedo-site:latest                     │ │
│  │  • Multi-stage build (deps → builder → runner)             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Save and Transfer                                         │ │
│  │  • docker save azevedo-site:latest | gzip                  │ │
│  │  • scp imagem + .env para VPS                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 3. Transfer via SCP
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVIDOR VPS                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Deploy on VPS                                             │ │
│  │                                                            │ │
│  │  cd $VPS_PATH                                             │ │
│  │    │                                                       │ │
│  │    ├─► docker load < /tmp/azevedo-site.tar.gz             │ │
│  │    │                                                       │ │
│  │    ├─► docker tag → REGISTRY_HOST:REGISTRY_PORT           │ │
│  │    │                                                       │ │
│  │    ├─► docker push para registry local                    │ │
│  │    │                                                       │ │
│  │    ├─► mv /tmp/.env para diretório do projeto             │ │
│  │    │                                                       │ │
│  │    ├─► docker stop azevedo-site-container (se existir)    │ │
│  │    │                                                       │ │
│  │    ├─► docker rm azevedo-site-container (se existir)      │ │
│  │    │                                                       │ │
│  │    ├─► docker pull do registry local                      │ │
│  │    │                                                       │ │
│  │    ├─► docker run -d                                      │ │
│  │    │     --name azevedo-site-container                    │ │
│  │    │     -p 3000:3000                                     │ │
│  │    │     --env-file .env                                  │ │
│  │    │     REGISTRY/azevedo-site:latest                    │ │
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
  REGISTRY_HOST → Host do registry (opcional, padrão: VPS_HOST)
  REGISTRY_PORT → Porta do registry (opcional, padrão: 5000)
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
