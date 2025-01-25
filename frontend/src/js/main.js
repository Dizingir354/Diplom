document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('header');
    fetch('Header.html')
        .then(response => response.text())
        .then(data => {
            header.innerHTML = data;
        });

    const mainContent = document.getElementById('main-content');
    const currentPage = window.location.pathname.split("/").pop();
    fetch(currentPage)
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;
        });
});
