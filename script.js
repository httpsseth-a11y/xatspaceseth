document.querySelectorAll(".lightning-text").forEach(text => {
  text.addEventListener("click", () => {
    text.classList.toggle("font-changed");
  });
});

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", (e) => {
    const customUrl = card.getAttribute("data-url");
    if (customUrl) {
      window.open(customUrl, "_blank");
      return;
    }
    const onStorePage = /xatspace\.html$/i.test(window.location.pathname);
    if (onStorePage) {
      window.open("https://xat.me/SMuhaEmmadTH", "_blank");
      return;
    }
    const clickedLink = e.target.closest(".xatspace-link");
    if (clickedLink && clickedLink.href) {
      window.open(clickedLink.href, "_blank");
      return;
    }
    alert("Entre em contato para comprar este Xatspace!");
  });
});

// QR Code Modal
const qrModal = document.createElement("div");
qrModal.className = "qr-modal";
qrModal.innerHTML = `
  <div class="qr-modal-content">
    <h2>⚡ Pagos en Satoshis</h2>
    <img src="https://i.ibb.co/rfpjP16W/image.png" alt="QR Code Lightning" class="qr-modal-image">
    <p class="qr-modal-text">Escanea el código QR ⚡</p>
    <button class="qr-close-btn">Cerrar</button>
  </div>
`;
document.body.appendChild(qrModal);

document.querySelectorAll(".qr-container").forEach(qrContainer => {
  qrContainer.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    qrModal.classList.add("active");
  });
});

const qrModalContent = qrModal.querySelector(".qr-modal-content");
if (qrModalContent) {
  qrModalContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

document.querySelector(".qr-close-btn").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  qrModal.classList.remove("active");
});

qrModal.addEventListener("click", (e) => {
  if (e.target === qrModal) {
    qrModal.classList.remove("active");
  }
});


