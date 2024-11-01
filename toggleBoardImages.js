chrome.storage.sync.get('hideImages', function (data) {
    const hideImages = data.hideImages || false;
    toggleBoardImages(hideImages);
});

function toggleBoardImages(hideImages) {
    try {
        const images = document.querySelectorAll('.BoardCardLayout-image');
        if (images && images.length > 0) {
            images.forEach((image) => {
                if (hideImages) {
                    image.style.display = 'none';
                } else {
                    image.style.display = '';
                }
            });
        } else {
            console.log('Изображения не найдены.');
        }
    } catch (error) {
        console.error('Шляпа:', error);
    }
}

const observer = new MutationObserver(() => {
    chrome.storage.sync.get('hideImages', function (data) {
        if (data && typeof data.hideImages !== 'undefined') {
            toggleBoardImages(data.hideImages);
        }
    });
});

if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    console.log('Что-то пошло не так');
}