# Fluxo de Deploy - GitHub Actions para VPS

```
┌─────────────────────────────────────────────────────────────────┐
│                     DESENVOLVEDOR                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ git push origin main
                      │ OU execução manual com inputs
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GitHub Actions Workflow: docker-build-vps.yml             │ │
│  │                                                            │ │
│  │  Triggers:                                                 │ │
│  │  • Push para main/master (PRD, build-and-deploy)          │ │
│  │  • Pull Request (PRD, build-and-deploy)                   │ │
│  │  • Manual (workflow_dispatch) com opções:                 │ │
│  │    - Tipo: build-only | build-and-deploy                  │ │
│  │    - Ambiente: PRD | DEV                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 1. Checkout código
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              JOB 1: BUILD (sempre executado)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Determine Environment                                     │ │
│  │  • workflow_dispatch: usa input do usuário                │ │
│  │  • push/PR: usa PRD por padrão                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Create .env                                               │ │
│  │  • Seleciona secrets baseado no ambiente (DEV/PRD)        │ │
│  │  • DEV: usa DATABASE_URL_DEV, API_KEY_DEV, etc.          │ │
│  │  • PRD: usa DATABASE_URL, API_KEY, etc.                  │ │
│  └────────────────────────────────────────────────────────────┘ │
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
│              SERVIDOR VPS - Registry Push                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Load Image and Push to Registry                          │ │
│  │                                                            │ │
│  │  cd $VPS_PATH                                             │ │
│  │    │                                                       │ │
│  │    ├─► git checkout branch-selecionada                    │ │
│  │    ├─► git fetch && git reset --hard origin/branch        │ │
│  │    │   (sempre atualiza para a branch da Action)          │ │
│  │    │                                                       │ │
│  │    ├─► docker load < /tmp/azevedo-site.tar.gz             │ │
│  │    │                                                       │ │
│  │    ├─► docker tag → REGISTRY_HOST:REGISTRY_PORT           │ │
│  │    │                                                       │ │
│  │    ├─► docker push para registry local                    │ │
│  │    │   (SEMPRE faz push para registry)                    │ │
│  │    │                                                       │ │
│  │    ├─► mv /tmp/.env para diretório do projeto             │ │
│  │    │                                                       │ │
│  │    ├─► docker image prune -af --filter "until=24h"        │ │
│  │    │   (SEMPRE limpa imagens antigas)                     │ │
│  │    │                                                       │ │
│  │    └─► rm -f /tmp/azevedo-site.tar.gz                     │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ Job 1 completo
                      │
                      ▼
        ┌─────────────────────────────────┐
        │  Deploy job será executado?     │
        │                                 │
        │  SIM se:                        │
        │  • Push/PR automático           │
        │  • Manual com build-and-deploy  │
        │                                 │
        │  NÃO se:                        │
        │  • Manual com build-only        │
        └─────────────┬───────────────────┘
                      │
                      │ (se SIM)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│          JOB 2: DEPLOY (condicional)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Deploy on VPS                                             │ │
│  │                                                            │ │
│  │  cd $VPS_PATH                                             │ │
│  │    │                                                       │ │
│  │    ├─► Determina container e porta por ambiente:          │ │
│  │    │   • PRD: azevedo-site-container, porta 3000          │ │
│  │    │   • DEV: azevedo-site-container-dev, porta 3001      │ │
│  │    │                                                       │ │
│  │    ├─► docker stop $CONTAINER_NAME (se existir)           │ │
│  │    │                                                       │ │
│  │    ├─► docker rm $CONTAINER_NAME (se existir)             │ │
│  │    │                                                       │ │
│  │    ├─► docker pull do registry local                      │ │
│  │    │                                                       │ │
│  │    ├─► docker run -d                                      │ │
│  │    │     --name $CONTAINER_NAME                           │ │
│  │    │     -p $PORT:3000                                    │ │
│  │    │     --env-file .env                                  │ │
│  │    │     REGISTRY/azevedo-site:latest                    │ │
│  │    │                                                       │ │
│  │    └─► docker exec $CONTAINER_NAME                        │ │
│  │         npx prisma migrate deploy                         │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Verify Deployment                                         │ │
│  │  • docker ps | grep $CONTAINER_NAME                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ ✅ Deploy Completo!
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONTAINERS RODANDO                             │
│                                                                  │
│  PRD: http://VPS_HOST:3000                                      │
│  └─► azevedo-site-container                                    │
│                                                                  │
│  DEV: http://VPS_HOST:3001                                      │
│  └─► azevedo-site-container-dev                                │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

SECRETS NECESSÁRIOS (GitHub):

  VPS_SSH_KEY   → Chave privada SSH para conectar ao VPS
  VPS_HOST      → IP ou domínio do servidor (ex: 123.456.789.10)
  VPS_USER      → Usuário SSH (ex: ubuntu, root)
  VPS_PATH      → Caminho do projeto (ex: /home/ubuntu/azevedo-site)
  REGISTRY_HOST → Host do registry (opcional, padrão: VPS_HOST)
  REGISTRY_PORT → Porta do registry (opcional, padrão: 5000)
  
  Produção (PRD):
  DATABASE_URL  → Connection string do banco de dados (PRD)
  API_KEY       → Chave de API (PRD)
  NEXTAUTH_SECRET → Secret do NextAuth (PRD)
  NEXTAUTH_URL    → URL base do NextAuth (PRD)
  
  Desenvolvimento (DEV) - Opcionais, usa PRD como fallback:
  DATABASE_URL_DEV    → Connection string do banco (DEV)
  API_KEY_DEV         → Chave de API (DEV)
  NEXTAUTH_SECRET_DEV → Secret do NextAuth (DEV)
  NEXTAUTH_URL_DEV    → URL base do NextAuth (DEV)
  
  Opcionais:
  NODE_ENV              → Ambiente (padrão: production para PRD, development para DEV)
  NEXT_TELEMETRY_DISABLED → Desabilitar telemetria (padrão: 1)

═══════════════════════════════════════════════════════════════════

MODOS DE EXECUÇÃO:

  Push/PR Automático:
  → Tipo: build-and-deploy
  → Ambiente: PRD
  → Porta: 3000
  → Container: azevedo-site-container
  
  Manual - Build e Deploy PRD:
  → Tipo: build-and-deploy
  → Ambiente: PRD
  → Porta: 3000
  → Container: azevedo-site-container
  
  Manual - Build e Deploy DEV:
  → Tipo: build-and-deploy
  → Ambiente: DEV
  → Porta: 3001
  → Container: azevedo-site-container-dev
  
  Manual - Apenas Build (sem deploy):
  → Tipo: build-only
  → Ambiente: PRD ou DEV
  → Resultado: Imagem no registry, sem atualizar container

═══════════════════════════════════════════════════════════════════

FUNCIONALIDADES:

  ✓ Usa a branch selecionada na Action para build e deploy
  ✓ Sempre faz git checkout e pull da branch específica no VPS
  ✓ Sempre faz push para o Registry local no VPS
  ✓ Sempre limpa imagens Docker não utilizadas (>24h)
  ✓ Suporta múltiplos ambientes (DEV/PRD)
  ✓ Permite build sem deploy (build-only)
  ✓ Containers diferentes por ambiente (porta e nome)
  ✓ Secrets específicos por ambiente

═══════════════════════════════════════════════════════════════════

TECNOLOGIAS:

  • Next.js 16 (React 19)
  • Prisma 6
  • Docker (Multi-stage build)
  • Node.js 20 Alpine
  • GitHub Actions

═══════════════════════════════════════════════════════════════════
```
