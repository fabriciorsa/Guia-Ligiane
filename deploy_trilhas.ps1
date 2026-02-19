$Server = "root@177.47.183.13"
$RemotePath = "/var/www/trilhas"
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
    if pm2 list | grep -q 'trilhas'; then
        pm2 restart trilhas
    else
        pm2 start npm --name trilhas -- start
    fi
    
    echo '--- Deploy Concluído com Sucesso! ---'
"

# Execute SSH
Write-Host "Conectando ao servidor... (Digite a senha se solicitado)" -ForegroundColor Yellow
ssh -t $Server $Cmd

Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
