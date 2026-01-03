# azevedo-site

Projeto Next.js 16 com React 19 e Prisma 6.

## 🚀 Deploy Automático com Docker

Este projeto está configurado com GitHub Actions para fazer deploy automático em um servidor VPS usando Docker.

### Guias de Deploy

- 📖 **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** - Guia rápido para começar (RECOMENDADO)
- 📚 **[DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)** - Documentação completa e detalhada
- 🛠️ **setup-vps.sh** - Script automático de setup do VPS

### Quick Start

1. **No VPS**, execute o script de setup:
   ```bash
   wget https://raw.githubusercontent.com/DevGabLow/azevedo-site/main/setup-vps.sh
   bash setup-vps.sh
   ```

2. **No GitHub**, configure os secrets (Settings → Secrets):
   - `VPS_SSH_KEY` - Chave privada SSH
   - `VPS_HOST` - IP do servidor
   - `VPS_USER` - Usuário SSH
   - `VPS_PATH` - Caminho do projeto
   - `DATABASE_URL` - Connection string do banco

3. **Push para main** e veja o deploy acontecer automaticamente! 🎉

## 🏃 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Gerar Prisma Client
npx prisma generate

# Executar em modo de desenvolvimento
npm run dev
```

## 🐳 Docker

### Build local
```bash
docker build -t azevedo-site .
docker run -p 3000:3000 -e DATABASE_URL="sua-connection-string" azevedo-site
```

### Docker Compose
```bash
docker-compose up -d
```

## 📦 Tecnologias

- Next.js 16
- React 19
- Prisma 6
- Node.js 20