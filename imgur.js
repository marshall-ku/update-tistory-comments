function fileUploader(inputId, textareaId, apiKey) {
    const inputElem = document.getElementById(inputId);
    const textAreaElem = document.getElementById(textareaId);

    const uploadFile = (file) => {
        if (file) {
            if (file.size < 5000000) {
                const formData = new FormData();

                formData.append("image", file);

                fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        Authorization: `Client-ID ${apiKey}`,
                        Accept: "application/json",
                    },
                    body: formData,
                })
                    .then((response) => {
                        console.log(response);
                        return response.json();
                    })
                    .then((response) => {
                        comment.value = `${
                            textAreaElem.value === ""
                                ? response.data.link
                                : `${textAreaElem.value}\n${response.data.link}`
                        }`;
                    });
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const dt = e.dataTransfer;

        uploadFile(dt.files[0]);
    };

    const handleFileChange = () => {
        uploadFile(inputElem.files[0]);
    };

    const preventDefault = (e) => {
        e.preventDefault();
    };

    textAreaElem && (
        textAreaElem.addEventListener("dragenter", preventDefault),
        textAreaElem.addEventListener("dragleave", preventDefault, false),
        textAreaElem.addEventListener("dragover", preventDefault),
        textAreaElem.addEventListener("drop", handleDrop)
    ),
    inputElem && inputElem.addEventListener("change", handleFileChange);
}
