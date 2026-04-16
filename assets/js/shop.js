const productCards = document.querySelectorAll(".js-product-card");

const productModal = document.getElementById("productModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductTag = document.getElementById("modalProductTag");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductFeatures = document.getElementById("modalProductFeatures");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductQty = document.getElementById("modalProductQty");
const addToCartFromModal = document.getElementById("addToCartFromModal");

const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");
const goCheckoutBtn = document.getElementById("goCheckoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const deliveryType = document.getElementById("deliveryType");
const shippingFields = document.getElementById("shippingFields");
const pickupFields = document.getElementById("pickupFields");
const fakeYapeBtn = document.getElementById("fakeYapeBtn");

let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("zancudosfc_cart")) || [];

function formatPrice(value) {
  return `S/ ${Number(value).toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("zancudosfc_cart", JSON.stringify(cart));
}

function updateCartCount() {
  if (!cartCount) return;
  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalUnits;
}

function renderCart() {
  if (!cartItems || !cartSubtotal) return;

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart">Tu carrito está vacío.</div>`;
    cartSubtotal.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p>Cantidad: ${item.quantity}</p>
            <p>${formatPrice(item.price)} c/u</p>
          </div>
          <button type="button" onclick="removeCartItem('${item.id}')">Quitar</button>
        </div>
      `
    )
    .join("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cartSubtotal.textContent = formatPrice(subtotal);
  updateCartCount();
}

function renderCheckoutResume() {
  if (!checkoutItems || !checkoutTotal) return;

  if (!cart.length) {
    checkoutItems.innerHTML = `<p>No hay productos en el carrito.</p>`;
    checkoutTotal.textContent = formatPrice(0);
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item-line">
          <span>${item.name} x ${item.quantity}</span>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  checkoutTotal.textContent = formatPrice(total);
}

function openProductModal(product) {
  if (!productModal) return;

  selectedProduct = product;

  if (modalProductImage) {
    modalProductImage.src = product.image;
    modalProductImage.alt = product.name;
  }

  if (modalProductTag) modalProductTag.textContent = product.tag;
  if (modalProductName) modalProductName.textContent = product.name;
  if (modalProductDescription) modalProductDescription.textContent = product.description;
  if (modalProductPrice) modalProductPrice.textContent = formatPrice(product.price);
  if (modalProductQty) modalProductQty.value = 1;

  if (modalProductFeatures) {
    modalProductFeatures.innerHTML = "";
    product.features.forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = feature;
      modalProductFeatures.appendChild(li);
    });
  }

  productModal.classList.add("active");
  document.body.classList.add("modal-open");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  if (!productModal) return;

  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");

  if (
    (!cartDrawer || !cartDrawer.classList.contains("active")) &&
    (!checkoutModal || !checkoutModal.classList.contains("active"))
  ) {
    document.body.classList.remove("modal-open");
  }
}

function openCart() {
  if (!cartDrawer) return;

  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCart() {
  if (!cartDrawer) return;

  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");

  if (
    (!productModal || !productModal.classList.contains("active")) &&
    (!checkoutModal || !checkoutModal.classList.contains("active"))
  ) {
    document.body.classList.remove("modal-open");
  }
}

function openCheckout() {
  if (!checkoutModal) return;

  if (!cart.length) {
    alert("Tu carrito está vacío.");
    return;
  }

  renderCheckoutResume();
  checkoutModal.classList.add("active");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCheckout() {
  if (!checkoutModal) return;

  checkoutModal.classList.remove("active");
  checkoutModal.setAttribute("aria-hidden", "true");

  if (
    (!productModal || !productModal.classList.contains("active")) &&
    (!cartDrawer || !cartDrawer.classList.contains("active"))
  ) {
    document.body.classList.remove("modal-open");
  }
}

function addToCart(product, quantity) {
  const qty = Number(quantity);

  if (!qty || qty < 1) return;

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: qty
    });
  }

  saveCart();
  renderCart();
  closeProductModal();
  openCart();
}

function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  renderCheckoutResume();
}

window.removeCartItem = removeCartItem;

productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      tag: card.dataset.tag,
      description: card.dataset.description,
      features: card.dataset.features.split("|")
    };

    openProductModal(product);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", closeProductModal);
});

document.querySelectorAll("[data-close-checkout]").forEach((btn) => {
  btn.addEventListener("click", closeCheckout);
});

if (qtyMinus && modalProductQty) {
  qtyMinus.addEventListener("click", () => {
    const current = Number(modalProductQty.value) || 1;
    if (current > 1) modalProductQty.value = current - 1;
  });
}

if (qtyPlus && modalProductQty) {
  qtyPlus.addEventListener("click", () => {
    const current = Number(modalProductQty.value) || 1;
    modalProductQty.value = current + 1;
  });
}

if (addToCartFromModal && modalProductQty) {
  addToCartFromModal.addEventListener("click", () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, modalProductQty.value);
  });
}

if (openCartBtn) openCartBtn.addEventListener("click", openCart);
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

if (goCheckoutBtn) {
  goCheckoutBtn.addEventListener("click", () => {
    closeCart();
    openCheckout();
  });
}

if (deliveryType) {
  deliveryType.addEventListener("change", (e) => {
    const type = e.target.value;

    const department = document.getElementById("department");
    const province = document.getElementById("province");
    const district = document.getElementById("district");
    const address = document.getElementById("address");

    if (type === "envio") {
      if (shippingFields) shippingFields.style.display = "block";
      if (pickupFields) pickupFields.style.display = "none";

      if (department) department.required = true;
      if (province) province.required = true;
      if (district) district.required = true;
      if (address) address.required = true;
    } else {
      if (shippingFields) shippingFields.style.display = "none";
      if (pickupFields) pickupFields.style.display = "block";

      if (department) department.required = false;
      if (province) province.required = false;
      if (district) district.required = false;
      if (address) address.required = false;
    }
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert("No hay productos en el carrito.");
      return;
    }

    const orderData = {
      customer: {
        name: document.getElementById("customerName")?.value || "",
        email: document.getElementById("customerEmail")?.value || "",
        phone: document.getElementById("customerPhone")?.value || ""
      },
      deliveryType: document.getElementById("deliveryType")?.value || "",
      shipping: {
        department: document.getElementById("department")?.value || "",
        province: document.getElementById("province")?.value || "",
        district: document.getElementById("district")?.value || "",
        address: document.getElementById("address")?.value || ""
      },
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };

    console.log("Orden lista para enviar a Mercado Pago:", orderData);

    // AQUI CONECTARAS MERCADO PAGO LUEGO
    // Ejemplo futuro:
    // fetch('/crear-preferencia', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // }).then(...)

    alert("Formulario validado. Aquí conectarás Mercado Pago.");
  });
}

if (fakeYapeBtn) {
  fakeYapeBtn.addEventListener("click", () => {
    alert("Aquí luego conectas tu flujo de Yape.");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProductModal();
    closeCart();
    closeCheckout();
  }
});

renderCart();
renderCheckoutResume();
