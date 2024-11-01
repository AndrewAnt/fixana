console.log('Плагин Video загружен!');

function insertVideoPlayer(videoUrl, element, contentType) {
    const existingPlayer = element.querySelector('video');
    if (existingPlayer) {
        return;
    }

    console.log("URL:", videoUrl);

    const videoPlayer = document.createElement('video');
    
    const source = document.createElement('source');
    source.src = videoUrl;
    
    // Если это MOV файл, заменяем тип на MP4 - пока не работает.
    if (contentType === 'video/quicktime') {
        source.type = 'video/mp4';
    } else {
        source.type = contentType;
    }
    
    videoPlayer.appendChild(source);
    videoPlayer.controls = true;
    videoPlayer.style.maxWidth = "100%";
    videoPlayer.style.height = "auto";

    element.insertBefore(videoPlayer, element.firstChild);
}

async function fetchRealVideoUrl(redirectUrl) {
    try {
        const response = await fetch(redirectUrl);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.startsWith("video")) {
            return { url: response.url, contentType };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении реального URL:", error);
        return null;
    }
}

async function checkForVideoLinks() {
    const taskStoryFeed = document.querySelector('.TaskStoryFeed');
    if (!taskStoryFeed) {
        console.log('TaskStoryFeed не найден.');
        return;
    }

    const commentAttachments = taskStoryFeed.querySelectorAll('.HiddenLink.RichAttachment-labelLink.BaseLink');
    for (const attachment of commentAttachments) {
        const fileUrl = attachment.href;

        if (attachment.dataset.processed) {
            continue;
        }

        const videoData = await fetchRealVideoUrl(fileUrl);
        if (videoData) {
            insertVideoPlayer(videoData.url, attachment.closest('.AttachmentCard'), videoData.contentType);
            attachment.dataset.processed = true;
        }
    }
}

// Функция для проверки видео в боковой панели - не работает. Только после перезапуска страницы.
async function checkForVideoLinksInTaskPane() {
    const taskPane = document.querySelector('.SingleTaskPane-body');
    if (!taskPane) {
        console.log('Боковая панель задачи не найдена.');
        return;
    }

    const commentAttachments = taskPane.querySelectorAll('.HiddenLink.RichAttachment-labelLink.BaseLink');
    for (const attachment of commentAttachments) {
        const fileUrl = attachment.href;

        if (attachment.dataset.processed) {
            continue;
        }

        const videoData = await fetchRealVideoUrl(fileUrl);
        if (videoData) {
            insertVideoPlayer(videoData.url, attachment.closest('.AttachmentCard'), videoData.contentType);
            attachment.dataset.processed = true;
        }
    }
}

function waitForTaskStoryFeed() {
    const observer = new MutationObserver(() => {
        const taskStoryFeed = document.querySelector('.TaskStoryFeed');
        if (taskStoryFeed) {
            observer.disconnect();
            checkForVideoLinks();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function observeTaskPane() {
    const observer = new MutationObserver(() => {
        checkForVideoLinksInTaskPane();
    });

    const taskPane = document.querySelector('.SingleTaskPane-body');
    if (taskPane) {
        observer.observe(taskPane, { childList: true, subtree: true, attributes: true });
        checkForVideoLinksInTaskPane();
    }
}

function showVideosBasedOnFlag() {
    chrome.storage.sync.get('showVideos', function (data) {
        if (data.showVideos) {
            waitForTaskStoryFeed();
            observeTaskPane();
        }
    });
}

showVideosBasedOnFlag();