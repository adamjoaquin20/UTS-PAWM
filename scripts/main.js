// main.js (index page) — dengan Drag & Drop Dock
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  setupDockDroppables();
  renderDockFromState();
  // update shared cart indicator if present in DOM
  try { updateCartIndicator(); } catch (e) {}
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
  if (searchEl) searchEl.addEventListener("input", (e) => filterBySearch(e.target.value));

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

  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", function (e) { if (e.target === this) this.classList.remove("active"); });
  });
}

/* ===== Render + DnD ===== */
function renderProducts(list = allProducts) {
  const filtered = currentFilter === "all" ? list : list.filter((p) => p.category === currentFilter);
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card draggable";
    card.setAttribute("draggable", "true");
    card.dataset.id = product.id;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      <div class="product-body">
        <div class="product-brand">${product.brand}</div>
        <a href="product.html?id=${product.id}" class="product-name" style="text-decoration:none;">${product.name}</a>
        <div class="product-price">${formatPrice(product.price)}</div>
        <a class="btn-view" href="product.html?id=${product.id}">View Details</a>
      </div>
    `;

    // DnD
    card.addEventListener("dragstart", (e) => {
      card.classList.add("dragging");
      try {
        // allow move/copy semantics and store product id
        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData("text/plain", String(product.id));
        // use a clone so the drag image matches the card visually
        const dragImg = card.cloneNode(true);
        dragImg.style.width = `${card.offsetWidth}px`;
        dragImg.style.boxSizing = "border-box";
        dragImg.style.pointerEvents = "none";
        document.body.appendChild(dragImg);
        e.dataTransfer.setDragImage(dragImg, 10, 10);
        // remove the temporary image shortly after drag starts
        setTimeout(() => document.body.removeChild(dragImg), 0);
      } catch (err) {
        // some platforms (mobile browsers) may not support DataTransfer fully
        console.warn("dragstart dataTransfer issue", err);
      }
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    grid.appendChild(card);
  });
}

function filterBySearch(term) {
  const filtered = allProducts.filter(
    (p) => p.name.toLowerCase().includes(term.toLowerCase()) || p.brand.toLowerCase().includes(term.toLowerCase())
  );
  renderProducts(filtered);

  const grid = document.getElementById("productGrid");
  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #B0B0B0; padding: 2rem;">Produk tidak ditemukan</p>';
  }
}

/* ===== Dock state ===== */
// Using shared getCart/setCart/getCompare/setCompare defined in utils.js

function setupDockDroppables(){
  const cartDock = document.getElementById("cartDock");
  const compareTray = document.getElementById("compareTray");
  [cartDock, compareTray].forEach((zone) => {
    if (!zone) return;
    zone.addEventListener("dragover", (e) => { 
      e.preventDefault(); 
      // indicate we accept the drop
      try { e.dataTransfer.dropEffect = "move"; } catch(_) {}
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault(); zone.classList.remove("drag-over");
      let id = null;
      try { id = Number(e.dataTransfer.getData("text/plain")); } catch(_) { id = null; }
      if (!id && id !== 0) {
        // fallback: check for dataset (if dragging within same DOM in some browsers)
        const dragging = document.querySelector('.dragging');
        if (dragging && dragging.dataset && dragging.dataset.id) id = Number(dragging.dataset.id);
      }
      if (id == null || Number.isNaN(id)) return;
      handleDrop(zone.id, id);
    });
  });
}

function handleDrop(zoneId, productId){
  const prod = allProducts.find((p) => p.id === productId);
  if (!prod) return;

  if (zoneId === "cartDock"){
    addToCart(productId, 1);
    try { showToast(`${prod.name.split(" ").slice(0,3).join(" ")} ditambahkan ke Keranjang`); } catch(e){}
  } else if (zoneId === "compareTray"){
    let cmp = getCompare();
    if (!cmp.includes(productId)) {
      if (cmp.length >= 2) cmp.shift();
      cmp.push(productId);
    }
    setCompare(cmp);
    try { showToast(`${prod.name.split(" ").slice(0,3).join(" ")} ditambahkan ke Compare`); } catch(e){}
  }
  renderDockFromState();
  try { updateCartIndicator(); } catch (e) {}
}

function renderDockFromState(){
  const cartEntries = getCart();
  const cmpIds = getCompare();
  const cartList = document.getElementById("cartDockList");
  const compareList = document.getElementById("compareList");

  if (cartList){
    cartList.innerHTML = "";
    cartEntries.forEach((entry) => {
      const id = entry.id;
      const qty = entry.qty || 1;
      const p = allProducts.find((x) => x.id === id); if (!p) return;
      const chip = document.createElement("button");
      chip.className = "btn-secondary";
      chip.style.fontSize = ".8rem";
      chip.textContent = `${p.name.split(" ").slice(0,3).join(" ")} x${qty}`;
      chip.title = "Klik untuk hapus dari Cart Dock";
      chip.onclick = () => { removeFromCart(id); renderDockFromState(); try{ updateCartIndicator(); }catch(e){} };
      cartList.appendChild(chip);
    });
  }

  if (compareList){
    compareList.innerHTML = "";
    cmpIds.forEach((id) => {
      const p = allProducts.find((x) => x.id === id); if (!p) return;
      const chip = document.createElement("button");
      chip.className = "btn-secondary";
      chip.style.fontSize = ".8rem";
      chip.textContent = p.name.split(" ").slice(0,3).join(" ");
      chip.title = "Klik untuk hapus dari Compare Tray";
      chip.onclick = () => { setCompare(cmpIds.filter((x)=>x!==id)); renderDockFromState(); };
      compareList.appendChild(chip);
    });
  }
}
