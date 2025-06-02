const textarea = document.getElementById('editor');

function salvar(){
    const conteudo = textarea.value;

    // chama a função salvarArquivo do preload.js
    window.electronAPI.salvarArquivo(conteudo);

}

async function carregar() {
    const {conteudo, nomeArquivo} = await window.electronAPI.carregarArquivo();

    if (conteudo !== null) {
        textarea.value = conteudo;
        document.title = `Editor - ${nomeArquivo}`;
        document.getElementById('nome-arquivo').textContent = nomeArquivo;
    }
}