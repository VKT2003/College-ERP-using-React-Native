import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkasAIvt-XzcBzmNqp__-aCWwBuo7eMvw",
  authDomain: "loginauth-c264b.firebaseapp.com",
  projectId: "loginauth-c264b",
  storageBucket: "loginauth-c264b.appspot.com",
  messagingSenderId: "236488206256",
  appId: "1:236488206256:web:544f6855bfefd60d41d875"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
