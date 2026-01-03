# Guia Rápido - Deploy com GitHub Actions

## 🎯 Resumo

Este projeto está configurado para fazer deploy automático no VPS sempre que você fizer push para a branch `main` ou `master`.

## ⚡ Configuração Inicial (Fazer UMA VEZ)

### 1. No seu VPS:

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Clonar o repositório
cd /home/seu-usuario
git clone https://github.com/DevGabLow/azevedo-site.git
cd azevedo-site

# Criar arquivo .env com suas configurações
cp .env.example .env
nano .env  # Edite com suas configurações
```

### 2. No seu computador local:

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copiar chave pública para o VPS
ssh-copy-id seu-usuario@ip-do-vps

# Ver chave privada (para copiar)
cat ~/.ssh/id_rsa
```

### 3. No GitHub (repositório):

Vá em **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicione estes secrets:

| Nome | Valor | Exemplo |
|------|-------|---------|
| `VPS_SSH_KEY` | Chave privada SSH completa | (todo o conteúdo de `~/.ssh/id_rsa`) |
| `VPS_HOST` | IP ou domínio do VPS | `123.456.789.10` |
| `VPS_USER` | Usuário SSH do VPS | `ubuntu` ou `root` |
| `VPS_PATH` | Caminho do projeto no VPS | `/home/ubuntu/azevedo-site` |
| `DATABASE_URL` | URL do banco de dados | `postgresql://user:pass@host:5432/db` |

## 🚀 Usando o Deploy Automático

### Opção 1: Push automático
```bash
git add .
git commit -m "Minha alteração"
git push origin main
```
✅ O GitHub Actions vai automaticamente fazer o deploy!

### Opção 2: Manual
1. Vá em **Actions** no GitHub
2. Selecione **Build Docker on VPS**
3. Clique em **Run workflow**
4. Selecione a branch e clique em **Run workflow**

## 📊 Acompanhar o Deploy

1. Vá em **Actions** no GitHub
2. Clique no workflow em execução
3. Veja os logs em tempo real

## ✅ Verificar se funcionou

```bash
# No VPS
docker ps  # Deve mostrar azevedo-site-container rodando

# Ver logs
docker logs azevedo-site-container

# Testar a aplicação
curl http://localhost:3000
```

## 🔧 Comandos Úteis no VPS

```bash
# Ver status do container
docker ps -a

# Ver logs
docker logs -f azevedo-site-container

# Parar container
docker stop azevedo-site-container

# Iniciar container
docker start azevedo-site-container

# Reiniciar container
docker restart azevedo-site-container

# Entrar no container
docker exec -it azevedo-site-container sh

# Ver imagens
docker images

# Limpar recursos não utilizados
docker system prune -a
```

## 🐛 Problemas Comuns

### Deploy falhou
1. Veja os logs no **Actions** do GitHub
2. Verifique se todos os secrets estão configurados
3. Teste a conexão SSH do seu PC para o VPS

### Container não inicia
```bash
# No VPS, veja os logs
docker logs azevedo-site-container

# Problemas comuns:
# - DATABASE_URL incorreta
# - Porta 3000 já em uso
# - Erro no código
```

### Porta 3000 já em uso
```bash
# No VPS, veja o que está usando a porta
sudo lsof -i :3000

# Mate o processo
sudo kill -9 PID
```

## 📝 Personalizar

### Mudar a porta
Edite `.github/workflows/docker-build-vps.yml`:
```yaml
-p 8080:3000 \  # Expõe na porta 8080
```

### Adicionar variável de ambiente
Edite `.github/workflows/docker-build-vps.yml`:
```yaml
-e NOVA_VAR="${{ secrets.NOVA_VAR }}" \
```

E adicione `NOVA_VAR` nos secrets do GitHub.

## 📚 Documentação Completa

Para mais detalhes, veja [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)
