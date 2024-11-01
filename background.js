chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('app.asana.com')) {
        
        chrome.tabs.get(tabId, function(tab) {
            if (chrome.runtime.lastError || !tab) {
                console.error('Invalid tab:', chrome.runtime.lastError);
                return;
            }
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }).catch(error => console.error('Error in content script:', error));

            chrome.storage.sync.get(['hideImages', 'showVideos'], function (data) {
                const hideImages = data.hideImages || false;
                const showVideos = data.showVideos || false;

                // Скрипт для скрытия/показа изображений
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: (hideImages) => {
                        const images = document.querySelectorAll('.BoardCardLayout-image');
                        images.forEach((image) => {
                            image.style.display = hideImages ? 'none' : '';
                        });
                    },
                    args: [hideImages]
                }).catch(error => console.error('Error in hideImages:', error));

                // Скрипт для показа видео
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: (showVideos) => {
                        if (showVideos) {
                            console.log('Enabling video display.');
                        } else {
                            console.log('Disabling video display.');
                        }
                    },
                    args: [showVideos]
                }).catch(error => console.error('Error in showVideos:', error));
            });
        });
    }
});