// product.js (product detail page) — dengan Virtual Lab (zoom, pan, rotate, UV, flashlight)
// If window.API_BASE is set (e.g. http://localhost:3000), the frontend will request product data from the backend.

let zoom = 1;
let angle = 0;
let uvOn = false;
let flashOn = false;
let isPanning = false;
let pan = { x: 0, y: 0 };
let panStart = { x: 0, y: 0 };

document.addEventListener("DOMContentLoaded", async () => {
  const id = parseInt(getParam("id"), 10);
  if (!id) { window.location.href = "index.html"; return; }

  let product = null;

  const apiBase = (window && window.API_BASE) ? String(window.API_BASE).replace(/\/$/, '') : null;
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/api/products/${id}`);
      if (res.ok) product = await res.json();
    } catch (e) { console.warn("API fetch fail; using mock:", e); }
  }
  if (!product) product = (window.allProducts || []).find((p) => p.id === id);

  if (!product) {
    alert("Produk tidak ditemukan.");
    window.location.href = "index.html";
    return;
  }

  renderProduct(product);
  setupConditionButtons();
  setupActionButtons(product);
  updateCartIndicator();
  setupLabControls();
});

function renderProduct(product) {
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("originalPrice").textContent = formatPrice(product.originalPrice);
  document.getElementById("materialDetail").textContent = product.material;
  document.getElementById("conditionDetail").textContent = "Brand New";
  document.getElementById("categoryBreadcrumb").textContent = product.category.toUpperCase();
  document.getElementById("brandBreadcrumb").textContent = product.brand;

  const firstImage = (product.images && product.images[0]) || product.image || PLACEHOLDER;
  const imgEl = document.getElementById("mainProductImage");
  imgEl.src = firstImage;
  imgEl.onerror = () => (imgEl.src = PLACEHOLDER);

  document.getElementById("hotBadge").style.display = product.isHot ? "block" : "none";

  const sizeGrid = document.getElementById("sizeGrid");
  sizeGrid.innerHTML = "";
  (product.sizes || []).forEach((s) => {
    const b = document.createElement("button");
    b.className = "size-option"; b.textContent = s;
    b.addEventListener("click", function () {
      document.querySelectorAll(".size-option").forEach((x)=>x.classList.remove("selected"));
      this.classList.add("selected");
      // enable add-to-cart when a size is selected
      try { updateAddButtonState(); } catch(e){}
    });
    sizeGrid.appendChild(b);
  });

  const gallery = product.images && product.images.length ? product.images : [firstImage];
  setupImageCarousel(gallery);
  resetLab(); // init transform
}

// enable/disable Add to Cart based on whether a size was selected (if sizes exist)
function updateAddButtonState(){
  try {
    const addBtn = document.querySelector('.btn-add-cart');
    if (!addBtn) return;
    const sizeOptions = document.querySelectorAll('.size-option');
    const condSelected = !!document.querySelector('.condition-btn.active');
    if (!sizeOptions || sizeOptions.length === 0) {
      // if no sizes, require condition selection only
      addBtn.disabled = !condSelected;
      addBtn.classList.toggle('disabled', !condSelected);
      return;
    }
    const selected = document.querySelector('.size-option.selected');
    const shouldEnable = !!selected && condSelected;
    addBtn.disabled = !shouldEnable;
    addBtn.classList.toggle('disabled', !shouldEnable);
  } catch (e) { /* ignore */ }
}

/* ==== Carousel ==== */
function setupImageCarousel(images) {
  let current = 0;
  const dots = document.getElementById("imageDots");
  dots.innerHTML = "";

  images.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = `dot ${i===0 ? "active" : ""}`;
    d.onclick = () => { current = i; update(); resetLab(); };
    dots.appendChild(d);
  });

  function update(){
    const img = document.getElementById("mainProductImage");
    img.src = images[current] || PLACEHOLDER;
    img.onerror = () => (img.src = PLACEHOLDER);
    document.querySelectorAll(".dot").forEach((dot, idx) => dot.classList.toggle("active", idx===current));
  }

  document.getElementById("prevBtn").onclick = () => { current=(current-1+images.length)%images.length; update(); resetLab(); };
  document.getElementById("nextBtn").onclick = () => { current=(current+1)%images.length; update(); resetLab(); };
  update();
}

/* ==== Action & Condition ==== */
function setupActionButtons(product) {
  const addToCartBtn = document.querySelector(".btn-add-cart");
  const buyNowBtn = document.querySelector(".btn-checkout");
  // initialize add button state (disabled if sizes exist and none selected)
  try { updateAddButtonState(); } catch(e){}
  if (addToCartBtn) addToCartBtn.addEventListener("click", () => {
    try {
      // collect selected size and condition from UI
      const sizeEl = document.querySelector('.size-option.selected');
      const condEl = document.querySelector('.condition-btn.active');
      const selectedSize = sizeEl ? sizeEl.textContent.trim() : null;
      const selectedCondition = condEl ? condEl.textContent.trim() : 'Brand New';
      // if sizes exist but none selected, or condition not selected, prevent adding
      const sizeOptions = document.querySelectorAll('.size-option');
      const condSelected = !!condEl;
      if ((sizeOptions && sizeOptions.length > 0 && !selectedSize) || !condSelected) {
        if (!selectedSize && !condSelected) showToast('Pilih ukuran & kondisi terlebih dahulu');
        else if (!selectedSize) showToast('Pilih ukuran terlebih dahulu');
        else showToast('Pilih kondisi produk terlebih dahulu');
        // small attention animation
        try { document.getElementById('sizeGrid').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 220 }); } catch(e){}
        return;
      }
      addToCart(product.id, 1, { size: selectedSize, condition: selectedCondition });
      showToast(`✓ ${product.name.split(" ").slice(0,3).join(" ")} ditambahkan ke keranjang`);
      try { updateCartIndicator(); } catch(e){}
      // small visual feedback on button
      addToCartBtn.classList.add("added");
      setTimeout(()=> addToCartBtn.classList.remove("added"), 700);
    } catch (e) {
      console.warn("add to cart failed", e);
      alert("Gagal menambahkan ke keranjang");
    }
  });
  if (buyNowBtn) buyNowBtn.addEventListener("click", () => alert("Terima kasih! Anda akan diarahkan ke halaman checkout."));
}

// use shared updateCartIndicator from utils.js
function setupConditionButtons() {
  document.querySelectorAll(".condition-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".condition-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const el = document.getElementById("conditionDetail");
      if (el) el.textContent = this.textContent;
    });
  });
}

/* ==== Virtual Lab Controls ==== */
function setupLabControls(){
  const img = document.getElementById("mainProductImage");
  const stage = document.getElementById("imageDisplay");
  const flashlight = document.getElementById("flashlight");

  // zoom buttons
  document.getElementById("zoomInBtn").onclick = () => { zoom = clamp(zoom + 0.2, 1, 4); applyTransform(img); };
  document.getElementById("zoomOutBtn").onclick = () => { zoom = clamp(zoom - 0.2, 1, 4); applyTransform(img); };

  // rotate
  document.getElementById("rotateBtn").onclick = () => { angle = (angle + 15) % 360; applyTransform(img); };

  // UV filter
  document.getElementById("uvBtn").onclick = () => {
    uvOn = !uvOn;
    img.style.filter = uvOn ? "hue-rotate(180deg) saturate(1.4) contrast(1.15)" : "none";
  };

  // flashlight
  document.getElementById("flashBtn").onclick = () => {
    flashOn = !flashOn;
    flashlight.classList.toggle("active", flashOn);
  };
  stage.addEventListener("mousemove", (e) => {
    if (!flashOn) return;
    const rect = stage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    flashlight.style.setProperty("--mx", `${x}%`);
    flashlight.style.setProperty("--my", `${y}%`);
  });

  // wheel zoom
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    zoom = clamp(zoom + delta, 1, 4);
    applyTransform(img);
  }, { passive:false });

  // pan (drag image)
  stage.addEventListener("pointerdown", (e) => {
    isPanning = true;
    panStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    stage.setPointerCapture(e.pointerId);
    stage.style.cursor = "grabbing";
  });
  stage.addEventListener("pointermove", (e) => {
    if (!isPanning) return;
    pan.x = e.clientX - panStart.x;
    pan.y = e.clientY - panStart.y;
    applyTransform(img);
  });
  stage.addEventListener("pointerup", (e) => {
    isPanning = false;
    stage.releasePointerCapture(e.pointerId);
    stage.style.cursor = "default";
  });

  // reset
  document.getElementById("resetLabBtn").onclick = resetLab;
}

function applyTransform(img){
  img.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${angle}deg)`;
}
function resetLab(){
  zoom = 1; angle = 0; pan = {x:0,y:0}; uvOn = false; flashOn = false;
  const img = document.getElementById("mainProductImage");
  const flashlight = document.getElementById("flashlight");
  img.style.filter = "none";
  flashlight.classList.remove("active");
  applyTransform(img);
}

/* utils kecil */
function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
