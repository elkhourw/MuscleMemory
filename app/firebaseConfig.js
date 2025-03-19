import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase (remplacez par votre configuration)
const firebaseConfig = {
  apiKey: "AIzaSyBLX-pMif8LM_13AKdVPQJks9n02iQwyyc",
  authDomain: "sinuous-branch-314117.firebaseapp.com",
  databaseURL: "https://sinuous-branch-314117-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sinuous-branch-314117",
  storageBucket: "sinuous-branch-314117.appspot.com",
  messagingSenderId: "837637813573",
  appId: "1:837637813573:web:3be8df78f58d6580807a2c"
};

// Initialiser Firebase uniquement s'il n'est pas déjà initialisé
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };