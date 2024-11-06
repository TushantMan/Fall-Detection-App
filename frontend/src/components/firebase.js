import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Get you own API key",
  authDomain: "rt-fall-detection.firebaseapp.com",
  projectId: "rt-fall-detection",
  storageBucket: "rt-fall-detection.appspot.com",
  messagingSenderId: "762693262797",
  appId: "1:762693262797:web:29ef643ebff4bc5ee5b884",
  measurementId: "G-D3ZS6QDXS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;