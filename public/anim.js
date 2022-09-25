let isModalOpen = false
let contrastToggle = true


function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modall--open");
  }
  isModalOpen = true;
  document.body.classList += " modall--open";
}

function toggleContrast() {
  contrastToggle != contrastToggle;
  if (contrastToggle) {
    document.body.classList += " dark-theme"
  }
  else {
    document.body.classList.remove("dark-theme")
  }
}

function contact(event) {
  event.preventDefault()
  const loading = document.querySelector(".modall__overlay--loading")
  const success = document.querySelector(".modall__overlay--success")
  loading.classList += " modall__overlay--visible"
    .then(() => {
      loading.classList.remove("modall__overlay--visible")
      success.classList += " modall__overlay--visible"
    })
    .catch(() => {
      loading.classList.remove("modall__overlay--visible")
      alert(
        "The email service is temporarily unavailable. Please contact me directly on email@email.com"
      )
    })
}