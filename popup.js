document.addEventListener('DOMContentLoaded', function () {
    const toggleImagesCheckbox = document.getElementById('toggleImages');
    const showVideosCheckbox = document.getElementById('showVideos');
    
    chrome.storage.sync.get(['hideImages', 'showVideos'], function (data) {
        toggleImagesCheckbox.checked = data.hideImages || false;
        showVideosCheckbox.checked = data.showVideos || false;
    });

    toggleImagesCheckbox.addEventListener('change', function () {
        const hideImages = this.checked;

        chrome.storage.sync.set({ hideImages: hideImages }, function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function (hideImages) {
                        const images = document.querySelectorAll('.BoardCardLayout-image');
                        images.forEach((image) => {
                            if (hideImages) {
                                image.style.display = 'none';
                            } else {
                                image.style.display = '';
                            }
                        });
                    },
                    args: [hideImages]
                });
            });
        });
    });

    showVideosCheckbox.addEventListener('change', function () {
        const showVideos = this.checked;

        chrome.storage.sync.set({ showVideos: showVideos }, function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function (showVideos) {
                        if (showVideos) {
                            console.log('Включаем видео.');
                        } else {
                            console.log('Выключаем видео.');
                        }
                    },
                    args: [showVideos]
                });
            });
        });
    });
});