// frontend/src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAA-FFm9SW5shf671Sr8Wdg165x5B9V7bo",
  authDomain: "ai--study-planner.firebaseapp.com",
  projectId: "ai--study-planner",
  storageBucket: "ai--study-planner.firebasestorage.app",
  messagingSenderId: "537126387945",
  appId: "1:537126387945:web:25c7ad4f10012fc8dc3078",
  measurementId: "G-9VMYRLBXVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
