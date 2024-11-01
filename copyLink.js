console.log('Плагин загружен!');

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .catch(err => {
            alert('Не удалось скопировать в буфер. М.б. нет разрешения для работы с буфером.');
        });
}

function getFormattedText(markdownFormat = true) {
    const taskHeader = document.querySelector('.BaseTextarea.simpleTextarea--dynamic.simpleTextarea.AutogrowTextarea-input');
    if (taskHeader) {
        const taskName = taskHeader.value;
        const taskUrl = window.location.href; // Ссылка на задачу

        if (markdownFormat) {
            //[текст](ссылка)
            return `[${taskName}](${taskUrl})`;
        } else {
            //Google Spreadsheets
            return `=HYPERLINK("${taskUrl}", "${taskName}")`;
        }
    }
    return null;
}

function handleCopyButton() {
    const copyButton = document.querySelector('.TaskPaneToolbar-copyLinkButton');
    if (copyButton) {
        copyButton.addEventListener('click', (event) => {
            console.log('Click');
            
            if (event.metaKey || event.ctrlKey) {
                const useSpreadsheetFormat = event.shiftKey;
                const formattedText = getFormattedText(!useSpreadsheetFormat);
                
                if (formattedText) {
                    copyToClipboard(formattedText);
                    event.preventDefault();
                }
            }
        });
    }
}

handleCopyButton();

const copyObserver = new MutationObserver(() => {
    handleCopyButton();
});
copyObserver.observe(document.body, { childList: true, subtree: true });