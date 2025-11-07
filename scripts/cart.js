// cart.js — render cart page and allow removing items
document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  try { updateCartIndicator(); } catch (e) {}
});

function renderCartPage(){
  const cart = getCart();
  const container = document.getElementById('cartContents');
  const empty = document.getElementById('cartEmpty');
  container.innerHTML = '';
  if (!cart || !cart.length){
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const list = document.createElement('div');
  list.className = 'cart-list';
  // cart entries are {id, qty}
  cart.forEach(entry => {
    const id = entry.id; const qty = entry.qty || 1;
    const p = (window.allProducts || []).find(x => x.id === id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '1rem'; row.style.padding = '.6rem 0';

    const img = document.createElement('img'); img.src = p.image || '/assets/placeholder.svg'; img.style.width = '64px'; img.style.height = '64px'; img.style.objectFit='cover';
    const info = document.createElement('div');
    info.innerHTML = `<div style="font-weight:600">${p.name}</div><div style="color:#666">${formatPrice(p.price)}</div>`;
    const qtyWrap = document.createElement('div'); qtyWrap.style.display='flex'; qtyWrap.style.alignItems='center'; qtyWrap.style.gap='.4rem';
    const qtyInput = document.createElement('input'); qtyInput.type='number'; qtyInput.min='1'; qtyInput.value = qty; qtyInput.style.width='64px';
    qtyInput.addEventListener('change', (e) => {
      const v = Math.max(1, parseInt(e.target.value || '1', 10));
      setCartQty(id, v);
      renderCartPage();
      try { updateCartIndicator(); } catch(e){}
    });

    const actions = document.createElement('div');
    actions.style.marginLeft = 'auto';
    const remove = document.createElement('button'); remove.className = 'btn-secondary'; remove.textContent = 'Hapus';
    remove.onclick = () => { removeFromCart(id); renderCartPage(); try{ updateCartIndicator(); }catch(e){} };
    const view = document.createElement('a'); view.className='btn-view'; view.href = `product.html?id=${p.id}`; view.textContent = 'Lihat'; view.style.marginLeft = '.6rem';

    qtyWrap.appendChild(qtyInput);
    actions.appendChild(remove); actions.appendChild(view);
    row.appendChild(img); row.appendChild(info); row.appendChild(qtyWrap); row.appendChild(actions);
    list.appendChild(row);
  });

  container.appendChild(list);
  // show totals
  const total = cart.reduce((s, it) => {
    const p = (window.allProducts || []).find(x => x.id === it.id);
    return s + (p ? (p.price * (it.qty || 1)) : 0);
  }, 0);
  const totEl = document.createElement('div'); totEl.style.marginTop = '1rem'; totEl.style.fontWeight='600'; totEl.textContent = `Total: ${formatPrice(total)}`;
  container.appendChild(totEl);
}
// removal handled by shared removeFromCart (utils.js) which already updates storage
