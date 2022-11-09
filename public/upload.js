document.getElementById("uploadImage").onclick = function() {
    let xhttp = new XMLHttpRequest();
    const imageStatus = document.getElementById("imageStatus");
    const selectedImage = document.getElementById("selectedImage")
    const progressDiv = document.getElementById("progressDiv");
    const progressBar = document.getElementById("progressBar");

    xhttp.onreadystatechange = function() {
        imageStatus.innerHTML = this.responseText;
        if (this.status == 200) {
            selectedImage.value = "";
        }
    }
    xhttp.open("POST", "/dashboard/uploadImage");
    xhttp.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            let result = Math.floor(e.loaded / e.total * 100);
            if (result == 100) {
                progressDiv.style = "display: none";
            }
            progressBar.innerHTML = result + "%"
            progressBar.style = `width: ${result}%`;
        }

    }
    let formData = new FormData();
    if (selectedImage.files.length > 0) {
        progressDiv.style = "display: block";
        formData.append("image", selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
    }
}