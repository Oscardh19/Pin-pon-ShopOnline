<!-- js/firebase.js -->
<script type="module">
  // Import Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

  // TU CONFIGURACIÓN FIREBASE
  const firebaseConfig = {
    apiKey: "AIzaSyA04fdbHRhwgJVQrEtDJoAm7adm99h6a_w",
    authDomain: "pinponshop-2f5c8.firebaseapp.com",
    projectId: "pinponshop-2f5c8",
    storageBucket: "pinponshop-2f5c8.firebasestorage.app",
    messagingSenderId: "433977596942",
    appId: "1:433977596942:web:9f4fbbd81cf2e640a4f05f"
  };

  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);

  // Servicios
  window.db = getFirestore(app);
  window.auth = getAuth(app);
  window.storage = getStorage(app);

  console.log("🔥 Firebase conectado correctamente");
</script>
