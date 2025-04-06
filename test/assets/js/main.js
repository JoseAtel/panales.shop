document.addEventListener("DOMContentLoaded", () => {
  // Variables
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mainNav = document.querySelector(".main-nav")
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  const cartCountElement = document.getElementById("cartCount")
  const quantityBtns = document.querySelectorAll(".quantity-btn")
  const newsletterForm = document.getElementById("newsletterForm")
  const filterSelects = document.querySelectorAll(".filter-select")
  const applyFiltersBtn = document.getElementById("apply-filters")
  const paginationNumbers = document.querySelectorAll(".pagination-number")
  const paginationBtns = document.querySelectorAll(".pagination-btn")
  const thumbnails = document.querySelectorAll(".thumbnail")

  // Inicializar carrito
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  updateCartCount()

  // Menú móvil
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active")

      // Animar las barras del menú
      const spans = this.querySelectorAll("span")
      if (mainNav.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })
  }

  // Agregar al carrito
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.id
        const productTitle = this.dataset.title
        const productPrice = Number.parseFloat(this.dataset.price)
        const productImage = this.dataset.image
        const quantity = document.getElementById("quantity")
          ? Number.parseInt(document.getElementById("quantity").value)
          : 1

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex((item) => item.id === productId)

        if (existingProductIndex !== -1) {
          // Actualizar cantidad si ya existe
          cart[existingProductIndex].quantity += quantity
        } else {
          // Agregar nuevo producto
          cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            image: productImage,
            quantity: quantity,
          })
        }

        // Guardar en localStorage y actualizar contador
        localStorage.setItem("cart", JSON.stringify(cart))
        updateCartCount()

        // Mostrar mensaje de confirmación
        showNotification("Producto agregado al carrito")
      })
    })
  }

  // Control de cantidad
  if (quantityBtns.length > 0) {
    quantityBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const input = document.getElementById("quantity")
        let value = Number.parseInt(input.value)
        const max = Number.parseInt(input.getAttribute("max"))

        if (this.classList.contains("minus") && value > 1) {
          value--
        } else if (this.classList.contains("plus") && value < max) {
          value++
        }

        input.value = value
      })
    })
  }

  // Formulario de newsletter
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector('input[type="email"]')

      if (emailInput.value.trim() !== "") {
        // Aquí iría la lógica para enviar el email al servidor
        showNotification("¡Gracias por suscribirte a nuestro boletín!")
        emailInput.value = ""
      }
    })
  }

  // Filtros de productos
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      // Recoger valores de los filtros
      const category = document.getElementById("category-filter").value
      const brand = document.getElementById("brand-filter").value
      const price = document.getElementById("price-filter").value
      const sort = document.getElementById("sort-filter").value

      // Aquí iría la lógica para filtrar productos
      // Por ahora solo mostramos una notificación
      showNotification("Filtros aplicados")
    })
  }

  // Paginación
  if (paginationNumbers.length > 0) {
    paginationNumbers.forEach((number) => {
      number.addEventListener("click", function () {
        // Quitar clase activa de todos los números
        paginationNumbers.forEach((num) => num.classList.remove("active"))

        // Agregar clase activa al número clickeado
        this.classList.add("active")

        // Habilitar/deshabilitar botones de anterior/siguiente
        if (this.textContent === "1") {
          document.querySelector(".pagination-btn.prev").disabled = true
        } else {
          document.querySelector(".pagination-btn.prev").disabled = false
        }

        if (this.textContent === "10") {
          document.querySelector(".pagination-btn.next").disabled = true
        } else {
          document.querySelector(".pagination-btn.next").disabled = false
        }
      })
    })
  }

  // Botones de paginación
  if (paginationBtns.length > 0) {
    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (this.disabled) return

        const activeNumber = document.querySelector(".pagination-number.active")
        const activeIndex = Array.from(paginationNumbers).indexOf(activeNumber)

        if (this.classList.contains("prev") && activeIndex > 0) {
          paginationNumbers[activeIndex].classList.remove("active")
          paginationNumbers[activeIndex - 1].classList.add("active")

          if (activeIndex - 1 === 0) {
            document.querySelector(".pagination-btn.prev").disabled = true
          }

          document.querySelector(".pagination-btn.next").disabled = false
        } else if (this.classList.contains("next") && activeIndex < paginationNumbers.length - 1) {
          paginationNumbers[activeIndex].classList.remove("active")
          paginationNumbers[activeIndex + 1].classList.add("active")

          if (activeIndex + 1 === paginationNumbers.length - 1) {
            document.querySelector(".pagination-btn.next").disabled = true
          }

          document.querySelector(".pagination-btn.prev").disabled = false
        }
      })
    })
  }

  // Miniaturas de imágenes
  if (thumbnails.length > 0) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        const mainImage = document.querySelector(".main-image img")
        mainImage.src = this.src
      })
    })
  }

  // Funciones auxiliares
  function updateCartCount() {
    if (cartCountElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      cartCountElement.textContent = totalItems
    }
  }

  function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    // Estilos para la notificación
    notification.style.position = "fixed"
    notification.style.bottom = "20px"
    notification.style.right = "20px"
    notification.style.backgroundColor = "var(--color-secondary)"
    notification.style.color = "white"
    notification.style.padding = "10px 20px"
    notification.style.borderRadius = "var(--border-radius-md)"
    notification.style.boxShadow = "var(--box-shadow)"
    notification.style.zIndex = "1000"
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"
    notification.style.transition = "opacity 0.3s, transform 0.3s"

    // Agregar al DOM
    document.body.appendChild(notification)

    // Mostrar con animación
    setTimeout(() => {
      notification.style.opacity = "1"
      notification.style.transform = "translateY(0)"
    }, 10)

    // Ocultar después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = "0"
      notification.style.transform = "translateY(20px)"

      // Eliminar del DOM después de la animación
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
})

