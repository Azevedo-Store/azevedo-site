# ✅ Checklist de Verificação do Deploy

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Deploy (Configuração Inicial)

### No VPS
- [ ] Docker instalado e funcionando
  ```bash
  docker --version
  docker ps
  ```
- [ ] Git instalado
  ```bash
  git --version
  ```
- [ ] Repositório clonado no VPS
  ```bash
  ls -la /caminho/do/projeto
  ```
- [ ] Arquivo `.env` criado e configurado
  ```bash
  cat .env  # Verificar DATABASE_URL e outras vars
  ```
- [ ] Chave SSH pública adicionada ao `~/.ssh/authorized_keys`
  ```bash
  cat ~/.ssh/authorized_keys
  ```
- [ ] Usuário tem permissão para usar Docker sem sudo
  ```bash
  docker ps  # Deve funcionar sem sudo
  ```

### No GitHub
- [ ] Secret `VPS_SSH_KEY` configurado (chave privada completa)
- [ ] Secret `VPS_HOST` configurado (IP ou domínio)
- [ ] Secret `VPS_USER` configurado (usuário SSH)
- [ ] Secret `VPS_PATH` configurado (caminho do projeto)
- [ ] Secret `DATABASE_URL` configurado (connection string)

### Teste de Conexão SSH
- [ ] Consegue conectar via SSH do computador local
  ```bash
  ssh -i ~/.ssh/id_rsa usuario@ip-do-vps
  ```
- [ ] Consegue executar comandos Docker remotamente
  ```bash
  ssh usuario@ip-do-vps "docker ps"
  ```

## 🚀 Primeiro Deploy

### Verificar Workflow
- [ ] Workflow aparece em Actions do GitHub
- [ ] Workflow está marcado como "active"
- [ ] Arquivo YAML não tem erros de sintaxe

### Executar Deploy Manual (Teste)
- [ ] Ir em Actions → Build Docker on VPS
- [ ] Clicar em "Run workflow"
- [ ] Selecionar branch main/master
- [ ] Clicar em "Run workflow"
- [ ] Aguardar execução (pode levar 5-10 minutos)

### Verificar Logs do Workflow
- [ ] Step "Checkout code" - ✅ Sucesso
- [ ] Step "Setup SSH" - ✅ Sucesso
- [ ] Step "Deploy and Build on VPS" - ✅ Sucesso
  - [ ] git fetch/reset executado
  - [ ] docker build concluído
  - [ ] Container antigo parado e removido
  - [ ] Container novo iniciado
  - [ ] Migrations executadas (se aplicável)
- [ ] Step "Verify Deployment" - ✅ Sucesso
- [ ] Step "Cleanup SSH" - ✅ Sucesso

## 🔍 Verificação Pós-Deploy

### No VPS
- [ ] Container está rodando
  ```bash
  docker ps | grep azevedo-site-container
  ```
- [ ] Container não está reiniciando constantemente
  ```bash
  docker ps  # Olhar coluna STATUS
  ```
- [ ] Logs do container não mostram erros
  ```bash
  docker logs azevedo-site-container
  ```
- [ ] Aplicação responde localmente
  ```bash
  curl http://localhost:3000
  ```
- [ ] Porta 3000 está aberta
  ```bash
  sudo lsof -i :3000
  ```

### Acesso Externo
- [ ] Firewall permite conexões na porta 3000
  ```bash
  sudo ufw status  # Ubuntu
  # ou
  sudo firewall-cmd --list-all  # CentOS
  ```
- [ ] Aplicação responde externamente
  ```bash
  curl http://IP-DO-VPS:3000
  ```
- [ ] Navegador consegue acessar http://IP-DO-VPS:3000

### Database (Prisma)
- [ ] Migrations foram executadas
  ```bash
  docker exec azevedo-site-container npx prisma migrate status
  ```
- [ ] Conexão com banco está funcionando
  ```bash
  docker logs azevedo-site-container | grep -i "database\|prisma"
  ```

## 🔄 Deploy Automático

### Teste de Push
- [ ] Fazer uma mudança simples no código
  ```bash
  echo "# Test" >> README.md
  git add .
  git commit -m "Test auto deploy"
  git push origin main
  ```
- [ ] Workflow inicia automaticamente
- [ ] Deploy é executado com sucesso
- [ ] Mudanças aparecem na aplicação

## 🐛 Troubleshooting

### Se o workflow falhar:

#### Erro de SSH
- [ ] Verificar se `VPS_SSH_KEY` está completo (incluindo BEGIN/END)
- [ ] Verificar se chave pública está no VPS
- [ ] Testar conexão SSH manualmente

#### Erro de Build
- [ ] Verificar logs do Docker no VPS
- [ ] Verificar se todas as dependências estão no package.json
- [ ] Verificar se Dockerfile está correto

#### Container não inicia
- [ ] Verificar DATABASE_URL está correta
- [ ] Verificar se porta 3000 está disponível
- [ ] Ver logs: `docker logs azevedo-site-container`

#### Migrations falham
- [ ] Verificar DATABASE_URL
- [ ] Verificar se banco de dados está acessível
- [ ] Executar migrations manualmente para ver erro completo:
  ```bash
  docker exec -it azevedo-site-container npx prisma migrate deploy
  ```

## 📊 Performance e Monitoramento

### Recursos do Container
- [ ] Container não está usando muita CPU
  ```bash
  docker stats azevedo-site-container
  ```
- [ ] Container não está usando muita memória
- [ ] Disco tem espaço suficiente
  ```bash
  df -h
  ```

### Limpeza
- [ ] Imagens antigas foram removidas
  ```bash
  docker images
  ```
- [ ] Containers órfãos foram removidos
  ```bash
  docker ps -a
  ```

## ✅ Deploy Pronto!

Se todos os itens acima estão marcados, seu deploy está funcionando perfeitamente! 🎉

## 📝 Próximos Passos

- [ ] Configurar domínio personalizado
- [ ] Configurar SSL/HTTPS (Let's Encrypt)
- [ ] Configurar Nginx como reverse proxy
- [ ] Configurar backup do banco de dados
- [ ] Configurar monitoramento (ex: Uptime Robot)
- [ ] Configurar logs persistentes

## 📚 Documentação

- Problemas? Veja [GUIA_RAPIDO.md](./GUIA_RAPIDO.md)
- Detalhes técnicos? Veja [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)
- Entender o fluxo? Veja [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md)
