const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("modal-close");
const modalInner = document.getElementById("modal-inner");

function openModal(templateId) {
  const template = document.getElementById(templateId);
  if (template) {
    const content = template.content.cloneNode(true);
    modalInner.innerHTML = ""; // очищаем перед вставкой
    modalInner.appendChild(content);
    modal.classList.add("show");
    modal.classList.remove("closing");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("closing");
  setTimeout(() => {
    modalInner.innerHTML = "";
  }, 300);
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);

// навешиваем всем, у кого есть data-template
document.querySelectorAll("[data-template]").forEach(el => {
  el.addEventListener("click", () => {
    openModal(el.dataset.template);
  });
});
