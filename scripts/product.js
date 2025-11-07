// product.js (product detail page)

// Toggle ini saat sudah ada backend (contoh auto-fallback).
const USE_API = false; // set true saat backend ready

document.addEventListener("DOMContentLoaded", async () => {
  const id = parseInt(getParam("id"), 10);
  if (!id) {
    window.location.href = "index.html";
    return;
  }

  // data
  let product = null;

  if (USE_API) {
    try {
      // contoh endpoint: /api/products/:id (silakan sesuaikan)
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        product = await res.json();
      }
    } catch (e) {
      console.warn("API fetch failed, fallback to mock:", e);
    }
  }

  // fallback ke mock data
  if (!product) product = (window.allProducts || []).find((p) => p.id === id);

  if (!product) {
    alert("Produk tidak ditemukan.");
    window.location.href = "index.html";
    return;
  }

  renderProduct(product);
  setupConditionButtons();
  setupActionButtons();
});

function renderProduct(product) {
  // Info
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("originalPrice").textContent = formatPrice(product.originalPrice);
  document.getElementById("materialDetail").textContent = product.material;
  document.getElementById("conditionDetail").textContent = "Brand New";
  document.getElementById("categoryBreadcrumb").textContent = product.category.toUpperCase();
  document.getElementById("brandBreadcrumb").textContent = product.brand;

  // Gambar utama
  const firstImage = (product.images && product.images[0]) || product.image || PLACEHOLDER;
  const imgEl = document.getElementById("mainProductImage");
  imgEl.src = firstImage;
  imgEl.onerror = () => (imgEl.src = PLACEHOLDER);

  // Hot badge
  document.getElementById("hotBadge").style.display = product.isHot ? "block" : "none";

  // Sizes
  const sizeGrid = document.getElementById("sizeGrid");
  sizeGrid.innerHTML = "";
  (product.sizes || []).forEach((size) => {
    const b = document.createElement("button");
    b.className = "size-option";
    b.textContent = size;
    b.addEventListener("click", function () {
      document.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"));
      this.classList.add("selected");
    });
    sizeGrid.appendChild(b);
  });

  // Gallery/Carousel
  const gallery = product.images && product.images.length ? product.images : [firstImage];
  setupImageCarousel(gallery);
}

function setupImageCarousel(images) {
  let currentImageIndex = 0;
  const dotsContainer = document.getElementById("imageDots");
  dotsContainer.innerHTML = "";

  images.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentImageIndex = index;
      update();
    });
    dotsContainer.appendChild(dot);
  });

  function update() {
    const img = document.getElementById("mainProductImage");
    img.src = images[currentImageIndex] || PLACEHOLDER;
    img.onerror = () => (img.src = PLACEHOLDER);
    document.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("active", idx === currentImageIndex));
  }

  document.getElementById("prevBtn").onclick = () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    update();
  };
  document.getElementById("nextBtn").onclick = () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    update();
  };

  update();
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
