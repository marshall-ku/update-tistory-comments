document.getElementById("fileUpload") && document.getElementById("fileUpload").addEventListener("change", (e) => {
    e.preventDefault();

    const input = document.getElementById("fileUpload");
    const data = new FormData();
    data.append("uploadedfile", input.files[0]);

    fetch("https://www.tistory.com/apis/post/attach?access_token={access-token}&blogName={blog-name}", {
            method: "POST",
            body: data
        })
        .then(response => {
            return response.text();
        })
        .then(response => {
            const parser = new window.DOMParser().parseFromString(response, "text/xml");

            if (parser.querySelector("url")) {
                const url = parser.querySelector("url").innerHTML;
                const fileId = url.slice(url.lastIndexOf("/") + 1, url.length - 4);
                const newUrl = `https://t1.daumcdn.net/cfile/tistory/${fileId}?original`;
                // https 주소로 이미지 주소 변경

                const commentTextarea = document.getElementById("commentTextarea"); // 본인 상황에 맞게 수정

                commentTextarea.value = `${
                        commentTextarea.value === ""
                            ? newUrl
                            : `${commentTextarea.value}\n${newUrl}`
                    }`
            }
            // 댓글 입력란에 쓴 내용이 없으면 입력란의 내용을 이미지 주소로 수정, 쓴 내용이 있으면 엔터 한 번 후 이미지 주소 입력
        });
});
