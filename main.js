// Importando dois módulos do Electron
// app controla o ciclo de vida do aplicativo
// BrowserWindow cria janelas do app

const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');

const fs = require('fs');

// escuta a tentativa de salvar um arquivo
// 'salvar-arquivo' é o nome do canal que o renderer.js vai usar para enviar o conteúdo,
// ele precisa ser o mesmo no preload.js
ipcMain.on('salvar-arquivo', async (event, conteudo) => {

    // mostra uma janela para o usuário escolher onde salvar o arquivo
    const { filePath } = await dialog.showSaveDialog({
        title: 'Salvar como...',
        defaultPath: 'nota.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });

    // se o usuário escolheu um caminho de arquivo
    if (filePath) {
        // escreve o conteúdo no arquivo escolhido
        fs.writeFileSync(filePath, conteudo, 'utf-8');
        console.log(`Arquivo salvo com sucesso!`)
    }
});

// escuta a tentativa de carregar um arquivo
// o diferencial de 'on' pra 'handle' é que ele permite responder com um valor,
// sendo o valor de return
ipcMain.handle('carregar-arquivo', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Abrir Arquivo',
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });

    if (!canceled && filePaths.length > 0) {
        // le o conteúdo do arquivo selecionado
        // o conteudo é retornado para o preload.js
        const caminho = filePaths[0];
        const conteudo = fs.readFileSync(caminho, 'utf-8');
        const nomeArquivo = caminho.split('/').pop(); // Extrai o nome do arquivo do caminho

        console.log(`${nomeArquivo} aberto com sucesso!`)

        return{
            conteudo,
            nomeArquivo
        }
    }

    return null; // Retorna null se o usuário cancelar ou não selecionar um arquivo
});

// A função createWindow carrega uma janela web dentro do aplicativo
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            //esconder o menu de contexto do navegador
            enableRemoteModule: false
        }


    });

    win.loadFile('index.html');
}

// Quando o aplicativo estiver pronto, cria a janela
app.whenReady().then(() => {
    createWindow()

    // No macOS, os apps costumam continuar ativos mesmo com todas as janelas fechadas
    // Então, ativar o app quando nenhuma janela estiver aberta abrirá uma nova.

    // Quando o app estiver ativo e nenhuma janela estiver aberta, cria uma nova.

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed'), () => {
    // Se o usuário fechar todas as janelas, o aplicativo será fechado
    if (process.platform !== 'darwin') { //darwin é macOS, enquanto win32 é Windows e linux é Linux
        app.quit();
    }
}
