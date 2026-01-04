# Configuração do GitHub Action para Build Docker no VPS

Este repositório contém um GitHub Action configurado para fazer build de uma imagem Docker diretamente em um servidor VPS.

**Tecnologias:** Next.js 16, React 19, Prisma 6

## 📋 Pré-requisitos

1. Um servidor VPS com:
   - Docker instalado
   - Git instalado
   - SSH habilitado
   - Usuário com permissões para executar comandos Docker
   - Banco de dados configurado (PostgreSQL, MySQL, etc.) para o Prisma

2. Repositório Git clonado no VPS

3. Arquivo `next.config.js` com `output: 'standalone'` configurado

## 🔐 Configuração dos Secrets do GitHub

Para que o workflow funcione, você precisa configurar os seguintes secrets no GitHub:

### Como adicionar secrets:
1. Vá para o repositório no GitHub
2. Clique em **Settings** > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione cada um dos secrets abaixo:

### Secrets necessários:

#### `VPS_SSH_KEY`
A chave privada SSH para conectar ao VPS.

**Como obter:**
```bash
# No seu computador local, gere uma chave SSH (se ainda não tiver)
ssh-keygen -t rsa -b 4096 -C "github-actions@azevedo-site"

# Copie a chave PRIVADA (todo o conteúdo do arquivo)
cat ~/.ssh/id_rsa
```

**Importante:** 
- Cole o conteúdo COMPLETO da chave privada (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
- Adicione a chave PÚBLICA ao arquivo `~/.ssh/authorized_keys` no VPS

#### `VPS_HOST`
O endereço IP ou domínio do seu VPS.

**Exemplo:** `123.456.789.10` ou `vps.seudominio.com`

#### `VPS_USER`
O usuário SSH do VPS.

**Exemplo:** `root` ou `ubuntu` ou `azevedo`

#### `VPS_PATH`
O caminho completo onde o repositório está clonado no VPS.

**Exemplo:** `/home/azevedo/azevedo-site` ou `/var/www/azevedo-site`

#### `REGISTRY_HOST` (Opcional)
O endereço do Docker Registry no VPS. Se não configurado, usa o mesmo valor de `VPS_HOST`.

**Exemplo:** `localhost` ou `registry.seudominio.com`

#### `REGISTRY_PORT` (Opcional)
A porta do Docker Registry. Padrão: `5000`

**Exemplo:** `5000` ou `5001`

#### `DATABASE_URL` (Obrigatório)
A URL de conexão com o banco de dados para o Prisma.

**Exemplo:** `postgresql://usuario:senha@localhost:5432/azevedo_db`

#### `NODE_ENV` (Opcional)
Ambiente de execução da aplicação. Padrão: `production`

**Exemplo:** `production` ou `development`

#### `NEXT_TELEMETRY_DISABLED` (Opcional)
Desabilita telemetria do Next.js. Padrão: `1`

**Exemplo:** `1` (desabilitado) ou `0` (habilitado)

#### Secrets Opcionais:

Os seguintes secrets são opcionais e serão adicionados ao `.env` apenas se configurados:

- **`NEXTAUTH_SECRET`**: Chave secreta para NextAuth.js
- **`NEXTAUTH_URL`**: URL base da aplicação para NextAuth.js
- **`API_KEY`**: Chave de API customizada

**Nota:** O workflow cria automaticamente um arquivo `.env` no VPS a partir desses secrets durante o deploy.

#### Secrets Específicos de Ambiente (Opcionais):

Para suportar múltiplos ambientes (DEV/PRD), você pode configurar secrets específicos:

- **`DATABASE_URL_DEV`**: URL do banco de dados para ambiente DEV
- **`API_KEY_DEV`**: API Key para ambiente DEV  
- **`NEXTAUTH_SECRET_DEV`**: NextAuth secret para ambiente DEV
- **`NEXTAUTH_URL_DEV`**: NextAuth URL para ambiente DEV

**Nota:** Se os secrets específicos de DEV não forem configurados, o workflow usará os secrets de produção como fallback.

## 🚀 Como funciona o Workflow

O GitHub Action é acionado automaticamente quando:
- Há um push para a branch `main` ou `master` (modo: build-and-deploy, ambiente: PRD)
- Há um pull request para `main` ou `master` (modo: build-and-deploy, ambiente: PRD)
- É executado manualmente através da interface do GitHub com opções personalizáveis

### Execução Manual

Ao executar manualmente, você pode escolher:

1. **Tipo de Ação**:
   - `build-and-deploy` (padrão): Faz build E deploy
   - `build-only`: Apenas build e push para registry (sem deploy)

2. **Ambiente**:
   - `PRD` (padrão): Produção (porta 3000, container: azevedo-site-container)
   - `DEV`: Desenvolvimento (porta 3001, container: azevedo-site-container-dev)

### Estrutura do Workflow

O workflow está dividido em 2 jobs:

#### Job 1: Build (sempre executado)

1. **Checkout**: Baixa o código do repositório
2. **Setup SSH**: Configura a conexão SSH com o VPS
3. **Determine environment**: Define ambiente (DEV ou PRD) baseado no input
4. **Create .env**: Cria arquivo `.env` com secrets apropriados para o ambiente
5. **Build Docker Image**: Builda a imagem Docker no GitHub Actions
6. **Save and Transfer**: Transfere imagem e .env para o VPS via SCP
7. **Load Image and Push to Registry**: 
   - Atualiza código no VPS (`git pull` da versão mais nova)
   - Carrega a imagem no Docker do VPS
   - Tagueia e faz push para o registry local
   - Move .env para o diretório do projeto
   - Limpa arquivos temporários e imagens não utilizadas (mais de 24h)
8. **Cleanup**: Remove arquivos SSH temporários

#### Job 2: Deploy (condicional)

Executado apenas se:
- For push/PR automático OU
- For execução manual com action_type = 'build-and-deploy'

1. **Setup SSH**: Configura a conexão SSH com o VPS
2. **Determine environment**: Define ambiente (DEV ou PRD)
3. **Deploy on VPS**: 
   - Para e remove o container antigo
   - Faz pull da imagem do registry
   - Inicia novo container com porta e nome baseados no ambiente
   - Executa migrations do Prisma
4. **Verify**: Verifica se o container está rodando
5. **Cleanup**: Remove arquivos SSH temporários

## 📦 Preparando o VPS

### Pré-requisito: Docker Registry

O VPS deve ter um Docker Registry rodando. Se ainda não tiver, configure com:

```bash
# Criar volume para o registry
docker volume create registry-data

# Executar registry
docker run -d \
  -p 5000:5000 \
  --name registry \
  --restart unless-stopped \
  -v registry-data:/var/lib/registry \
  registry:2

# Verificar se está rodando
docker ps | grep registry
```

### Opção 1: Setup Automático (Recomendado)

Execute o script de setup que automatiza todo o processo:

```bash
# Download e execução do script
wget https://raw.githubusercontent.com/DevGabLow/azevedo-site/main/setup-vps.sh
bash setup-vps.sh
```

O script irá:
- Instalar Docker e Git (se necessário)
- Clonar o repositório
- Configurar SSH
- Criar arquivo .env
- Configurar Git

### Opção 2: Setup Manual

### 1. Instalar Docker (se ainda não instalado)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Clonar o repositório no VPS

```bash
cd /home/seu-usuario
git clone https://github.com/DevGabLow/azevedo-site.git
cd azevedo-site
```

### 3. Configurar SSH

```bash
# No VPS, adicione a chave pública ao authorized_keys
echo "sua-chave-publica-aqui" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. Configurar Git no VPS (para permitir git pull)

```bash
git config --global user.email "seu-email@exemplo.com"
git config --global user.name "Seu Nome"

# Configurar para aceitar pulls sem merge commits
git config pull.rebase false
```

## ⚙️ Personalizando o Workflow

### Alterar a porta da aplicação

No arquivo `.github/workflows/docker-build-vps.yml`, altere a linha:
```yaml
-p 3000:3000 \
```
Para a porta desejada (exemplo: `-p 8080:3000` expõe no VPS na porta 8080)

### Adicionar variáveis de ambiente

Adicione variáveis de ambiente ao container:
```yaml
docker run -d \
  --name azevedo-site-container \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
  --restart unless-stopped \
  azevedo-site:latest
```

### Usar Docker Compose

Se preferir usar docker-compose, substitua o step "Deploy and Build" por:
```yaml
- name: Deploy with Docker Compose
  run: |
    ssh -i ~/.ssh/id_rsa $VPS_USER@$VPS_HOST << 'EOF'
      cd ${{ secrets.VPS_PATH }}
      git pull origin main
      docker-compose down
      docker-compose up -d --build
      docker-compose ps
    EOF
```

## 🧪 Testando manualmente

Você pode testar o workflow manualmente:

1. Vá para **Actions** no GitHub
2. Selecione **Build Docker on VPS**
3. Clique em **Run workflow**
4. Selecione a branch desejada
5. Escolha as opções:
   - **Tipo de ação**: 
     - `build-and-deploy`: Faz build e deploy completo
     - `build-only`: Apenas build e push para registry (sem deploy)
   - **Ambiente**: 
     - `PRD`: Produção (porta 3000)
     - `DEV`: Desenvolvimento (porta 3001)
6. Clique em **Run workflow**

### Exemplos de Uso

- **Build e Deploy em Produção**: action_type=`build-and-deploy`, environment=`PRD`
- **Build e Deploy em Desenvolvimento**: action_type=`build-and-deploy`, environment=`DEV`
- **Apenas Build (sem deploy)**: action_type=`build-only`, environment=`PRD` ou `DEV`

## 🐛 Solução de Problemas

### Erro de permissão SSH
```bash
# No VPS, verifique as permissões
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Erro "permission denied" ao executar Docker
```bash
# No VPS, adicione o usuário ao grupo docker
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### Container não inicia
```bash
# No VPS, verifique os logs
docker logs azevedo-site-container
```

### Porta já em uso
```bash
# No VPS, verifique processos usando a porta
sudo lsof -i :3000
# Pare o processo ou altere a porta no workflow
```

## 📝 Dockerfile

O arquivo `Dockerfile` está otimizado para Next.js 16 com Prisma 6:

- **Multi-stage build** para imagens menores e mais seguras
- **Node.js 20 Alpine** para performance
- **Standalone output** do Next.js para reduzir tamanho
- **Suporte completo ao Prisma** com OpenSSL
- **Usuário não-root** para segurança
- Build otimizado com cache de dependências

### Estrutura do projeto necessária:

```
azevedo-site/
├── .github/
│   └── workflows/
│       └── docker-build-vps.yml
├── prisma/
│   └── schema.prisma
├── public/
├── src/ ou app/
├── .dockerignore
├── Dockerfile
├── next.config.js (com output: 'standalone')
├── package.json
└── DOCKER_DEPLOY.md
```

## 🔒 Segurança

- **NUNCA** commite chaves SSH privadas no repositório
- Use secrets do GitHub para informações sensíveis
- Mantenha o Docker e o sistema operacional atualizados
- Configure um firewall no VPS
- Use HTTPS com certificado SSL em produção

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Key Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

## 🤝 Contribuindo

Sinta-se livre para melhorar este workflow através de pull requests!
