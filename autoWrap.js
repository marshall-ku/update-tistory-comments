const autoWrap = (containerId, selector) => {
    const wrapping = async () => {
        const link = /(\b(https?|ftp|file):\/\/[-A-Z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|+&@#\/%?=~_|!:,.;]*[-A-Z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|+&@#\/%=~_|])/gi; // 링크 찾기
        const imageType = /\.(?:jpe?g(:(large|orig))?|gif|png(:(large|orig))?|svg)$/i; // 이미지
        const TistoryImage = /(?:\?original)$/i; // 티스토리 ?original 이미지
        const videoType = /\.(?:mp4|mkv|webm)$/i; // 비디오
        const audioType = /\.(?:mp3|ogg|wav)$/i; // 오디오
        const youtubeLink = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?/g; // 유튜브 비디오

        const mod = (string) => {
            return string.replace(link, (uri) => {
                if (imageType.test(uri)) {
                    return `<img src="${uri}" class="autoImage" onclick="open_img('${uri}')" />`;
                } else if (TistoryImage.test(uri)) {
                    return `<img src="${uri}" class="autoImage" onclick="open_img('${uri}')" />`;
                } else if (videoType.test(uri)) {
                    return `<video autoplay muted loop playsinline src="${uri}"></video>`;
                } else if (audioType.test(uri)) {
                    return `<audio controls src="${uri}"></audio>`;
                } else if (youtubeLink.test(uri)) {
                    return `<div class="youtubevid-wrapper"><div class="resvid"><iframe src="https://www.youtube.com/embed/${uri.replace(
                        youtubeLink,
                        ""
                    )}?rel=0&playsinline=1" frameborder="0" allowfullscreen></iframe></div></div>`;
                } else {
                    return `<a href="${uri}" target="_blank" class="autoLink">${uri}</a>`;
                }
            });
        };

        document.querySelectorAll(selector).forEach((element) => {
            if (!element.classList.contains("modded")) {
                element.innerHTML = mod(element.innerHTML);
                element.classList.add("modded");
            }
        });
    };

    document.addEventListener(
        "DOMContentLoaded",
        wrapping().then(() => {
            // 수정, 삭제, 이전 댓글 불러오기 등 변화 감지
            const container = document.getElementById(containerId);
            const observer = new MutationObserver(wrapping);

            observer.observe(container, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        })
    );
};
