const autoWrap = (containerId, selector) => {
    const wrapping = async () => {
        const link = /(\b(https?|ftp|file):\/\/[-A-Z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|+&@#\/%?=~_|!:,.;]*[-A-Z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|+&@#\/%=~_|])/gi; // 링크 찾기
        const mail = /((\S+.)@[a-z]+.[a-z]+)/gi;
        const imageType = /\.(?:jpe?g(:(large|orig))?|gif|png(:(large|orig))?|svg)$/i; // 이미지
        const TistoryImage = /(?:\?original)$/i; // 티스토리 ?original 이미지
        const videoType = /\.(?:mp4|webm)$/i; // 비디오
        const audioType = /\.(?:mp3|ogg|wav)$/i; // 오디오
        const youtubeLink = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?/g; // 유튜브 비디오
        const createAnchor = (string, type = "link") => {
            const anchor = document.createElement("a");

            anchor.href = type === "link" ? string : `mailto:${string}`;
            type === "link" &&
                ((anchor.target = "_blank"),
                anchor.setAttribute("rel", "noopener, noreferer"));
            anchor.innerText = string;

            return anchor;
        };

        document.querySelectorAll(selector).forEach((comment) => {
            !comment.classList.contains("modded") &&
                comment.hasChildNodes &&
                [...comment.childNodes].forEach((text) => {
                    if (text.nodeType === 3) {
                        let textArray = text.textContent.split(link);
                        if (textArray.length === 1)
                            textArray = text.textContent.split(mail);
                        if (textArray.length === 1) return;
                        const fragment = document.createDocumentFragment();

                        for (
                            let i = 0, length = textArray.length, j = 1;
                            i < length;
                            i++
                        ) {
                            if (j % 3 !== 0) {
                                const string = textArray[i];
                                if (j % 2 === 0) {
                                    if (string.includes("http:")) {
                                        const anchor = createAnchor(string);

                                        fragment.append(anchor);
                                    } else {
                                        if (
                                            imageType.test(string) ||
                                            TistoryImage.test(string)
                                        ) {
                                            const img = document.createElement(
                                                "img"
                                            );

                                            img.src = string;
                                            img.alt = "userContent";

                                            fragment.append(img);
                                        } else if (videoType.test(string)) {
                                            const video = document.createElement(
                                                "video"
                                            );

                                            video.src = string;
                                            video.autoplay = 1;
                                            video.muted = 1;
                                            video.loop = 1;
                                            video.setAttribute(
                                                "playsinline",
                                                1
                                            );

                                            fragment.append(video);
                                        } else if (audioType.test(string)) {
                                            const audio = document.createElement(
                                                "audio"
                                            );

                                            audio.src = string;
                                            audio.controls = 1;

                                            fragment.append(audio);
                                        } else if (youtubeLink.test(string)) {
                                            const wrapper = document.createElement(
                                                "div"
                                            );
                                            const div = document.createElement(
                                                "div"
                                            );
                                            const iframe = document.createElement(
                                                "iframe"
                                            );

                                            wrapper.className =
                                                "youtubevid-wrapper";
                                            div.className = "resvid";

                                            iframe.src = `https://www.youtube.com/embed/${string.replace(
                                                youtubeLink,
                                                ""
                                            )}?rel=0&playsinline=1`;
                                            iframe.allowFullscreen = 1;
                                            iframe.frameBorder = 0;

                                            div.append(iframe);
                                            wrapper.append(div);
                                            fragment.append(wrapper);
                                        } else if (mail.test(string)) {
                                            const anchor = createAnchor(
                                                string,
                                                "mail"
                                            );

                                            fragment.append(anchor);
                                        } else {
                                            const anchor = createAnchor(string);

                                            fragment.append(anchor);
                                        }
                                    }
                                } else {
                                    const textNode = document.createTextNode(
                                        string
                                    );

                                    fragment.append(textNode);
                                }

                                j += 1;
                            } else {
                                j = 1;
                            }
                        }

                        text.parentNode.insertBefore(fragment, text);
                        text.remove();
                    }

                    comment.classList.add("modded");
                });
        });
    };

    document.addEventListener(
        "DOMContentLoaded",
        wrapping().then(() => {
            // 수정, 삭제, 이전 댓글 불러오기 등 변화 감지
            const container = document.getElementById(containerId);
            const observer = new MutationObserver(wrapping);

            container &&
                observer.observe(container, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                });
        })
    );
};
