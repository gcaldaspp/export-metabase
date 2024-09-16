document.getElementById('exportBtn').addEventListener('click', () => {
    // Injetar o script na aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: exportTableToCSV
        });
    });
});

// Função que será injetada e executada na página
function exportTableToCSV() {
    // Inicializa a variável string que armazenará o conteúdo
    let csvString = '';

    // Seleciona todas as divs que possuem a classe 'TableInteractive-cellWrapper'
    const cells = document.querySelectorAll('.TableInteractive-cellWrapper');

    // Itera sobre todas as divs selecionadas
    cells.forEach(cell => {
        if (cell.className == "TableInteractive-cellWrapper cursor-pointer") {
            return
        }
        // Adiciona o conteúdo de texto da célula seguido de uma vírgula
        var delimiter = ";"
        // Se a célula também tiver a classe 'TableInteractive-cellWrapper--lastColumn', adiciona uma quebra de linha
        if (cell.classList.contains('TableInteractive-cellWrapper--lastColumn')) {
            // Remove a última vírgula antes de adicionar a quebra de linha
            delimiter = '\n';
        }
         csvString += cell.innerText.trim() + delimiter
    });

    // Cria um arquivo Blob com os dados CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.csv';

    // Simula o clique para download do arquivo
    document.body.appendChild(link);
    link.click();

    // Remove o link após o download
    document.body.removeChild(link);
}
