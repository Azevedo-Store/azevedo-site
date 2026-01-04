# Configuração de Segurança - Workflows e Deploy

Este documento descreve as configurações de segurança implementadas para proteger os workflows e deploys de produção.

## 🔒 Proteções Implementadas

### 1. Proteção de Workflows (CODEOWNERS)

O arquivo `.github/CODEOWNERS` garante que apenas **@DevGabLow** pode aprovar alterações em:
- Arquivos de workflow (`.github/workflows/`)
- Arquivo CODEOWNERS (`.github/CODEOWNERS`)

**Como funciona:**
- Qualquer Pull Request que modifique esses arquivos requer aprovação de @DevGabLow
- Commits diretos na branch principal não são afetados (recomenda-se configurar branch protection)

### 2. Proteção de Deploy para Produção

Os workflows de deploy agora utilizam **GitHub Environments** para controlar quem pode fazer deploy:

#### Workflows protegidos:
- `deploy-prod.yml` - Deploy para produção (environment: `production`)
- `docker-build-vps.yml` - Deploy VPS (environment: `production` para PRD, `development` para DEV)

## ⚙️ Configuração Necessária no GitHub

Para ativar completamente as proteções, configure o seguinte no GitHub:

### Passo 1: Ativar Branch Protection para `main`

1. Vá em **Settings** → **Branches** → **Add rule**
2. Configure:
   - **Branch name pattern**: `main`
   - ✅ **Require pull request reviews before merging**
     - **Required approving reviews**: 1
     - ✅ **Require review from Code Owners**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Include administrators** (opcional, mas recomendado)
   - ✅ **Restrict who can push to matching branches** (opcional)

### Passo 2: Configurar Environment Protection para `production`

1. Vá em **Settings** → **Environments** → **New environment**
2. Nome do environment: `production`
3. Configure **Environment protection rules**:
   - ✅ **Required reviewers**: Adicione `@DevGabLow`
   - ✅ **Wait timer**: 0 minutos (ou configure um delay se preferir)
   - (Opcional) **Deployment branches**: Apenas `main`

### Passo 3: Configurar Environment para `development` (Opcional)

1. Vá em **Settings** → **Environments** → **New environment**
2. Nome do environment: `development`
3. Configure conforme necessário (pode deixar sem proteções ou com proteções menos rigorosas)

## 🛡️ O Que Está Protegido Agora

### Modificação de Workflows
- ❌ Outros usuários **NÃO PODEM** modificar workflows sem aprovação
- ✅ @DevGabLow pode aprovar mudanças nos workflows
- 📝 PRs que modificam workflows aparecem com indicação "Requires review from code owner"

### Deploy para Produção
- ❌ Workflows de produção **NÃO EXECUTAM** automaticamente sem aprovação
- ✅ @DevGabLow precisa aprovar cada deploy para produção
- 📊 Histórico de deploys e aprovações fica registrado
- 🔍 Logs de quem aprovou cada deploy

### Deploy para Desenvolvimento (DEV)
- ✅ Deploys para DEV podem ter proteções mais leves ou nenhuma proteção
- 🔄 Útil para testes e desenvolvimento

## 📋 Checklist de Segurança

Após configurar os environments no GitHub, verifique:

- [ ] CODEOWNERS está configurado em `.github/CODEOWNERS`
- [ ] Branch protection rule está ativa para `main` com "Require review from Code Owners"
- [ ] Environment `production` está criado com required reviewers
- [ ] Testar: fazer PR com mudança em workflow - deve exigir aprovação de @DevGabLow
- [ ] Testar: fazer deploy para PRD (environment `production`) - deve exigir aprovação de @DevGabLow

## 🧪 Como Testar

### Testar Proteção de Workflow:
1. Criar uma branch de teste
2. Modificar qualquer arquivo em `.github/workflows/`
3. Abrir PR
4. Verificar que o PR mostra "Review required from @DevGabLow"

### Testar Proteção de Deploy:
1. Fazer push para `main` ou executar workflow manualmente selecionando PRD (usa environment `production`)
2. Workflow deve pausar no job de deploy
3. Em Actions → Workflow run, deve aparecer "Waiting for approval"
4. @DevGabLow deve aprovar ou rejeitar o deploy

## 📚 Documentação Adicional

- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
