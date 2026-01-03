#!/bin/bash

# Script de setup para o VPS
# Execute este script no seu VPS para configurar tudo automaticamente

set -e

echo "🚀 Configurando ambiente para azevedo-site..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para printar mensagens
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Verificar se está rodando no Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "Este script deve ser executado no Linux"
    exit 1
fi

# Atualizar sistema
print_info "Atualizando sistema..."
sudo apt-get update -qq

# Instalar Docker se não estiver instalado
if ! command -v docker &> /dev/null; then
    print_info "Instalando Docker..."
    # Download do script
    curl -fsSL https://get.docker.com -o get-docker.sh
    # Verificar se o download foi bem sucedido
    if [ -f get-docker.sh ]; then
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        print_success "Docker instalado"
    else
        print_error "Falha ao baixar script de instalação do Docker"
        print_info "Instale manualmente: https://docs.docker.com/engine/install/"
        exit 1
    fi
else
    print_success "Docker já instalado"
fi

# Instalar Git se não estiver instalado
if ! command -v git &> /dev/null; then
    print_info "Instalando Git..."
    sudo apt-get install -y git
    print_success "Git instalado"
else
    print_success "Git já instalado"
fi

# Perguntar informações do projeto
print_info "Configuração do projeto"
read -p "Nome de usuário do GitHub: " GITHUB_USER
read -p "Diretório de instalação (padrão: /home/$USER/azevedo-site): " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/home/$USER/azevedo-site}

# Clonar repositório se não existir
if [ ! -d "$INSTALL_DIR" ]; then
    print_info "Clonando repositório..."
    git clone https://github.com/$GITHUB_USER/azevedo-site.git $INSTALL_DIR
    print_success "Repositório clonado em $INSTALL_DIR"
else
    print_success "Repositório já existe em $INSTALL_DIR"
fi

cd $INSTALL_DIR

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    print_info "Criando arquivo .env..."
    cp .env.example .env
    print_info "Por favor, edite o arquivo .env com suas configurações"
    print_info "Caminho: $INSTALL_DIR/.env"
else
    print_success "Arquivo .env já existe"
fi

# Configurar SSH
print_info "Configurando SSH..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

if [ ! -f ~/.ssh/authorized_keys ]; then
    touch ~/.ssh/authorized_keys
fi
chmod 600 ~/.ssh/authorized_keys

print_info "Adicione sua chave pública SSH ao arquivo:"
print_info "~/.ssh/authorized_keys"

# Configurar Git
print_info "Configurando Git..."
read -p "Seu email para Git: " GIT_EMAIL
read -p "Seu nome para Git: " GIT_NAME

git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"
git config --global pull.rebase false

print_success "Git configurado"

# Resumo
echo ""
echo "═══════════════════════════════════════════════════════════"
print_success "Setup concluído!"
echo "═══════════════════════════════════════════════════════════"
echo ""
print_info "Próximos passos:"
echo ""
echo "1. Configure o arquivo .env:"
echo "   nano $INSTALL_DIR/.env"
echo ""
echo "2. Adicione sua chave SSH pública ao arquivo:"
echo "   nano ~/.ssh/authorized_keys"
echo ""
echo "3. Configure os secrets no GitHub:"
echo "   VPS_SSH_KEY = (sua chave privada)"
PUBLIC_IP_FOR_SECRETS=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "SEU_IP_AQUI")
echo "   VPS_HOST = $PUBLIC_IP_FOR_SECRETS"
echo "   VPS_USER = $USER"
echo "   VPS_PATH = $INSTALL_DIR"
echo "   DATABASE_URL = (sua connection string)"
echo ""
echo "4. Faça um push para a branch main e o deploy acontecerá automaticamente!"
echo ""
print_info "Para testar o Docker manualmente:"
echo "   cd $INSTALL_DIR"
echo "   docker build -t azevedo-site ."
echo "   docker run -p 3000:3000 --env-file .env azevedo-site"
echo ""
print_info "IP público deste servidor (se disponível):"
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "Não foi possível determinar automaticamente")
echo "   $PUBLIC_IP"
if [ "$PUBLIC_IP" = "Não foi possível determinar automaticamente" ]; then
    print_info "Execute 'curl ifconfig.me' ou 'ip addr' para ver o IP manualmente"
fi
echo ""

# Se Docker foi recém instalado, avisar sobre logout
if groups $USER | grep -q "\bdocker\b"; then
    print_success "Usuário já está no grupo docker"
else
    print_info "IMPORTANTE: Faça logout e login novamente para usar Docker sem sudo"
fi
