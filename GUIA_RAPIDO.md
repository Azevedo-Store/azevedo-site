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

# Configurar Docker Registry
docker volume create registry-data
docker run -d \
  -p 5000:5000 \
  --name registry \
  --restart unless-stopped \
  -v registry-data:/var/lib/registry \
  registry:2

# Criar diretório do projeto
mkdir -p /home/seu-usuario/azevedo-site
cd /home/seu-usuario/azevedo-site
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
| `DATABASE_URL` | URL do banco de dados (PRD) | `postgresql://user:pass@host:5432/db` |

**Secrets Opcionais:**

| Nome | Valor | Exemplo |
|------|-------|---------|
| `NODE_ENV` | Ambiente (opcional) | `production` (padrão) |
| `NEXT_TELEMETRY_DISABLED` | Desabilitar telemetria (opcional) | `1` (padrão) |
| `NEXTAUTH_SECRET` | Secret NextAuth (opcional) | `sua-chave-secreta` |
| `NEXTAUTH_URL` | URL NextAuth (opcional) | `http://localhost:3000` |
| `API_KEY` | Chave API (opcional) | `sua-api-key` |

**Secrets para Ambiente DEV (Opcionais):**

Se você quiser usar ambientes separados (DEV e PRD), configure também:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DATABASE_URL_DEV` | URL do banco DEV | Se não configurado, usa `DATABASE_URL` |
| `API_KEY_DEV` | API Key DEV | Se não configurado, usa `API_KEY` |
| `NEXTAUTH_SECRET_DEV` | NextAuth secret DEV | Se não configurado, usa `NEXTAUTH_SECRET` |
| `NEXTAUTH_URL_DEV` | NextAuth URL DEV | Se não configurado, usa `NEXTAUTH_URL` |

**Nota:** O workflow cria automaticamente um arquivo `.env` no VPS com todos os secrets configurados.

## 🚀 Usando o Deploy Automático

### Opção 1: Push automático (PRD)
```bash
git add .
git commit -m "Minha alteração"
git push origin main
```
✅ O GitHub Actions vai automaticamente fazer build e deploy em **PRODUÇÃO (porta 3000)**!

### Opção 2: Manual com opções personalizadas

1. Vá em **Actions** no GitHub
2. Selecione **Build Docker on VPS**
3. Clique em **Run workflow**
4. Escolha as opções:
   - **Branch**: Selecione a branch desejada
   - **Tipo de ação**:
     - `build-and-deploy`: Faz build E deploy (padrão)
     - `build-only`: Apenas build e push para registry (sem deploy)
   - **Ambiente**:
     - `PRD`: Produção - porta 3000, container `azevedo-site-container` (padrão)
     - `DEV`: Desenvolvimento - porta 3001, container `azevedo-site-container-dev`
5. Clique em **Run workflow**

### Exemplos de Uso

**Fazer build e deploy em PRODUÇÃO:**
- Branch: Escolha a branch desejada (ex: `main`, `develop`, etc.)
- Tipo de ação: `build-and-deploy`
- Ambiente: `PRD`
- Resultado: Container rodando na porta 3000 com código da branch selecionada

**Fazer build e deploy em DESENVOLVIMENTO:**
- Branch: Escolha a branch desejada (ex: `develop`, `feature/nova-funcionalidade`, etc.)
- Tipo de ação: `build-and-deploy`
- Ambiente: `DEV`
- Resultado: Container rodando na porta 3001 com código da branch selecionada

**Apenas fazer build (sem atualizar containers):**
- Branch: Escolha a branch desejada
- Tipo de ação: `build-only`
- Ambiente: `PRD` ou `DEV`
- Resultado: Imagem atualizada no registry, containers não são alterados

### O que o workflow faz SEMPRE:

✅ Utiliza a branch selecionada na Action para o build  
✅ Faz checkout e pull da branch específica no VPS  
✅ Faz build da imagem Docker da branch selecionada  
✅ Faz push para o Registry local no VPS  
✅ Limpa imagens Docker antigas (mais de 24h)

## 📊 Acompanhar o Deploy

1. Vá em **Actions** no GitHub
2. Clique no workflow em execução
3. Veja os logs em tempo real

## ✅ Verificar se funcionou

```bash
# No VPS - Container de PRODUÇÃO
docker ps | grep azevedo-site-container  # Deve mostrar container rodando na porta 3000

# Ver logs - PRODUÇÃO
docker logs azevedo-site-container

# Testar a aplicação - PRODUÇÃO
curl http://localhost:3000

# No VPS - Container de DESENVOLVIMENTO (se configurado)
docker ps | grep azevedo-site-container-dev  # Deve mostrar container rodando na porta 3001

# Ver logs - DESENVOLVIMENTO
docker logs azevedo-site-container-dev

# Testar a aplicação - DESENVOLVIMENTO
curl http://localhost:3001
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
