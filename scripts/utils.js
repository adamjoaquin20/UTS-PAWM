// utils.js
const PLACEHOLDER = "/assets/placeholder.svg";

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
