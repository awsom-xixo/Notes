const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // cria uma função para salvar um arquivo que recebe 'conteudo' e que envia 
    // esse conteúdo pro main.js usando o canal salvar-arquivo."
    salvarArquivo: (conteudo) => ipcRenderer.send('salvar-arquivo', conteudo),

    // invoke pede algo pro main.js e espera uma resposta
    carregarArquivo: () => ipcRenderer.invoke('carregar-arquivo')
});

