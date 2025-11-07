const PLACEHOLDER = "/assets/placeholder.svg";

const products = [
  {
    id: 1,
    name: "Air Jordan 1 High Lost And Found",
    brand: "Air Jordan",
    category: "jordan",
    price: 2500000,
    originalPrice: 3200000,
    image: "assets/products/Air Jordan 1 High Lost And Found Men.jpg",
    material: "Leather",
    sizes: [40, 41, 42, 43, 44],
    isHot: true,
  },
  {
    id: 2,
    name: "Air Jordan 1 Low Panda WMNS",
    brand: "Air Jordan",
    category: "jordan",
    price: 1800000,
    originalPrice: 2200000,
    image: "assets/products/Air Jordan 1 Low Panda WMNS.jpg",
    material: "Leather",
    sizes: [36, 37, 38, 39, 40],
    isHot: false,
  },
  {
    id: 3,
    name: "Air Jordan 1 Low True Blue Navy",
    brand: "Air Jordan",
    category: "jordan",
    price: 1900000,
    originalPrice: 2300000,
    image: "assets/products/Air Jordan 1 Low True Blue Navy.jpg",
    material: "Leather",
    sizes: [38, 39, 40, 41, 42],
    isHot: false,
  },
  {
    id: 4,
    name: "Air Jordan 1 Low Wolf Grey WMNS",
    brand: "Air Jordan",
    category: "jordan",
    price: 2000000,
    originalPrice: 2500000,
    image: "assets/products/Air Jordan 1 Low Wolf Grey WMNS.jpg",
    material: "Leather",
    sizes: [36, 37, 38, 39, 40],
    isHot: true,
  },
  {
    id: 5,
    name: "Nike Dunk Low Black And White",
    brand: "Nike",
    category: "nike",
    price: 1200000,
    originalPrice: 1500000,
    image: "assets/products/Nike Dunk Low Black And White Men.jpg",
    material: "Leather",
    sizes: [39, 40, 41, 42, 43, 44],
    isHot: true,
  },
  {
    id: 6,
    name: "Nike Dunk Low Clear Jade",
    brand: "Nike",
    category: "nike",
    price: 1250000,
    originalPrice: 1600000,
    image: "assets/products/Nike Dunk Low Clear Jade.jpg",
    material: "Leather",
    sizes: [38, 39, 40, 41, 42],
    isHot: false,
  },
  {
    id: 7,
    name: "Nike Dunk Low Harvest Moon",
    brand: "Nike",
    category: "nike",
    price: 1300000,
    originalPrice: 1650000,
    image: "assets/products/Nike Dunk Low Harvest Moon.jpg",
    material: "Leather",
    sizes: [36, 37, 38, 39, 40],
    isHot: false,
  },
  {
    id: 8,
    name: "Nike Dunk Low Smoke Grey WMNS",
    brand: "Nike",
    category: "nike",
    price: 1350000,
    originalPrice: 1700000,
    image: "assets/products/Nike Dunk Low Smoke Grey WMNS.jpg",
    material: "Leather",
    sizes: [37, 38, 39, 40, 41],
    isHot: true,
  },
  {
    id: 9,
    name: "Yeezy Slide Slate Grey",
    brand: "Yeezy",
    category: "yeezy",
    price: 900000,
    originalPrice: 1200000,
    image: "assets/products/Yeezy Slide Slate Grey.jpg",
    material: "EVA Foam",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    isHot: true,
  },
];

const additionalProducts = [
  {
    id: 10,
    name: "Adidas Samba OG Cloud White",
    brand: "Adidas",
    category: "adidas",
    price: 1100000,
    originalPrice: 1450000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nike%20Dunk%20Low%20Black%20And%20White%20Men-WVq6AxLA0fnUHUM6XCskmdhnUiCzyX.jpg",
    material: "Leather",
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    isHot: false,
  },
];

const allProducts = [...products, ...additionalProducts];
let currentFilter = "all";
let currentProductId = null;

// ---- Utils ----
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function hideSplash() {
  const s = document.getElementById("splash");
  if (s) s.classList.add("hidden");
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  setupBackButton();
  setupActionButtons();
  setupConditionButtons();

  // Tutup splash setelah rendering awal
  setTimeout(hideSplash, 300);
});

// ---- Event Listeners ----
function setupEventListeners() {
  // Category filter
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      renderProducts();
    });
  });

  // Logo click → back to home
    const logo = document.querySelector(".logo");
    const brand = document.querySelector(".brand-name");

    if (logo) logo.addEventListener("click", () => switchPage("homePage"));
    if (brand) brand.addEventListener("click", () => switchPage("homePage"));

  // Search
  const searchEl = document.getElementById("searchInput");
  if (searchEl) {
    searchEl.addEventListener("input", (e) => filterBySearch(e.target.value));
  }

  // Auth buttons
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  if (loginBtn && loginModal) loginBtn.addEventListener("click", () => loginModal.classList.add("active"));
  if (registerBtn && registerModal) registerBtn.addEventListener("click", () => registerModal.classList.add("active"));

  const closeLogin = document.getElementById("closeLoginModal");
  const closeRegister = document.getElementById("closeRegisterModal");
  if (closeLogin) closeLogin.addEventListener("click", () => loginModal.classList.remove("active"));
  if (closeRegister) closeRegister.addEventListener("click", () => registerModal.classList.remove("active"));

  // Modal forms
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (loginForm)
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Login berhasil! Terima kasih telah menggunakan Autocuan Supply.");
      loginModal.classList.remove("active");
    });
  if (registerForm)
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registrasi berhasil! Silakan login untuk melanjutkan.");
      registerModal.classList.remove("active");
    });

  // Close modals on outside click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("active");
    });
  });
}

function setupBackButton() {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", () => switchPage("homePage"));
}

function setupActionButtons() {
  const addToCartBtn = document.querySelector(".btn-add-cart");
  const buyNowBtn = document.querySelector(".btn-checkout");
  if (addToCartBtn) addToCartBtn.addEventListener("click", () => alert("✓ Produk telah ditambahkan ke keranjang!"));
  if (buyNowBtn) buyNowBtn.addEventListener("click", () => alert("Terima kasih! Anda akan diarahkan ke halaman checkout."));
}

function setupConditionButtons() {
  document.querySelectorAll(".condition-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".condition-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const condEl = document.getElementById("conditionDetail");
      if (condEl) condEl.textContent = this.textContent;
    });
  });
}

// ---- Render Grid ----
function renderProducts() {
  const filteredProducts = currentFilter === "all" ? allProducts : allProducts.filter((p) => p.category === currentFilter);

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-view">View Details</button>
      </div>
    `;
    card.addEventListener("click", () => showProductDetail(product.id));
    grid.appendChild(card);
  });
}

// ---- Search ----
function filterBySearch(searchTerm) {
  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #B0B0B0; padding: 2rem;">Produk tidak ditemukan</p>';
    return;
    }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="btn-view">View Details</button>
      </div>
    `;
    card.addEventListener("click", () => showProductDetail(product.id));
    grid.appendChild(card);
  });
}

// ---- Detail Page ----
function showProductDetail(productId) {
  currentProductId = productId;
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  // Info
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("originalPrice").textContent = formatPrice(product.originalPrice);
  document.getElementById("materialDetail").textContent = product.material;
  document.getElementById("conditionDetail").textContent = "Brand New";
  document.getElementById("categoryBreadcrumb").textContent = product.category.toUpperCase();
  document.getElementById("brandBreadcrumb").textContent = product.brand;

  // Gambar utama + fallback
  const firstImage = (product.images && product.images[0]) || product.image || PLACEHOLDER;
  const imgEl = document.getElementById("mainProductImage");
  imgEl.src = firstImage;
  imgEl.onerror = () => (imgEl.src = PLACEHOLDER);

  // Hot badge
  document.getElementById("hotBadge").style.display = product.isHot ? "block" : "none";

  // Sizes
  const sizeGrid = document.getElementById("sizeGrid");
  sizeGrid.innerHTML = "";
  product.sizes.forEach((size) => {
    const sizeBtn = document.createElement("button");
    sizeBtn.className = "size-option";
    sizeBtn.textContent = size;
    sizeBtn.addEventListener("click", function () {
      document.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"));
      this.classList.add("selected");
    });
    sizeGrid.appendChild(sizeBtn);
  });

  // Carousel (pakai product.images jika ada)
  const gallery = product.images && product.images.length ? product.images : [firstImage];
  setupImageCarousel(gallery);

  // Switch page
  switchPage("productPage");
}

// ---- Carousel ----
function setupImageCarousel(images) {
  let currentImageIndex = 0;

  const dotsContainer = document.getElementById("imageDots");
  dotsContainer.innerHTML = "";

  images.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentImageIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  function updateCarousel() {
    const img = document.getElementById("mainProductImage");
    img.src = images[currentImageIndex] || PLACEHOLDER;
    img.onerror = () => (img.src = PLACEHOLDER);
    document.querySelectorAll(".dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentImageIndex);
    });
  }

  document.getElementById("prevBtn").onclick = () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel();
  };

  document.getElementById("nextBtn").onclick = () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel();
  };

  updateCarousel();
}

// ---- Switch Pages ----
function switchPage(pageName) {
  document.querySelectorAll(".page-view").forEach((page) => page.classList.remove("active"));
  document.getElementById(pageName).classList.add("active");
  window.scrollTo(0, 0);
}