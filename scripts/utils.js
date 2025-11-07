// utils.js
const PLACEHOLDER = "/assets/placeholder.svg";

// shared storage keys
const CART_KEY = "autocuan_cart";
const COMPARE_KEY = "autocuan_compare";

function getCart(){
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    // normalize legacy format (array of ids) to [{id, qty}]
    if (Array.isArray(raw) && raw.length && typeof raw[0] === 'number') {
      return raw.map(id => ({ id, qty: 1 }));
    }
    // ensure each item has id and qty
    if (Array.isArray(raw)) return raw.map(it => ({ id: Number(it.id), qty: Number(it.qty) || 1 }));
    return [];
  } catch (e) { return []; }
}
function setCart(v){
  // store normalized array of {id,qty}
  try { localStorage.setItem(CART_KEY, JSON.stringify(v || [])); } catch(e) { console.warn('setCart failed', e); }
}
function getCompare(){ return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"); }
function setCompare(v){ localStorage.setItem(COMPARE_KEY, JSON.stringify(v)); }

// cart helpers that work with {id, qty} entries
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === productId);
  if (existing) existing.qty = Math.max(1, existing.qty + qty);
  else cart.push({ id: productId, qty: Math.max(1, qty) });
  setCart(cart);
  // notify other windows
  try { window.dispatchEvent(new Event('storage')); } catch(e){}
  return cart;
}

function removeFromCart(productId){
  const cart = getCart().filter(c => c.id !== productId);
  setCart(cart);
  try { window.dispatchEvent(new Event('storage')); } catch(e){}
  return cart;
}

function setCartQty(productId, qty){
  const cart = getCart();
  const idx = cart.findIndex(c => c.id === productId);
  if (idx === -1) {
    if (qty > 0) cart.push({ id: productId, qty });
  } else {
    if (qty > 0) cart[idx].qty = qty; else cart.splice(idx,1);
  }
  setCart(cart);
  try { window.dispatchEvent(new Event('storage')); } catch(e){}
  return cart;
}

function getCartCount(){
  const cart = getCart();
  return cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);
}

// harga
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// query param
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// splash (hanya di index)
function hideSplash() {
  const s = document.getElementById("splash");
  if (s) s.classList.add("hidden");
}

// small toast notification (non-blocking)
function showToast(message, timeout = 2200) {
  try {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.setAttribute("aria-live", "polite");
      container.style.position = "fixed";
      container.style.right = "1rem";
      container.style.bottom = "1rem";
      container.style.zIndex = 9999;
      document.body.appendChild(container);
    }

    const t = document.createElement("div");
    t.className = "site-toast";
    t.textContent = message;
    t.style.background = "rgba(0,0,0,0.85)";
    t.style.color = "#fff";
    t.style.padding = "0.6rem 0.9rem";
    t.style.marginTop = "0.5rem";
    t.style.borderRadius = "6px";
    t.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    t.style.fontSize = ".9rem";
    t.style.opacity = "0";
    t.style.transition = "opacity .18s ease, transform .2s ease";
    t.style.transform = "translateY(6px)";

    container.appendChild(t);
    // force reflow then show
    requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; });

    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(6px)";
      setTimeout(() => t.remove(), 220);
    }, timeout);
  } catch (e) {
    console.warn("showToast failed", e);
  }
}

// update cart indicator used across pages
function updateCartIndicator() {
  try {
    const count = String(getCartCount() || 0);
    // update all #cartCount spans (multiple pages may contain it)
    document.querySelectorAll('#cartCount').forEach((el) => { el.textContent = count; });
    // update any element with .cart-indicator-count
    document.querySelectorAll('.cart-indicator-count').forEach((el) => { el.textContent = count; });
    // small pulse on any indicator button
    const indicators = document.querySelectorAll('#cartIndicator, .cartIndicator');
    indicators.forEach((node) => {
      try { node.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 220 }); } catch (e) {}
    });
  } catch (e) {
    console.warn('updateCartIndicator failed', e);
  }
}

// keep indicators in sync across tabs/windows
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY) updateCartIndicator();
});
