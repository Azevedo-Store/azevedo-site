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

#### `DATABASE_URL` (Opcional mas recomendado)
A URL de conexão com o banco de dados para o Prisma.

**Exemplo:** `postgresql://usuario:senha@localhost:5432/azevedo_db`

**Nota:** Se preferir, pode configurar a DATABASE_URL diretamente no VPS através de um arquivo `.env` ou variável de ambiente do sistema.

## 🚀 Como funciona o Workflow

O GitHub Action é acionado automaticamente quando:
- Há um push para a branch `main` ou `master`
- Há um pull request para `main` ou `master`
- É executado manualmente através da interface do GitHub

### Passos do workflow:

1. **Checkout**: Baixa o código do repositório
2. **Setup SSH**: Configura a conexão SSH com o VPS
3. **Deploy and Build**: 
   - Conecta ao VPS via SSH
   - Navega para o diretório do projeto
   - Faz pull das últimas mudanças
   - Builda a imagem Docker (multi-stage build otimizado para Next.js)
   - Para e remove o container antigo (se existir)
   - Inicia um novo container com a imagem atualizada
   - Executa migrations do Prisma (se aplicável)
   - Limpa imagens Docker antigas
4. **Verify**: Verifica se o container está rodando
5. **Cleanup**: Remove arquivos SSH temporários

## 📦 Preparando o VPS

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
4. Selecione a branch e clique em **Run workflow**

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
