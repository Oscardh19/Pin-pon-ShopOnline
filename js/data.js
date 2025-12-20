<!-- js/data.js -->
<script type="module">
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

  // ===== ESTADO GLOBAL =====
  window.appState = {
    products: [],
    categories: [],
    settings: {
      exchangeRate: 300,
      bannerTitle: "¡Gran Apertura!",
      bannerSub: "Compra con confianza",
      maintenance: false
    }
  };

  // ===== REFERENCIAS =====
  const productsRef = collection(window.db, "products");
  const categoriesRef = collection(window.db, "categories");
  const settingsRef = doc(window.db, "settings", "main");

  // ===== CARGAR TODO =====
  window.loadDataFromFirebase = async function () {
    await loadSettings();
    await loadCategories();
    await loadProducts();
    console.log("📦 Datos cargados desde Firebase");
  };

  // ===== SETTINGS =====
  async function loadSettings() {
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      window.appState.settings = snap.data();
    } else {
      await setDoc(settingsRef, window.appState.settings);
    }
  }

  window.updateSettingsFirebase = async function (newSettings) {
    window.appState.settings = { ...window.appState.settings, ...newSettings };
    await updateDoc(settingsRef, window.appState.settings);
  };

  // ===== CATEGORÍAS =====
  async function loadCategories() {
    window.appState.categories = [];
    const snap = await getDocs(categoriesRef);
    snap.forEach(d => {
      window.appState.categories.push({ id: d.id, ...d.data() });
    });
  }

  window.addCategoryFirebase = async function (name) {
    await addDoc(categoriesRef, { name });
    await loadCategories();
  };

  window.deleteCategoryFirebase = async function (id) {
    await setDoc(doc(categoriesRef, id), {}, { merge: false });
  };

  // ===== PRODUCTOS =====
  async function loadProducts() {
    window.appState.products = [];
    const snap = await getDocs(productsRef);
    snap.forEach(d => {
      window.appState.products.push({ id: d.id, ...d.data() });
    });
  }

  window.saveProductFirebase = async function (product) {
    if (product.id) {
      await updateDoc(doc(productsRef, product.id), product);
    } else {
      await addDoc(productsRef, product);
    }
    await loadProducts();
  };

  window.deleteProductFirebase = async function (id) {
    await updateDoc(doc(productsRef, id), { deleted: true });
  };

  // ===== MIGRACIÓN DESDE localStorage (UNA VEZ) =====
  window.migrateFromLocalStorage = async function () {
    const local = localStorage.getItem("pinpon_data_v3");
    if (!local) return;

    const data = JSON.parse(local);

    // Settings
    if (data.exchangeRate) {
      await updateSettingsFirebase({
        exchangeRate: data.exchangeRate,
        bannerTitle: data.bannerTitle,
        bannerSub: data.bannerSub,
        maintenance: data.maintenance
      });
    }

    // Categorías
    if (Array.isArray(data.categories)) {
      for (const c of data.categories) {
        await addDoc(categoriesRef, { name: c });
      }
    }

    // Productos
    if (Array.isArray(data.products)) {
      for (const p of data.products) {
        await addDoc(productsRef, {
          name: p.name,
          category: p.category,
          price: p.price,
          oldPrice: p.oldPrice || 0,
          stock: p.stock,
          isNew: p.isNew || false,
          image: p.image,
          desc: p.desc || ""
        });
      }
    }

    localStorage.removeItem("pinpon_data_v3");
    console.log("✅ Migración completada");
  };
</script>
