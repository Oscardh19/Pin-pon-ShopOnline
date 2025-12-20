<!-- js/orders.js -->
<script type="module">
  import {
    collection,
    addDoc,
    getDocs
  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

  const ordersRef = collection(window.db, "orders");

  // ===== GUARDAR PEDIDO =====
  window.saveOrderFirebase = async function (order) {
    order.createdAt = new Date();
    await addDoc(ordersRef, order);
    console.log("📦 Pedido guardado en Firebase");
  };

  // ===== ESTADÍSTICAS =====
  window.getOrderStats = async function () {
    const snap = await getDocs(ordersRef);

    let totalOrders = 0;
    let totalUSD = 0;
    let totalMN = 0;
    const productCount = {};

    snap.forEach(d => {
      const o = d.data();
      totalOrders++;
      totalUSD += o.totalUSD;
      totalMN += o.totalMN;

      o.items.forEach(i => {
        productCount[i.name] = (productCount[i.name] || 0) + i.qty;
      });
    });

    let topProduct = "—";
    let max = 0;
    for (const p in productCount) {
      if (productCount[p] > max) {
        max = productCount[p];
        topProduct = p;
      }
    }

    return {
      totalOrders,
      totalUSD,
      totalMN,
      topProduct
    };
  };
</script>
