// main.js (index page)
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  // splash close halus
  setTimeout(hideSplash, 300);
});

function setupEventListeners() {
  // kategori
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      renderProducts();
    });
  });

  // search
  const searchEl = document.getElementById("searchInput");
  if (searchEl) {
    searchEl.addEventListener("input", (e) => filterBySearch(e.target.value));
  }

  // auth modal
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeLogin = document.getElementById("closeLoginModal");
  const closeRegister = document.getElementById("closeRegisterModal");

  if (loginBtn && loginModal) loginBtn.addEventListener("click", () => loginModal.classList.add("active"));
  if (registerBtn && registerModal) registerBtn.addEventListener("click", () => registerModal.classList.add("active"));
  if (closeLogin) closeLogin.addEventListener("click", () => loginModal.classList.remove("active"));
  if (closeRegister) closeRegister.addEventListener("click", () => registerModal.classList.remove("active"));

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("active");
    });
  });
}

function renderProducts() {
  const filtered = currentFilter === "all" ? allProducts : allProducts.filter((p) => p.category === currentFilter);
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  filtered.forEach((product) => {
    const card = document.createElement("a");
    card.href = `product.html?id=${product.id}`;
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-view" type="button">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterBySearch(term) {
  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.brand.toLowerCase().includes(term.toLowerCase())
  );

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #B0B0B0; padding: 2rem;">Produk tidak ditemukan</p>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("a");
    card.href = `product.html?id=${product.id}`;
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-view" type="button">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  });
}
