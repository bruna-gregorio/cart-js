const Aside = {
  open() {
    document.querySelector("aside").classList.add("open")
  },
  close() {
    document.querySelector("aside").classList.remove("open")
  }
}

const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active")
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active")
  }
}
