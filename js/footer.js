// footer.js
document.addEventListener("DOMContentLoaded", function () {
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      const footerContainer = document.createElement("div");
      footerContainer.innerHTML = data;
      document.body.appendChild(footerContainer);
    })
    .catch(error => console.error("Footer load failed:", error));
});
