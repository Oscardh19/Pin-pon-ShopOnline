<!-- js/app.js -->
<script type="module">

  // ===== ESTADO LOCAL =====
  window.cart = [];

  // ===== MODALES =====
  window.openModal = function(id) {
    document.getElementById(id)?.classList.add("open");
  };

  window.closeModal = function(id) {
    document.getElementById(id)?.classList.remove("open");
  };

  window.openMenu = function() {
    openModal("menu-modal");
  };

  window.openCart = function() {
    renderCart();
    openModal("cart-modal");
  };

  // ===== CARRITO =====
  window.addToCart = function(productId, qty = 1) {
    const p = window.appState.products.find(x => x.id === productId);
    if (!p) return;

    const existing = cart.find(x => x.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty });
    }

    document.getElementById("cart-count").innerText =
      cart.reduce((s, i) => s + i.qty, 0);
  };

  function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:#999">El carrito está vacío</p>`;
      document.getElementById("cart-total").innerText = "$0.00";
      return;
    }

    cart.forEach(item => {
      const p = window.appState.products.find(x => x.id === item.id);
      if (!p) return;

      const sub = p.price * item.qty;
      total += sub;

      container.innerHTML += `
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <span>${p.name} x${item.qty}</span>
          <strong>$${sub.toFixed(2)}</strong>
        </div>
      `;
    });

    document.getElementById("cart-total").innerText =
      `$${total.toFixed(2)}`;
  }

  // ===== CHECKOUT =====
  window.openCheckout = function() {
    closeModal("cart-modal");
    openModal("checkout-modal");
  };

  window.processOrder = async function(e) {
    e.preventDefault();

    let totalUSD = 0;
    const items = [];

    cart.forEach(i => {
      const p = window.appState.products.find(x => x.id === i.id);
      if (p) {
        totalUSD += p.price * i.qty;
        items.push({ name: p.name, qty: i.qty });
      }
    });

    const order = {
      items,
      totalUSD,
      totalMN: totalUSD * window.appState.settings.exchangeRate,
      payment: document.getElementById("c-payment").value
    };

    await window.saveOrderFirebase(order);

    const msg = `Pedido PIN
