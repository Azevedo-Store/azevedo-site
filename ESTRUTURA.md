# 📁 Estrutura do Projeto - GitHub Actions Deploy

Este documento descreve todos os arquivos criados para o sistema de deploy automático.

## 📄 Arquivos Criados

### 🔧 Configuração de Deploy

#### `.github/workflows/docker-build-vps.yml` (2.3KB)
**Workflow principal do GitHub Actions**
- Faz build do Docker no VPS via SSH
- Triggers: push to main/master, PR, manual
- Executa migrations do Prisma
- Reinicia container automaticamente

### 🐳 Docker

#### `Dockerfile` (1.5KB)
**Imagem Docker otimizada para Next.js 16 + Prisma 6**
- Multi-stage build (3 estágios)
- Node.js 20 Alpine
- Standalone output
- Usuário não-root
- OpenSSL para Prisma

#### `.dockerignore` (473 bytes)
**Otimização do build Docker**
- Exclui node_modules, .next, .git
- Reduz tamanho da imagem
- Acelera o build

#### `docker-compose.yml` (891 bytes)
**Alternativa de deploy com PostgreSQL**
- Container da aplicação
- Container do banco PostgreSQL 16
- Rede isolada
- Volumes persistentes

### ⚙️ Configuração

#### `next.config.js` (304 bytes)
**Configuração do Next.js**
- Output standalone habilitado (essencial para Docker)
- Preparado para adicionar outras configs

#### `.env.example` (384 bytes)
**Template de variáveis de ambiente**
- DATABASE_URL para Prisma
- Configurações do Next.js
- Exemplo de outras vars

### 📚 Documentação

#### `README.md` (1.5KB)
**Documentação principal do projeto**
- Overview do projeto
- Quick start com 3 passos
- Links para documentação detalhada
- Comandos de desenvolvimento local

#### `DOCKER_DEPLOY.md` (7.1KB)
**Guia completo de deploy** 📖
- Pré-requisitos detalhados
- Configuração de todos os secrets
- Como funciona o workflow (passo a passo)
- Preparação do VPS (manual e automatizada)
- Personalização avançada
- Troubleshooting extensivo
- Dicas de segurança

#### `GUIA_RAPIDO.md` (3.5KB)
**Guia rápido em português** ⚡
- Setup inicial em 3 etapas
- Tabela de secrets
- Comandos úteis do Docker
- Problemas comuns
- Deploy manual vs automático

#### `WORKFLOW_DIAGRAM.md` (11KB)
**Diagrama visual do fluxo** 📊
- Fluxograma ASCII do deploy completo
- Todos os estágios explicados
- Lista de secrets necessários
- Stack de tecnologias

#### `ESTRUTURA.md` (este arquivo)
**Documentação da estrutura do projeto**
- Descrição de todos os arquivos
- Organização do repositório

### 🚀 Scripts

#### `setup-vps.sh` (4.2KB) 
**Script de setup automático do VPS** 🤖
- Instala Docker e Git
- Clona repositório
- Configura SSH
- Cria .env
- Configura Git
- Mostra IP público
- Tratamento de erros

**Como usar:**
```bash
wget https://raw.githubusercontent.com/DevGabLow/azevedo-site/main/setup-vps.sh
bash setup-vps.sh
```

## 📊 Tamanhos dos Arquivos

| Arquivo | Tamanho | Tipo |
|---------|---------|------|
| WORKFLOW_DIAGRAM.md | 11KB | Documentação |
| DOCKER_DEPLOY.md | 7.1KB | Documentação |
| setup-vps.sh | 4.2KB | Script |
| GUIA_RAPIDO.md | 3.5KB | Documentação |
| .github/workflows/docker-build-vps.yml | 2.3KB | Workflow |
| ESTRUTURA.md | 2.0KB | Documentação |
| README.md | 1.5KB | Documentação |
| Dockerfile | 1.5KB | Docker |
| docker-compose.yml | 891B | Docker |
| .dockerignore | 473B | Docker |
| .env.example | 384B | Config |
| next.config.js | 304B | Config |

**Total:** ~35KB de documentação e configuração

## 🎯 Fluxo Recomendado de Uso

### Para Iniciantes
1. Leia `GUIA_RAPIDO.md` (3 minutos)
2. Execute `setup-vps.sh` no VPS
3. Configure secrets no GitHub
4. Faça push e veja o deploy acontecer!

### Para Usuários Avançados
1. Leia `DOCKER_DEPLOY.md` para entender tudo
2. Veja `WORKFLOW_DIAGRAM.md` para visualizar o fluxo
3. Personalize `docker-compose.yml` se necessário
4. Ajuste `.github/workflows/docker-build-vps.yml`

### Para Depuração
1. `GUIA_RAPIDO.md` → Seção "Problemas Comuns"
2. `DOCKER_DEPLOY.md` → Seção "Solução de Problemas"
3. Verifique logs no GitHub Actions
4. SSH no VPS e veja logs: `docker logs azevedo-site-container`

## 🔐 Secrets Necessários

Todos configurados em: **GitHub → Settings → Secrets → Actions**

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `VPS_SSH_KEY` | Chave privada SSH completa | `-----BEGIN RSA PRIVATE KEY-----...` |
| `VPS_HOST` | IP ou domínio do VPS | `123.456.789.10` |
| `VPS_USER` | Usuário SSH | `ubuntu` |
| `VPS_PATH` | Caminho do projeto | `/home/ubuntu/azevedo-site` |
| `DATABASE_URL` | Connection string | `postgresql://user:pass@host:5432/db` |

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **Prisma 6** - ORM
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **Node.js 20** - Runtime
- **PostgreSQL** - Banco de dados (opcional via docker-compose)

## 📞 Suporte

- Issues no GitHub
- Documentação: `DOCKER_DEPLOY.md`
- Quick help: `GUIA_RAPIDO.md`
- Workflow visual: `WORKFLOW_DIAGRAM.md`

---

**Criado por:** GitHub Copilot Agent  
**Data:** 2026-01-03  
**Versão:** 1.0.0
