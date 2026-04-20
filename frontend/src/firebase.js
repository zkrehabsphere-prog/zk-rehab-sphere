import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC1UnprUUzIaSnHv5dNLt6NGLjG5Bl1N2Y",
  authDomain: "zkrehabsphere-dff99.firebaseapp.com",
  projectId: "zkrehabsphere-dff99",
  storageBucket: "zkrehabsphere-dff99.firebasestorage.app",
  messagingSenderId: "77184416143",
  appId: "1:77184416143:web:0543f0f1b3085ff96b33fa",
  measurementId: "G-62ZEP0588R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
