# azevedo-site

Projeto Next.js 16 com React 19 e Prisma 6.

## 🚀 Deploy Automático com Docker

Este projeto está configurado com GitHub Actions para fazer deploy automático em um servidor VPS usando Docker.

### Documentação completa

Consulte [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md) para instruções detalhadas sobre:
- Configuração dos secrets do GitHub
- Preparação do servidor VPS
- Personalização do workflow
- Solução de problemas

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