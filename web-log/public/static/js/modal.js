function modal(title, message, close) {
    const modal = document.getElementById("myModal");
    const closeBtn = document.getElementById("closeBtn");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    /* 设置模态框标题和内容 */
    modalTitle.innerHTML = title;
    modalBody.innerHTML = message;
    if (close) {
        closeBtn.style.display = "inline-block";
    } else {
        closeBtn.style.display = "none";
    }
    /* 显示模态框 */
    $(modal).modal({ show: true });
}
