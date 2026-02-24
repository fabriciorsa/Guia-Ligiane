$Server = "root@177.47.183.13"
$RemotePath = "/var/www/guia-ligiane"
$Repo = "https://github.com/fabriciorsa/Guia-Ligiane.git"

Write-Host "Iniciando Deploy em $Server..." -ForegroundColor Green

# Command to execute on server
$Cmd = "
    set -e
    echo '--- Verificando Diretório ---'
    mkdir -p $RemotePath
    
    echo '--- Atualizando Código ---'
    if [ ! -d $RemotePath/.git ]; then
        git clone $Repo $RemotePath
    else
        cd $RemotePath
        git pull origin main
    fi
    
    echo '--- Instalando Dependências ---'
    cd $RemotePath
    npm install
    
    echo '--- Build da Aplicação ---'
    npm run build
    
    echo '--- Gerenciamento de Processo (PM2) ---'
    if pm2 list | grep -q 'guia-ligiane'; then
        pm2 restart guia-ligiane
    else
        pm2 start npm --name guia-ligiane -- start
    fi
    
    echo '--- Deploy Concluído com Sucesso! ---'
"

# Execute SSH
Write-Host "Conectando ao servidor..." -ForegroundColor Yellow
ssh -i deploy_key -t $Server $Cmd

Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
